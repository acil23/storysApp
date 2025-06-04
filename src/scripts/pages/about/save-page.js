import SavedView from './saved-view';
import SavedPresenter from './saved-presenter';

export default class SavedPage {
  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Story Tersimpan</h1>
        <div id="saved-content" class="stories-list" aria-live="polite"></div>
      </section>
    `;
  }

  async afterRender() {
    const view = new SavedView();
    const presenter = new SavedPresenter({ view });
    presenter.init();
  }
}
