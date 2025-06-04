// src/scripts/pages/home/home-presenter.js
export default class HomePresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
    }
  
    async init() {
      try {
        const stories = await this._model.getAllStories();
        this._view.showStories(stories);
      } catch (error) {
        this._view.showError(error.message);
      }
    }
  }
  