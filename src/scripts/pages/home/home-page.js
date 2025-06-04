import HomePresenter from "./home-presenter";
import { getAllStories } from "../../models/story-api";
import createStoryItemTemplate from "../../views/components/story-item";
import L from "leaflet";

export default class HomePage {
  async render() {
    return `
  <section class="container" aria-labelledby="homeHeading">
    <h2 id="mapHeading">Peta Lokasi Cerita</h2>
    <div id="map" style="height: 400px; border-radius: 8px;" role="application" aria-labelledby="mapHeading"></div>
    <h1 id="homeHeading" class="section-title">Cerita Terbaru</h1>
    <div id="stories" class="stories-list" aria-live="polite">Loading...</div>
  </section>
`;
  }

  async afterRender() {
    const container = document.querySelector("#stories");

    const presenter = new HomePresenter({
      view: {
        showStories(stories) {
          container.innerHTML = "";
          stories.forEach((story) => {
            container.innerHTML += createStoryItemTemplate(story);
          });

          // Bind tombol simpan
          const saveButtons = container.querySelectorAll(".save-btn");
          saveButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {
              const id = btn.dataset.id;
              const storyToSave = stories.find((s) => s.id === id);
              const FavoriteStoryIdb = (
                await import("../../database/idb")
              ).default;

              await FavoriteStoryIdb.saveStory(storyToSave);
              alert("Story disimpan!");
            });
          });

          this.showMap(stories);
        },
        showMap(stories) {
          const mapContainer = document.getElementById("map");
          if (!mapContainer) return;

          const map = L.map("map").setView([-2.5489, 118.0149], 5); // center Indonesia

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(map);

          const storyIcon = L.icon({
            iconUrl: "images/location.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          stories.forEach((story) => {
            if (story.lat && story.lon) {
              L.marker([story.lat, story.lon], { icon: storyIcon })
                .addTo(map)
                .bindPopup(
                  `<strong>${story.name}</strong><br>${story.description}`
                );
            }
          });
        },

        showError(error) {
          container.innerHTML = `<p class="error-message">${error}</p>`;
        },
      },

      model: {
        getAllStories,
      },
    });

    presenter.init();
  }
}
