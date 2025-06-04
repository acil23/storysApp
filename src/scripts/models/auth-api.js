// src/scripts/models/auth-api.js
const BASE_URL = 'https://story-api.dicoding.dev/v1';

export async function loginUser({ email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message);
  }

  return responseJson.loginResult;
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(responseJson.message);
  }

  return responseJson;
}
