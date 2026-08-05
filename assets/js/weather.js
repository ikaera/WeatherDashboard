import { getTemperatureUnit, setTemperatureUnit, formatTemperature, getTemperatureSymbol, calculateDewPoint, getWindDirection, formatPressure, getFavoriteCities, addFavoriteCity, removeFavoriteCity, isFavoriteCity } from './weatherUtils.js';
import { getWeatherAlerts } from './weatherAlerts.js';
import { toggleTheme, getSavedTheme } from './themeManager.js';

let APIKey = '';
let REFRESH_INTERVAL = 15 * 60 * 1000;
let refreshTimer = null;
let storredCities = JSON.parse(localStorage.getItem('cities')) || [];
let currentWeatherData = null;
let forecastData = null;

const cityFormEl = document.querySelector('form');
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector('#clear-btn');
const pastSeachEl = document.querySelector('#past-searched-cities');
const currentWeatherEl = document.querySelector('#weather-content');
const weatherPlaceholder = document.querySelector('#weather-placeholder');
const forecastEl = document.querySelector('#five-day-weather');
const hourlyEl = document.querySelector('#hourly-weather');
const errorMessageEl = document.querySelector('#error-message');
const alertsEl = document.querySelector('#weather-alerts');
const tempUnitToggle = document.querySelectorAll('input[name="tempUnit"]');
const favoriteCitiesEl = document.querySelector('#favorite-cities');
const noFavoritesEl = document.querySelector('#no-favorites');

//Create function to display current weather
function displayCurrentWeather(currentWeather) {
  currentWeatherData = currentWeather;
  startAutoRefresh();
  var iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;

  const cityName = currentWeather.name;
  const date = dayjs((currentWeather.dt + currentWeather.timezone) * 1000).format('ddd MM/DD/YYYY hh:mm:ss a');
  const tempUnit = getTemperatureUnit();
  const temp = formatTemperature(currentWeather.main.temp, tempUnit);
  const tempFeelsLike = formatTemperature(currentWeather.main.feels_like, tempUnit);
  const wind = currentWeather.wind.speed;
  const humidity = currentWeather.main.humidity;
  const tempSymbol = getTemperatureSymbol(tempUnit);
  const windDir = getWindDirection(currentWeather.wind.deg);
  const pressure = formatPressure(currentWeather.main.pressure);
  const dewPoint = calculateDewPoint(currentWeather.main.temp, humidity);
  const visibility = (currentWeather.visibility / 1000).toFixed(1);
  const sunrise = dayjs((currentWeather.sys.sunrise + currentWeather.timezone) * 1000).format('hh:mm a');
  const sunset = dayjs((currentWeather.sys.sunset + currentWeather.timezone) * 1000).format('hh:mm a');
  const weatherDesc = currentWeather.weather[0].main;

  const isFav = isFavoriteCity(cityName);
  const favBtnClass = isFav ? 'btn-warning' : 'btn-outline-warning';
  const favBtnText = isFav ? '⭐ Remove from Favorites' : '☆ Add to Favorites';

  currentWeatherEl.innerHTML = `
  <div class="d-flex justify-content-between align-items-start mb-3">
    <div>
      <h4 class="my-2">${cityName} <small>${weatherDesc}</small></h4>
      <h5>${date}</h5>
    </div>
    <button class="btn ${favBtnClass} btn-sm" id="favorite-btn">${favBtnText}</button>
  </div>
  <div class="my-2"> <img src="${iconUrl}" alt="icon"></div>
  <div class="row">
    <div class="col-md-6">
      <div><strong>Temperature</strong></div>
      <div>Temp: ${temp}${tempSymbol}</div>
      <div>Feels: ${tempFeelsLike}${tempSymbol}</div>
      <div>Dew Point: ${dewPoint}${tempSymbol}</div>
    </div>
    <div class="col-md-6">
      <div><strong>Atmospheric</strong></div>
      <div>Pressure: ${pressure.mb}mb (${pressure.inHg}inHg)</div>
      <div>Humidity: ${humidity}%</div>
      <div>Visibility: ${visibility}km</div>
    </div>
  </div>
  <div class="row mt-2">
    <div class="col-md-6">
      <div><strong>Wind</strong></div>
      <div>Speed: ${wind} MPH</div>
      <div>Direction: ${windDir} (${currentWeather.wind.deg}°)</div>
    </div>
    <div class="col-md-6">
      <div><strong>Sun Times</strong></div>
      <div>Sunrise: ${sunrise}</div>
      <div>Sunset: ${sunset}</div>
    </div>
  </div>
`
  // Add event listener to favorite button
  const favBtn = document.querySelector('#favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', function () {
      const isFavorited = toggleFavoriteCity(cityName);
      loadFavoriteCities();
      updateFavoriteButton();
    });
  }

  // Display weather alerts
  displayAlerts(currentWeather);

  return;
}

