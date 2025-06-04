import StoryDb from '../../database/idb';

export default class SavedPresenter {
  constructor({ view }) {
    this._view = view;
  }

  async init() {
    const stories = await StoryDb.getAllStories();
    this._view.showStories(stories);
    this._view.bindDeleteHandler(this.handleDeleteStory.bind(this));
  }

  async handleDeleteStory(id) {
    await StoryDb.deleteStory(id);
    const stories = await StoryDb.getAllStories();
    this._view.showStories(stories); // Refresh tampilan
  }
}
