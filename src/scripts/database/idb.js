import { openDB } from 'idb';

const DB_NAME = 'story-app-database';
const DB_VERSION = 1;
const STORE_NAME = 'saved-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const FavoriteStoryIdb = {
  async getAllStories() {
    return (await dbPromise).getAll(STORE_NAME);
  },

  async getStory(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },

  async saveStory(story) {
    return (await dbPromise).put(STORE_NAME, story);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },
};

export default FavoriteStoryIdb;
