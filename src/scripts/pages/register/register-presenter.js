// src/scripts/pages/register/register-presenter.js
export default class RegisterPresenter {
    constructor({ view, model }) {
      this._view = view;
      this._model = model;
    }
  
    async register({ name, email, password }) {
      try {
        await this._model.register({ name, email, password });
        this._view.showSuccess('Registration successful! Redirecting to login...');
      } catch (err) {
        this._view.showError(err.message);
      }
    }
  }
  