// src/scripts/models/story-api.js
const BASE_URL = 'https://story-api.dicoding.dev/v1';

import { Auth } from '../utils/auth-helper';

export async function getAllStories() {
  const response = await fetch(`${BASE_URL}/stories?location=1`, {
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
    },
  });
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message);
  }
  return responseJson.listStory;
}

export async function addStory(formData) {
  const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
    },
    body: formData, // FormData berisi file + deskripsi + lokasi
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message);
  }
  return responseJson;
}

