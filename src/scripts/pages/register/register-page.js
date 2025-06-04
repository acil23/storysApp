// src/scripts/pages/register/register-page.js
import RegisterPresenter from "./register-presenter";
import { registerUser } from "../../models/auth-api";

export default class RegisterPage {
  async render() {
    return `
        <section class="register-container" aria-labelledby="registerHeading">
            <h2 id="registerHeading">Register</h2>
            <form id="registerForm" aria-describedby="registerInstructions">
            <label for="name">Nama</label>
            <input type="text" id="name" required aria-required="true" />

            <label for="email">Email</label>
            <input type="email" id="email" required aria-required="true" />

            <label for="password">Password</label>
            <input type="password" id="password" required aria-required="true" />

            <button type="submit" aria-label="Daftar akun">Register</button>
            </form>
            <p id="registerMessage" aria-live="polite"></p>
        </section>`;
  }

  async afterRender() {
    const form = document.querySelector("#registerForm");
    const messageEl = document.querySelector("#registerMessage");

    const presenter = new RegisterPresenter({
      view: {
        showSuccess(msg) {
          messageEl.textContent = msg;
          setTimeout(() => (window.location.href = "#/login"), 1000);
        },
        showError(err) {
          messageEl.textContent = err;
        },
      },
      model: {
        register: registerUser,
      },
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // ⛔ mencegah reload halaman

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(
          "https://story-api.dicoding.dev/v1/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          }
        );

        const result = await response.json();
        if (!result.error) {
          alert("Berhasil register! Silakan login.");
          window.location.hash = "/login"; // ✅ arahkan ke halaman login
        } else {
          alert(result.message);
        }
      } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan saat register.");
      }
    });
  }
}
