import { getTemperatureUnit, formatTemperature, getTemperatureSymbol, calculateDewPoint, getWindDirection, formatPressure, isFavoriteCity } from './weatherUtils.js';
import { getWeatherAlerts } from './weatherAlerts.js';
import { getComparisonCities } from './comparisonManager.js';

const currentWeatherEl = document.querySelector('#weather-content');
const forecastEl = document.querySelector('#five-day-weather');
const hourlyEl = document.querySelector('#hourly-weather');
const alertsEl = document.querySelector('#weather-alerts');
const comparisonViewEl = document.querySelector('#comparison-view');

function formatWeatherDate(timestamp, timezone) {
  return dayjs((timestamp + timezone) * 1000).format('ddd MM/DD/YYYY hh:mm:ss a');
}

function formatSunTime(timestamp, timezone) {
  return dayjs((timestamp + timezone) * 1000).format('hh:mm a');
}

function buildWeatherDetails(currentWeather) {
  const tempUnit = getTemperatureUnit();
  const temp = formatTemperature(currentWeather.main.temp, tempUnit);
  const tempFeelsLike = formatTemperature(currentWeather.main.feels_like, tempUnit);
  const tempSymbol = getTemperatureSymbol(tempUnit);
  const wind = currentWeather.wind.speed;
  const humidity = currentWeather.main.humidity;
  const windDir = getWindDirection(currentWeather.wind.deg);
  const pressure = formatPressure(currentWeather.main.pressure);
  const dewPoint = calculateDewPoint(currentWeather.main.temp, humidity);
  const visibility = (currentWeather.visibility / 1000).toFixed(1);
  const sunrise = formatSunTime(currentWeather.sys.sunrise, currentWeather.timezone);
  const sunset = formatSunTime(currentWeather.sys.sunset, currentWeather.timezone);

  return { temp, tempFeelsLike, tempSymbol, wind, humidity, windDir, pressure, dewPoint, visibility, sunrise, sunset };
}

function renderCurrentWeather(currentWeather, onFavoriteToggle) {
  if (!currentWeatherEl) return;

  const iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
  const cityName = currentWeather.name;
  const date = formatWeatherDate(currentWeather.dt, currentWeather.timezone);
  const details = buildWeatherDetails(currentWeather);
  const weatherDesc = currentWeather.weather[0].main;

  const isFav = isFavoriteCity(cityName);
  const favBtnClass = isFav ? 'btn-warning' : 'btn-outline-warning';
  const favBtnText = isFav ? '⭐ Remove from Favorites' : '☆ Add to Favorites';

  currentWeatherEl.style.display = 'block';
  currentWeatherEl.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-3">
      <div>
        <h4 class="my-2">${cityName} <small>${weatherDesc}</small></h4>
        <h5>${date}</h5>
      </div>
      <button class="btn ${favBtnClass} btn-sm" id="favorite-btn">${favBtnText}</button>
    </div>
    <div class="my-2"><img src="${iconUrl}" alt="icon"></div>
    <div class="row">
      <div class="col-md-6">
        <div><strong>Temperature</strong></div>
        <div>Temp: ${details.temp}${details.tempSymbol}</div>
        <div>Feels: ${details.tempFeelsLike}${details.tempSymbol}</div>
        <div>Dew Point: ${details.dewPoint}${details.tempSymbol}</div>
      </div>
      <div class="col-md-6">
        <div><strong>Atmospheric</strong></div>
        <div>Pressure: ${details.pressure.mb}mb (${details.pressure.inHg}inHg)</div>
        <div>Humidity: ${details.humidity}%</div>
        <div>Visibility: ${details.visibility}km</div>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col-md-6">
        <div><strong>Wind</strong></div>
        <div>Speed: ${details.wind} MPH</div>
        <div>Direction: ${details.windDir} (${currentWeather.wind.deg}°)</div>
      </div>
      <div class="col-md-6">
        <div><strong>Sun Times</strong></div>
        <div>Sunrise: ${details.sunrise}</div>
        <div>Sunset: ${details.sunset}</div>
      </div>
    </div>
  `;

  const favBtn = document.querySelector('#favorite-btn');
  if (favBtn && onFavoriteToggle) {
    favBtn.addEventListener('click', () => onFavoriteToggle(cityName));
  }
}

function renderHourlyForecast(forecast) {
  const hourlyData = forecast.list.slice(0, 24);
  const tempUnit = getTemperatureUnit();
  const tempSymbol = getTemperatureSymbol(tempUnit);

  hourlyEl.innerHTML = '';
  hourlyData.forEach(hour => {
    const temp = formatTemperature(hour.main.temp, tempUnit);
    const date = dayjs(hour.dt * 1000).format('ddd hh:mm a');
    const iconUrl = `https://openweathermap.org/img/w/${hour.weather[0].icon}.png`;
    const wind = hour.wind.speed;

    const hourCard = document.createElement('div');
    hourCard.className = 'weather-card hourly-card';
    hourCard.innerHTML = `
      <p class="card-time">${date}</p>
      <img src="${iconUrl}" alt="icon" class="weather-icon">
      <p class="card-temp">${temp}${tempSymbol}</p>
      <p class="card-wind">🌬️ ${wind} MPH</p>
    `;
    hourlyEl.appendChild(hourCard);
  });
}

