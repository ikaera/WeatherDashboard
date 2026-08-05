import { getFavoriteCities, addFavoriteCity, removeFavoriteCity, isFavoriteCity } from './weatherUtils.js';

const favoriteCitiesEl = document.querySelector('#favorite-cities');
const noFavoritesEl = document.querySelector('#no-favorites');

function renderFavoriteCities(onCitySelect) {
  if (!favoriteCitiesEl) return;

  const favorites = getFavoriteCities();

  favoriteCitiesEl.innerHTML = '';

  if (favorites.length === 0) {
    if (noFavoritesEl) {
      noFavoritesEl.textContent = 'No favorites yet';
    }
    return;
  }

  if (noFavoritesEl) {
    noFavoritesEl.textContent = '';
  }

  favorites.forEach(city => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-warning btn-sm mx-1 my-1';
    btn.innerHTML = `⭐ ${city}`;
    btn.addEventListener('click', () => {
      if (onCitySelect) onCitySelect(city);
    });
    favoriteCitiesEl.appendChild(btn);
  });
}

function addFavoriteCityUI(cityName) {
  addFavoriteCity(cityName);
  renderFavoriteCities();
}

function removeFavoriteCityUI(cityName) {
  removeFavoriteCity(cityName);
  renderFavoriteCities();
}

function toggleFavoriteCityUI(cityName) {
  if (isFavoriteCity(cityName)) {
    removeFavoriteCityUI(cityName);
    return false;
  } else {
    addFavoriteCityUI(cityName);
    return true;
  }
}

export {
  renderFavoriteCities,
  addFavoriteCityUI,
  removeFavoriteCityUI,
  toggleFavoriteCityUI,
};
