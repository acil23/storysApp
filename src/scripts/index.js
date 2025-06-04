// CSS imports
import '../styles/styles.css';
import '../styles/main.css';
import 'leaflet/dist/leaflet.css';
import updateNavigationMenu from './utils/auth-helper';
import App from './pages/app';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();
  updateNavigationMenu();
  await registerServiceWorker();
  console.log('Berhasil mendaftarkan service worker.');

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    updateNavigationMenu();
  });
});
