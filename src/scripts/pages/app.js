import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { generateSubscribeButtonTemplate } from "../templates";
import { subscribe } from '../utils/notification-helper';

const mainContent = document.querySelector("#main-content"); // Seleksi elemen id="main-content" bisa disesuaikan kembali jika berbeda
const skipLink = document.querySelector(".skip-link"); // Seleksi elemen class="skip-link" bisa disesuaikan kembali jika berbeda
skipLink.addEventListener("click", function (event) {
  event.preventDefault(); // Mencegah refresh halaman
  skipLink.blur(); // Menghilangkan fokus skip to content

  mainContent.focus(); // Fokus ke konten utama
  mainContent.scrollIntoView(); // Halaman scroll ke konten utama
});

class App {
  #currentPage = null;
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const expanded = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute("aria-expanded", expanded);
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById(
      "push-notification-tools"
    );
    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document
      .getElementById("subscribe-button")
      .addEventListener("click", () => {
        subscribe();   
      });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (this.#currentPage && typeof this.#currentPage.destroy === "function") {
      this.#currentPage.destroy();
    }

    const performRender = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.#currentPage = page;

      if (localStorage.getItem("story_token")) {
        this.#setupPushNotification();
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(() => performRender());
    } else {
      await performRender();
    }
  }
}

export default App;
