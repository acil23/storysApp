// src/scripts/pages/login/login-presenter.js
export default class LoginPresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
    }
  
    async login({ email, password }) {
      try {
        const result = await this._model.login({ email, password });
        this._model.saveToken(result.token);
        this._view.showSuccess(`Welcome, ${result.name}`);
      } catch (err) {
        this._view.showError(err.message);
      }
    }
  }
  