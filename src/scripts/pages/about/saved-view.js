export default class SavedView {
  constructor() {
    this._container = document.getElementById('saved-content');
  }

  showStories(stories) {
    this._container.innerHTML = '';

    if (stories.length === 0) {
      this._container.innerHTML = '<p>Tidak ada story tersimpan.</p>';
      return;
    }

    stories.forEach((story) => {
      const storyElement = document.createElement('div');
      storyElement.className = 'story-item';
      storyElement.innerHTML = `
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <button class="delete-button" data-id="${story.id}" aria-label="Hapus story ${story.name}">Hapus</button>
      `;
      this._container.appendChild(storyElement);
    });
  }

  bindDeleteHandler(callback) {
    this._container.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-button')) {
        const id = event.target.dataset.id;
        callback(id);
      }
    });
  }
}
