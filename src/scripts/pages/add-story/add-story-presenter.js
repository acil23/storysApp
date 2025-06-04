export default class AddStoryPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async addStory(formData) {
    try {
      this._view.showMessage("Mengirim data...");
      await this._model.addStory(formData);
      this._view.showMessage("Cerita berhasil ditambahkan!");
    } catch (err) {
      this._view.showMessage(err.message || "Terjadi kesalahan.");
      throw err;
    }
  }
}