function renderFiveDayForecast(forecast) {
  const dailyData = {};
  const tempUnit = getTemperatureUnit();
  const tempSymbol = getTemperatureSymbol(tempUnit);

  forecast.list.forEach(item => {
    const date = dayjs(item.dt * 1000).format('YYYY-MM-DD');
    if (!dailyData[date]) {
      dailyData[date] = item;
    }
  });

  forecastEl.innerHTML = '';
  Object.values(dailyData).slice(0, 5).forEach(day => {
    const temp = formatTemperature(day.main.temp, tempUnit);
    const date = dayjs(day.dt * 1000).format('ddd MM/DD');
    const iconUrl = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
    const description = day.weather[0].main;

    const card = document.createElement('div');
    card.className = 'weather-card forecast-card';
    card.innerHTML = `
      <p class="card-date">${date}</p>
      <img src="${iconUrl}" alt="icon" class="weather-icon">
      <p class="card-weather">${description}</p>
      <p class="card-temp">${temp}${tempSymbol}</p>
    `;
    forecastEl.appendChild(card);
  });
}

function renderAlerts(weatherData) {
  const alerts = getWeatherAlerts(weatherData);

  if (alerts.length === 0) {
    alertsEl.innerHTML = '';
    return;
  }

  alertsEl.innerHTML = '<h5 class="mb-3">⚠️ Weather Alerts</h5>';
  alerts.forEach(alert => {
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${alert.type}`;
    alertEl.innerHTML = `<strong>${alert.icon} ${alert.title}</strong>: ${alert.message}`;
    alertsEl.appendChild(alertEl);
  });
}

function renderComparisonView() {
  const comparisonCities = getComparisonCities();
  const clearCompareBtn = document.querySelector('#clear-compare-btn');

  if (!comparisonViewEl) return;

  if (comparisonCities.length === 0) {
    comparisonViewEl.innerHTML = '<p class="text-muted">No cities in comparison</p>';
    if (clearCompareBtn) {
      clearCompareBtn.style.display = 'none';
    }
    return;
  }

  if (clearCompareBtn) {
    clearCompareBtn.style.display = 'inline-block';
  }

  const tempUnit = getTemperatureUnit();
  const tempSymbol = getTemperatureSymbol(tempUnit);
  let html = '<h5 class="mb-3">📊 City Comparison</h5>';
  html += '<div class="comparison-grid">';

  comparisonCities.forEach(city => {
    const temp = formatTemperature(city.temp, tempUnit);
    const feelsLike = formatTemperature(city.feelsLike, tempUnit);
    html += `
      <div class="comparison-card">
        <h5>${city.name}</h5>
        <img src="https://openweathermap.org/img/w/${city.icon}.png" alt="${city.weatherMain}">
        <p><strong>${city.weatherMain}</strong></p>
        <p>${temp}${tempSymbol} (${feelsLike}${tempSymbol})</p>
        <p>💧 ${city.humidity}% | 🌬️ ${Math.round(city.windSpeed)} mph</p>
        <button class="btn btn-danger" onclick="removeFromComparison('${city.name}')">Remove</button>
      </div>
    `;
  });

  html += '</div>';
  comparisonViewEl.innerHTML = html;
}

export {
  renderCurrentWeather,
  renderHourlyForecast,
  renderFiveDayForecast,
  renderAlerts,
  renderComparisonView,
};