//Build a function to display hourly weather forecast
function displayHourlyForecast(forecast) {
  const tempUnit = getTemperatureUnit();
  const tempSymbol = getTemperatureSymbol(tempUnit);

  hourlyEl.innerHTML = '';
  let hoursCount = 0;

  for (let i = 0; i < forecast.list.length && hoursCount < 24; i++) {
    const temp = formatTemperature(forecast.list[i].main.temp, tempUnit);
    const iconUrl = `https://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png`;
    const time = dayjs(forecast.list[i].dt_txt).format('h:mm A');
    const weatherDesc = forecast.list[i].weather[0].main;

    const card = document.createElement('div');
    card.className = 'card hourly-card text-white';
    card.innerHTML = `
      <div class="hourly-card-time">${time}</div>
      <div class="hourly-card-icon">
        <img src="${iconUrl}" alt="${weatherDesc}" style="width: 30px; height: 30px;">
      </div>
      <div class="hourly-card-temp">${temp}${tempSymbol}</div>
    `;
    hourlyEl.appendChild(card);
    hoursCount++;
  }
}

//Build a function to display 5-day weather forecast
function displayWeatherForecast(forecast) {
  forecastData = forecast;
  const tempUnit = getTemperatureUnit();
  const tempSymbol = getTemperatureSymbol(tempUnit);

  displayHourlyForecast(forecast);

  forecastEl.innerHTML = '';
  let daysCount = 0;

  for (let i = 0; i < forecast.list.length && daysCount < 5; i++) {
    const timeStr = forecast.list[i].dt_txt.split(' ')[1];
    // Show forecast for noon (12:00:00) or closest time if noon not available
    if (timeStr === '12:00:00' || (daysCount === 0 && i === 0)) {
      const cityName = forecast.city.name;
      const date = dayjs(forecast.list[i].dt_txt).format('ddd MM/DD');
      const iconUrl = `https://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png`;
      const temp = formatTemperature(forecast.list[i].main.temp, tempUnit);
      const wind = forecast.list[i].wind.speed;
      const humidity = forecast.list[i].main.humidity;
      const weatherDesc = forecast.list[i].weather[0].main;

      const card = document.createElement('div');
      card.className = 'card forecast-card col-md-2 col-sm-4 text-white p-3 m-2';
      card.innerHTML = `
        <h4 class="my-2">${date}</h4>
        <div class="my-2">
          <img src="${iconUrl}" alt="${weatherDesc}">
          <p>${weatherDesc}</p>
        </div>
        <div>
          <span>Temp:</span> ${temp}${tempSymbol}
        </div>
        <div>
          <span>Wind:</span> ${wind} MPH
        </div>
        <div>
          <span>Humidity:</span> ${humidity}%
        </div>
      `;
      forecastEl.appendChild(card);
      daysCount++;
    }
  }
}

// Error handling functions
function showError(message) {
  errorMessageEl.innerHTML = `<strong>⚠️ Error:</strong> ${message}`;
  errorMessageEl.classList.add('show');
}

function hideError() {
  errorMessageEl.classList.remove('show');
}

function showLoading() {
  currentWeatherEl.style.display = 'none';
  weatherPlaceholder.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading weather data...</p></div>';
  weatherPlaceholder.style.display = 'block';
}

function hideLoading() {
  weatherPlaceholder.style.display = 'none';
  currentWeatherEl.style.display = 'block';
}

