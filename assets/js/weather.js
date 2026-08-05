import { getTemperatureUnit, setTemperatureUnit } from './weatherUtils.js';
import { toggleTheme, getSavedTheme } from './themeManager.js';
import { setAPIKey, fetchWeatherByCity, fetchWeatherByGeolocation, fetchWeatherByCoordinates, saveCityCoordinates } from './apiClient.js';
import { showError, hideError, showLoading, hideLoading, showPlaceholder, showSuccess } from './uiState.js';
import { renderCurrentWeather, renderHourlyForecast, renderFiveDayForecast, renderAlerts, renderComparisonView } from './uiRenderer.js';
import { saveHistory, loadHistory } from './historyManager.js';
import { renderFavoriteCities, toggleFavoriteCityUI } from './favoriteManager.js';
import { startAutoRefresh, stopAutoRefresh } from './refreshManager.js';
import { addCityToComparison, removeCityFromComparison } from './comparisonManager.js';

let currentWeatherData = null;
let forecastData = null;
let refreshInterval = 15 * 60 * 1000;

const cityFormEl = document.querySelector('form');
const cityInput = document.querySelector('#city-input');
const clearBtn = document.querySelector('#clear-btn');
const compareBtn = document.querySelector('#compare-btn');
const clearCompareBtn = document.querySelector('#clear-compare-btn');
const tempUnitToggle = document.querySelectorAll('input[name="tempUnit"]');
const themeToggle = document.querySelector('#theme-toggle');

function handleCitySearch(city) {
  if (!city || city.trim() === '') return;

  showLoading();
  saveHistory(city);

  fetchWeatherByCity(city)
    .then(weatherData => {
      const cityCoords = saveCityCoordinates(weatherData);
      currentWeatherData = weatherData;
      hideLoading();
      hideError();

      renderCurrentWeather(weatherData, handleFavoriteToggle);
      renderAlerts(weatherData);
      startAutoRefresh(() => refreshWeather(weatherData), refreshInterval);

      return cityCoords;
    })
    .then(coords => fetchWeatherByCoordinates(coords.longitude, coords.latitude))
    .then(data => {
      forecastData = data;
      renderHourlyForecast(data);
      renderFiveDayForecast(data);
    })
    .catch(error => {
      hideLoading();
      showPlaceholder('❌ Unable to load weather data');
      showError(error.message);
      console.error('Weather fetch error:', error);
    });
}

function refreshWeather(weatherData) {
  if (!weatherData) return;

  fetchWeatherByCoordinates(weatherData.coord.lon, weatherData.coord.lat)
    .then(data => {
      forecastData = data;
      renderHourlyForecast(data);
      renderFiveDayForecast(data);
    })
    .catch(error => console.error('Refresh error:', error));
}

function handleFavoriteToggle(cityName) {
  toggleFavoriteCityUI(cityName);
  renderFavoriteCities(handleCitySearch);
  if (currentWeatherData) {
    renderCurrentWeather(currentWeatherData, handleFavoriteToggle);
  }
}

function handleTemperatureUnitChange(unit) {
  setTemperatureUnit(unit);
  if (currentWeatherData) {
    renderCurrentWeather(currentWeatherData, handleFavoriteToggle);
  }
  if (forecastData) {
    renderHourlyForecast(forecastData);
    renderFiveDayForecast(forecastData);
  }
}

function handleThemeToggle() {
  const newTheme = toggleTheme();
  updateThemeIcon(newTheme);
}

function handleAddToComparison() {
  if (!currentWeatherData) {
    showError('No weather data loaded. Search for a city first.');
    return;
  }

  try {
    addCityToComparison(currentWeatherData);
    showSuccess(`Added ${currentWeatherData.name} to comparison`);
    renderComparisonView();
  } catch (error) {
    showError(error.message);
  }
}

function handleRemoveFromComparison(cityName) {
  removeCityFromComparison(cityName);
  renderComparisonView();
  showSuccess(`Removed ${cityName} from comparison`);
}

window.removeFromComparison = handleRemoveFromComparison;

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

function initializeThemeIcon() {
  const currentTheme = getSavedTheme();
  updateThemeIcon(currentTheme);
}

function setupEventListeners() {
  if (cityFormEl) {
    cityFormEl.addEventListener('submit', e => {
      e.preventDefault();
      const city = cityInput.value.trim();
      if (city) {
        handleCitySearch(city);
        cityFormEl.reset();
      }
    });
  }

  tempUnitToggle.forEach(toggle => {
    toggle.addEventListener('change', e => handleTemperatureUnitChange(e.target.value));
  });

  const savedUnit = getTemperatureUnit();
  const toggleInput = document.querySelector(`input[name="tempUnit"][value="${savedUnit}"]`);
  if (toggleInput) {
    toggleInput.checked = true;
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('history');
      const pastSearchEl = document.querySelector('#past-searched-cities');
      if (pastSearchEl) pastSearchEl.innerHTML = '';
    });
  }

  if (compareBtn) {
    compareBtn.addEventListener('click', handleAddToComparison);
  }

  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      localStorage.removeItem('citiesComparison');
      renderComparisonView();
    });
  }
}

function loadCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetchWeatherByGeolocation(lat, lon)
          .then(data => {
            currentWeatherData = data;
            hideLoading();
            hideError();
            renderCurrentWeather(data, handleFavoriteToggle);
            renderAlerts(data);

            return saveCityCoordinates(data);
          })
          .then(coords => fetchWeatherByCoordinates(coords.longitude, coords.latitude))
          .then(data => {
            forecastData = data;
            renderHourlyForecast(data);
            renderFiveDayForecast(data);
          })
          .catch(error => console.error('Geolocation weather error:', error));
      },
      error => console.log('Geolocation unavailable:', error.message)
    );
  }
}

function initialize(apiKey, refInterval = 15 * 60 * 1000) {
  setAPIKey(apiKey);
  refreshInterval = refInterval;

  initializeThemeIcon();
  renderFavoriteCities(handleCitySearch);
  loadHistory(handleCitySearch);
  renderComparisonView();
  setupEventListeners();
  loadCurrentLocation();
}

export { initialize as initializeApp };