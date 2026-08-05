const TEMP_UNIT_KEY = 'tempUnit';

function getTemperatureUnit() {
  return localStorage.getItem(TEMP_UNIT_KEY) || 'F';
}

function setTemperatureUnit(unit) {
  if (!['F', 'C'].includes(unit)) {
    throw new Error('Invalid unit. Use "F" or "C"');
  }
  localStorage.setItem(TEMP_UNIT_KEY, unit);
}

function convertTemperature(celsius, unit) {
  if (unit === 'F') {
    return (celsius * 9/5) + 32;
  }
  return celsius;
}

function formatTemperature(fahrenheit, unit) {
  if (unit === 'F') {
    return Math.round(fahrenheit);
  }
  const celsius = (fahrenheit - 32) * 5/9;
  return Math.round(celsius);
}

function getTemperatureSymbol(unit) {
  return unit === 'F' ? '°F' : '°C';
}

function calculateDewPoint(temp, humidity) {
  // Magnus formula for dew point calculation
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return Math.round(dewPoint * 10) / 10;
}

function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return directions[index % 16];
}

function formatPressure(pressureMb) {
  const pressureIn = (pressureMb / 33.86).toFixed(2);
  return { mb: pressureMb, inHg: pressureIn };
}

// Favorite cities management
const FAVORITES_KEY = 'favoriteCities';

function getFavoriteCities() {
  const favorites = localStorage.getItem(FAVORITES_KEY) || '[]';
  return JSON.parse(favorites);
}

function addFavoriteCity(cityName) {
  const favorites = getFavoriteCities();
  const normalizedName = cityName.trim().toLowerCase();

  if (!favorites.find(c => c.toLowerCase() === normalizedName)) {
    favorites.push(cityName);
    if (favorites.length > 10) {
      favorites.shift();
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true;
  }
  return false;
}

function removeFavoriteCity(cityName) {
  const favorites = getFavoriteCities();
  const normalizedName = cityName.trim().toLowerCase();
  const filtered = favorites.filter(c => c.toLowerCase() !== normalizedName);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  return favorites.length !== filtered.length;
}

function isFavoriteCity(cityName) {
  const favorites = getFavoriteCities();
  const normalizedName = cityName.trim().toLowerCase();
  return favorites.some(c => c.toLowerCase() === normalizedName);
}

export {
  getTemperatureUnit,
  setTemperatureUnit,
  convertTemperature,
  formatTemperature,
  getTemperatureSymbol,
  calculateDewPoint,
  getWindDirection,
  formatPressure,
  getFavoriteCities,
  addFavoriteCity,
  removeFavoriteCity,
  isFavoriteCity,
  TEMP_UNIT_KEY,
  FAVORITES_KEY,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTemperatureUnit,
    setTemperatureUnit,
    convertTemperature,
    formatTemperature,
    getTemperatureSymbol,
    calculateDewPoint,
    getWindDirection,
    formatPressure,
    getFavoriteCities,
    addFavoriteCity,
    removeFavoriteCity,
    isFavoriteCity,
    TEMP_UNIT_KEY,
    FAVORITES_KEY,
  };
}