// Display weather alerts
function displayAlerts(weatherData) {
  const alerts = getWeatherAlerts(weatherData);
  alertsEl.innerHTML = '';

  if (alerts.length === 0) {
    return;
  }

  const alertsContainer = document.createElement('div');
  alertsContainer.className = 'alert-container';

  alerts.forEach(alert => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-item ${alert.type}`;
    alertDiv.innerHTML = `
      <div class="alert-icon">${alert.icon}</div>
      <div class="alert-content">
        <div class="alert-title">${alert.title}</div>
        <div class="alert-message">${alert.message}</div>
      </div>
    `;
    alertsContainer.appendChild(alertDiv);
  });

  alertsEl.appendChild(alertsContainer);
}

// Auto-refresh weather data
function refreshCurrentWeather() {
  if (currentWeatherData && currentWeatherData.coord) {
    const { lat, lon } = currentWeatherData.coord;
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

    fetch(requestUrl)
      .then(response => {
        if (!response.ok) throw new Error('Refresh failed');
        return response.json();
      })
      .then(data => {
        displayCurrentWeather(data);
        if (currentWeatherData.coord.lat && currentWeatherData.coord.lon) {
          getWeatherForcast({ latitude: currentWeatherData.coord.lat, longitude: currentWeatherData.coord.lon });
        }
      })
      .catch(error => console.log('Auto-refresh error:', error));
  }
}

function startAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(refreshCurrentWeather, REFRESH_INTERVAL);
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// Load and display favorite cities
function loadFavoriteCities() {
  const favorites = getFavoriteCities();
  favoriteCitiesEl.innerHTML = '';

  if (favorites.length === 0) {
    noFavoritesEl.style.display = 'block';
    return;
  }

  noFavoritesEl.style.display = 'none';
  favorites.forEach(function (city) {
    let favBtn = document.createElement('button');
    favBtn.setAttribute('class', 'btn btn-outline-warning btn-sm mx-1 my-1');
    favBtn.innerHTML = `⭐ ${city}`;
    favBtn.addEventListener('click', function () {
      getGeoCoordinates(city);
    });
    favoriteCitiesEl.append(favBtn);
  });
}

// Toggle favorite status
function toggleFavoriteCity(cityName) {
  if (isFavoriteCity(cityName)) {
    removeFavoriteCity(cityName);
    return false;
  } else {
    addFavoriteCity(cityName);
    return true;
  }
}

// Update favorite button state
function updateFavoriteButton() {
  const favBtn = document.querySelector('#favorite-btn');
  if (favBtn && currentWeatherData) {
    const isFav = isFavoriteCity(currentWeatherData.name);
    if (isFav) {
      favBtn.classList.remove('btn-outline-warning');
      favBtn.classList.add('btn-warning');
      favBtn.innerHTML = '⭐ Remove from Favorites';
    } else {
      favBtn.classList.remove('btn-warning');
      favBtn.classList.add('btn-outline-warning');
      favBtn.innerHTML = '☆ Add to Favorites';
    }
  }
}

//Make the API Call Using Fetch
//// Using the OpenWeatherMap API 'forecast', to retrieve 5-day foecast.

function getWeatherForcast(data) {
  const requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lon=" + data.longitude + "&lat=" + data.latitude + "&appid=" + APIKey + '&units=imperial';

  fetch(requestUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      return response.json()
    })
    .then(function (data) {
      hideLoading();
      hideError();
      displayWeatherForecast(data);
    })
    .catch(function (error) {
      showError('Could not load 5-day forecast. ' + error.message);
      console.error('Forecast error:', error);
    });
};

//Using the OpenWeatherMap API 'weather', to retrieve geographical coordinates given a city name.
function getGeoCoordinates(city) {
  showLoading();
  saveHistory(city);
  const base = 'https://api.openweathermap.org/data/2.5/weather';
  const query = `?q=${city}&appid=${APIKey}&units=imperial`;
  const requestUrl = base + query;

  fetch(requestUrl)
    .then(function (response) {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found. Please try another city.`);
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    })
    .then(function (data) {
      let cityInformation = {
        cityName: data.name,
        longitude: data.coord.lon,
        latitude: data.coord.lat,
      }
      storredCities.push(cityInformation);
      localStorage.setItem('cities', JSON.stringify(storredCities));
      displayCurrentWeather(data);
      return cityInformation
    })
    .then(function (data) {
      getWeatherForcast(data);
    })
    .catch(function (error) {
      hideLoading();
      weatherPlaceholder.innerHTML = '<div class="placeholder-content">❌ Unable to load weather data</div>';
      weatherPlaceholder.style.display = 'block';
      showError(error.message);
      console.error('Geocoding error:', error);
    });
}
//Add event listeners for temperature unit toggle
tempUnitToggle.forEach(toggle => {
  toggle.addEventListener('change', function(e) {
    setTemperatureUnit(e.target.value);
    if (currentWeatherData) {
      displayCurrentWeather(currentWeatherData);
    }
    if (forecastData) {
      displayWeatherForecast(forecastData);
    }
  });
});

