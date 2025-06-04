import CONFIG from '../config';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}

const StoryApi = {
  async getAll() {
    const response = await fetch(`${BASE_URL}/stories`);
    const json = await response.json();
    return json.listStory;
  },
};

export default StoryApi;