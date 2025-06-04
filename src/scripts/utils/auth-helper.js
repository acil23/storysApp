// src/scripts/utils/auth-helper.js
const TOKEN_KEY = 'story_token';

export const Auth = {
  saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

function updateNavigationMenu() {
  const navList = document.getElementById("nav-list");

  if (!navList) return;

  const token = localStorage.getItem(TOKEN_KEY);

  navList.innerHTML = ""; // Hapus semua dulu

  if (token) {
    // Sudah login
    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add-story">Tambah Cerita</a></li>
      <li><a href="#/about">Saved</a></li>
      <li id="push-notification-tools" class="push-notification-tools">Subscribe</li>
      <li><button id="logout-btn" class="logout-button">Logout</button></li>
    `;
  } else {
    // Belum login
    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add-story">Tambah Cerita</a></li>
      <li><a href="#/about">Saved</a></li>
    `;
  }

  // Event listener untuk logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(TOKEN_KEY); // Hapus token
      updateNavigationMenu();
      window.location.hash = "#/login"; // redirect ke login
    });
  }
}

export default updateNavigationMenu;