// Initialize toggle to saved unit
const savedUnit = getTemperatureUnit();
const toggleInput = document.querySelector(`input[name="tempUnit"][value="${savedUnit}"]`);
if (toggleInput) {
  toggleInput.checked = true;
}

//add onload event to the window object.
window.onload = function () {
  initializeThemeIcon();
  loadFavoriteCities();
  loadHistory();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (myPosition) {
        const lat = myPosition.coords.latitude;
        const lon = myPosition.coords.longitude;
        getCurrentLocationWeather();
        function getCurrentLocationWeather() {
          const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&&appid=${APIKey}&units=imperial`;

          fetch(requestUrl)
            .then(function (response) {
              if (!response.ok) {
                throw new Error('Failed to get weather for current location');
              }
              return response.json();
            })
            .then(function (data) {
              hideLoading();
              hideError();
              displayCurrentWeather(data);
            })
            .catch(function (error) {
              console.error('Geolocation weather error:', error);
            });
        }
      },
      function (error) {
        console.log('Geolocation permission denied or unavailable:', error.message);
      }
    );
  } else {
    console.log('Geolocation not supported');
  }
}

// Add  EventListener to city-search form
cityFormEl.addEventListener('submit', function (e) {
  e.preventDefault();
  let city = cityInput.value.trim();
  if (city !== "") {
    getGeoCoordinates(city)

    if (city) {
      cityFormEl.reset();
    }
  }
  return;
}
)
//Save history to local storage
const MAX_HISTORY = 10;
function saveHistory(city) {
  let history = localStorage.getItem('history') || [];
  if (history.length > 0) {
    history = JSON.parse(history);
  }

  const normalizedCity = city.trim();
  const cityIndex = history.findIndex(c => c.toLowerCase() === normalizedCity.toLowerCase());

  if (cityIndex !== -1) {
    history.splice(cityIndex, 1);
  }

  history.push(normalizedCity);

  if (history.length > MAX_HISTORY) {
    history.shift();
  }

  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}
// Create historical-search button with weather data
function loadHistory() {
  pastSeachEl.innerHTML = '<h5 class="w-100 mb-3">🔍 Recent Searches</h5>';
  let history = localStorage.getItem('history') || [];
  if (history.length > 0) {
    history = JSON.parse(history);
  }

  if (history.length === 0) {
    pastSeachEl.innerHTML += '<p class="text-muted w-100">No recent searches</p>';
    return;
  }

  history.forEach(function (city) {
    let searchBtn = document.createElement('button');
    searchBtn.setAttribute('class', 'btn btn-outline-secondary btn-sm mx-1 my-1 d-flex align-items-center gap-2');
    searchBtn.innerHTML = `<span>🌍</span> ${city}`;
    searchBtn.addEventListener('click', function () {
      getGeoCoordinates(city)
    });
    pastSeachEl.append(searchBtn);
  })
}

clearBtn.addEventListener('click', function () {
  pastSeachEl.innerHTML = '';
  localStorage.clear();
})

// Theme toggle
const themeToggle = document.querySelector('#theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const newTheme = toggleTheme();
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }
}

function initializeThemeIcon() {
  const currentTheme = getSavedTheme();
  updateThemeIcon(currentTheme);
}

export function initializeApp(apiKey, refreshInterval) {
  APIKey = apiKey;
  REFRESH_INTERVAL = refreshInterval;
}