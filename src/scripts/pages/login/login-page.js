// src/scripts/pages/login/login-page.js
import LoginPresenter from "./login-presenter";
import { loginUser } from "../../models/auth-api";
import { Auth } from "../../utils/auth-helper";

export default class LoginPage {
  async render() {
    return `
  <section class="login-container" aria-labelledby="loginHeading">
    <h2 id="loginHeading">Login</h2>
    <form id="loginForm" aria-describedby="loginInstructions">
      <label for="email">Email</label>
      <input type="email" id="email" required aria-required="true" />
      
      <label for="password">Password</label>
      <input type="password" id="password" required aria-required="true" />

      <button type="submit" aria-label="Masuk ke akun">Login</button>
    </form>
    <p id="loginMessage" aria-live="polite"></p>
  </section>
`;
  }

  async afterRender() {
    const form = document.querySelector("#loginForm");
    const messageEl = document.querySelector("#loginMessage");

    const presenter = new LoginPresenter({
      view: {
        showSuccess(message) {
          messageEl.textContent = message;
          window.location.href = "#/";
        },
        showError(error) {
          messageEl.textContent = error;
        },
      },
      model: {
        login: loginUser,
        saveToken: Auth.saveToken,
      },
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      await presenter.login({ email, password });
    });
  }
}
