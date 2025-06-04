import AddStoryPresenter from "./add-story-presenter";
import { addStory } from "../../models/story-api";
import { renderMap, showLoading, hideLoading, showAlert } from "./add-story-view";

export default class AddStoryPage {
  #videoStream = null;

  async render() {
    return `
    <section class="container" aria-labelledby="addStoryHeading">
      <h1 id="addStoryHeading">Tambah Cerita Baru</h1>
      <form id="addStoryForm" aria-describedby="formInstructions" novalidate>
        <div id="loadingIndicator" style="display: none;" role="status" aria-live="polite">Mengirim cerita...</div>

        <div class="camera-wrapper">
          <label for="storyCamera">Ambil Foto</label>
          <video id="storyCamera" autoplay playsinline aria-label="Kamera pengguna" tabindex="0"></video>
          <button id="captureBtn" type="button" aria-label="Ambil gambar dari kamera">Ambil Foto</button>
          <canvas id="canvas" style="display:none;" aria-hidden="true"></canvas>
        </div>

        <div class="form-group">
          <label for="description">Deskripsi Cerita <span aria-hidden="true">*</span></label>
          <textarea id="description" required aria-required="true" aria-label="Deskripsi cerita" rows="4"></textarea>
          <small id="descriptionHelp" class="help-text">Deskripsi tidak boleh kosong dan minimal 10 karakter.</small>
        </div>

        <div class="form-group">
          <label for="map">Pilih Lokasi <span aria-hidden="true">*</span></label>
          <div id="map" style="height: 300px;" role="application" aria-label="Peta untuk memilih lokasi"></div>
          <p id="locationInfo" aria-live="polite">Klik pada peta untuk memilih lokasi.</p>
          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />
        </div>

        <button type="submit" aria-label="Kirim cerita">Kirim Cerita</button>
      </form>
      <p id="formMessage" aria-live="polite"></p>
    </section>`;
  }

  async afterRender() {
    const form = document.getElementById("addStoryForm");
    const descriptionInput = document.getElementById("description");
    const messageEl = document.getElementById("formMessage");
    const video = document.getElementById("storyCamera");
    const canvas = document.getElementById("canvas");
    const captureBtn = document.getElementById("captureBtn");

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.#videoStream = stream;
        video.srcObject = stream;
      } catch (err) {
        console.error("Tidak bisa akses kamera:", err);
      }
    }

    let capturedImageBlob = null;
    captureBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        capturedImageBlob = blob;
      }, "image/jpeg");

      canvas.style.display = "block";
    });

    await renderMap(); // render map dan isi input hidden

    const presenter = new AddStoryPresenter({
      view: {
        showMessage(message) {
          messageEl.textContent = message;
        },
      },
      model: {
        addStory,
      },
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const description = descriptionInput.value.trim();
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;

      // Validasi
      if (description.length < 10) {
        messageEl.textContent = "Deskripsi minimal 10 karakter!";
        descriptionInput.focus();
        return;
      }

      if (!lat || !lon) {
        messageEl.textContent = "Silakan pilih lokasi pada peta terlebih dahulu!";
        return;
      }

      showLoading();

      const formData = new FormData();
      formData.append("description", description);
      formData.append("lat", lat);
      formData.append("lon", lon);
      if (capturedImageBlob) {
        formData.append("photo", capturedImageBlob, "story.jpg");
      }

      try {
        await presenter.addStory(formData);
        showAlert("Cerita berhasil ditambahkan!");
        form.reset();
        canvas.style.display = "none";
        document.getElementById("lat").value = "";
        document.getElementById("lon").value = "";
      } catch (err) {
        messageEl.textContent = err.message;
      } finally {
        hideLoading();
        video.srcObject?.getTracks().forEach((track) => track.stop());
      }
    });
  }

  destroy() {
    if (this.#videoStream) {
      this.#videoStream.getTracks().forEach((track) => track.stop());
      this.#videoStream = null;
    }
  }
}
