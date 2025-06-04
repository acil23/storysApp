const API_BASE = 'https://story-api.dicoding.dev/v1';

const StorySource = {
  async getStoriesWithLocation(token) {
    const response = await fetch(`${API_BASE}/stories?location=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.listStory;
  },
};

export default StorySource;
