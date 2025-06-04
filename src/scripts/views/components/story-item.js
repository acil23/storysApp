// src/scripts/views/components/story-item.js
import { showFormattedDate } from '../../utils';

const createStoryItemTemplate = (story) => `
  <article class="story-item" tabindex="0">
    <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-img" loading="lazy"/>
    <div class="story-info">
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <p class="story-date">${showFormattedDate(story.createdAt, 'id-ID')}</p>
      <button class="save-btn" data-id="${story.id}">Simpan</button>
    </div>
  </article>
`;

export default createStoryItemTemplate;
