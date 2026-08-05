import { getTemperatureUnit } from './weatherUtils.js';

let APIKey = '';
let storedCities = JSON.parse(localStorage.getItem('cities')) || [];

function setAPIKey(key) {
  APIKey = key;
}

function fetchWeatherByCoordinates(lon, lat) {
  const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lon=${lon}&lat=${lat}&appid=${APIKey}&units=imperial`;
  return fetch(requestUrl).then(response => {
    if (!response.ok) throw new Error('Failed to fetch forecast data');
    return response.json();
  });
}

function fetchWeatherByCity(city) {
  const base = 'https://api.openweathermap.org/data/2.5/weather';
  const query = `?q=${city}&appid=${APIKey}&units=imperial`;
  return fetch(base + query).then(response => {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found. Please try another city.`);
      }
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  });
}

function fetchWeatherByGeolocation(lat, lon) {
  const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
  return fetch(requestUrl).then(response => {
    if (!response.ok) throw new Error('Failed to get weather for current location');
    return response.json();
  });
}

function saveCityCoordinates(weatherData) {
  const cityInfo = {
    cityName: weatherData.name,
    longitude: weatherData.coord.lon,
    latitude: weatherData.coord.lat,
  };
  storedCities.push(cityInfo);
  localStorage.setItem('cities', JSON.stringify(storedCities));
  return cityInfo;
}

export {
  setAPIKey,
  fetchWeatherByCoordinates,
  fetchWeatherByCity,
  fetchWeatherByGeolocation,
  saveCityCoordinates,
};
