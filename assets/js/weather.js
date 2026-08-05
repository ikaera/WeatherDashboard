'use strict';
// Import utilities (for browser use, we'll handle the fallback)
const weatherUtils = typeof module !== 'undefined' && module.exports ? require('./weatherUtils') : window.weatherUtils || {};

// Create global variables
const APIKey = 'be7058c093e84628bb5922daf319347b';
let storredCities = JSON.parse(localStorage.getItem('cities')) || [];
let currentWeatherData = null;
let forecastData = null;

const cityFormEl = document.querySelector('form');
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector('#clear-btn');
const pastSeachEl = document.querySelector('#past-searched-cities');
const currentWeatherEl = document.querySelector('.current-weather');
const forecastEl = document.querySelector('#five-day-weather');
const tempUnitToggle = document.querySelectorAll('input[name="tempUnit"]');

//Create function to display current weather
function displayCurrentWeather(currentWeather) {
  currentWeatherData = currentWeather;
  var iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;

  const cityName = currentWeather.name;
  const date = dayjs((currentWeather.dt + currentWeather.timezone) * 1000).format('ddd MM/DD/YYYY hh:mm:ss a');
  const tempUnit = weatherUtils.getTemperatureUnit ? weatherUtils.getTemperatureUnit() : 'F';
  const temp = weatherUtils.formatTemperature ? weatherUtils.formatTemperature(currentWeather.main.temp, tempUnit) : currentWeather.main.temp;
  const tempFeelsLike = weatherUtils.formatTemperature ? weatherUtils.formatTemperature(currentWeather.main.feels_like, tempUnit) : currentWeather.main.feels_like;
  const wind = currentWeather.wind.speed;
  const humidity = currentWeather.main.humidity;
  const tempSymbol = weatherUtils.getTemperatureSymbol ? weatherUtils.getTemperatureSymbol(tempUnit) : '°F';

  currentWeatherEl.innerHTML = `
  <h4 class="my-2">${cityName} </h4>
  <h5>${date}</h5>
  <div class="my-2"> <img src="${iconUrl}" alt="icon"></div>
  <div>
    <span> Temp: </span>
    <span> ${temp}</span>
    <span>${tempSymbol}</span>
  </div>
  <div>
    <span> Feels: </span>
    <span>${tempFeelsLike}</span>
    <span>${tempSymbol}</span>
  </div>
  <div>
    <span> Wind: </span>
    <span>${wind}</span>
    <span> MPH </span>
  </div>
  <div>
    <span> Humidity: </span>
    <span>${humidity}</span>
    <span> % </span>
  </div>
`
  return;
}

//Build a function to display 5-day weather forecast
function displayWeatherForecast(forecast) {
  forecastData = forecast;
  const tempUnit = weatherUtils.getTemperatureUnit ? weatherUtils.getTemperatureUnit() : 'F';
  const tempSymbol = weatherUtils.getTemperatureSymbol ? weatherUtils.getTemperatureSymbol(tempUnit) : '°F';

  forecastEl.innerHTML = '';
  let daysCount = 0;

  for (let i = 0; i < forecast.list.length && daysCount < 5; i++) {
    const timeStr = forecast.list[i].dt_txt.split(' ')[1];
    // Show forecast for noon (12:00:00) or closest time if noon not available
    if (timeStr === '12:00:00' || (daysCount === 0 && i === 0)) {
      const cityName = forecast.city.name;
      const date = dayjs(forecast.list[i].dt_txt).format('ddd MM/DD');
      const iconUrl = `https://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png`;
      const temp = weatherUtils.formatTemperature ? weatherUtils.formatTemperature(forecast.list[i].main.temp, tempUnit) : forecast.list[i].main.temp;
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

//Make the API Call Using Fetch
//// Using the OpenWeatherMap API 'forecast', to retrieve 5-day foecast.

function getWeatherForcast(data) {
  // const base = '"http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;';
  // const query = `${id}?apikey=${key}`;
  const requestUrl = "https://api.openweathermap.org/data/2.5/forecast?lon=" + data.longitude + "&lat=" + data.latitude + "&appid=" + APIKey + '&units=imperial';

  fetch(requestUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      displayWeatherForecast(data);
    })
};

//Using the OpenWeatherMap API 'weather', to retrieve geographical coordinates given a city name.
function getGeoCoordinates(city) {
  saveHistory(city);
  const base = 'https://api.openweathermap.org/data/2.5/weather';
  const query = `?q=${city}&appid=${APIKey}&units=imperial`;

  const requestUrl = base + query;

  fetch(requestUrl)
    .then(function (response) {
      if (response.status <= 299 && response.status >= 200) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (data) {
      console.log(data);
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
  // return;
}
//Add event listeners for temperature unit toggle
tempUnitToggle.forEach(toggle => {
  toggle.addEventListener('change', function(e) {
    if (weatherUtils.setTemperatureUnit) {
      weatherUtils.setTemperatureUnit(e.target.value);
    }
    if (currentWeatherData) {
      displayCurrentWeather(currentWeatherData);
    }
    if (forecastData) {
      displayWeatherForecast(forecastData);
    }
  });
});

// Initialize toggle to saved unit
const savedUnit = weatherUtils.getTemperatureUnit ? weatherUtils.getTemperatureUnit() : 'F';
const toggleInput = document.querySelector(`input[name="tempUnit"][value="${savedUnit}"]`);
if (toggleInput) {
  toggleInput.checked = true;
}

//add onload event to the window object. 
window.onload = function () {
  // e.preventDefault();
  //find current location coords using navigator.geolocation.getCurrentPosition().
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function (myPosition) {
      const lat = myPosition.coords.latitude;
      const lon = myPosition.coords.longitude;
      console.log(lat, lon);
      getCurrentLocationWeather();
      function getCurrentLocationWeather() {
        const requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&&appid=${APIKey}&units=imperial`;

        fetch(requestUrl)
          .then(function (response) {
            if (response.status <= 299 && response.status >= 200) {
              return response.json();
            } else {
              throw Error(response.statusText);
            }
          })
          .then(function (data) {
            displayCurrentWeather(data);
          })
        // .then(function (data) {
        //   getWeatherForcast(data);
        // })
      };
    })
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
function saveHistory(city) {
  let history = localStorage.getItem('history') || [];
  if (history.length > 0) {
    history = JSON.parse(history);
  }
  if (history.includes(city)) return;

  history.push(city);

  if (history.length > 4) {
    history.shift();
  }

  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();

}
// Create historical-serach button
function loadHistory() {
  pastSeachEl.innerHTML = '';
  let history = localStorage.getItem('history') || [];
  if (history.length > 0) {
    history = JSON.parse(history);
  }

  history.forEach(function (city) {
    let searchBtn = document.createElement('button');
    // searchBtn.classList.add('historyBtns');
    searchBtn.addEventListener('click', function () {
      getGeoCoordinates(city)
    });
    // searchBtn.onclick = 
    searchBtn.setAttribute('class', 'btn btn-secondary btn-lg mx-5 my-1');
    searchBtn.innerHTML = city;
    // pastSeachEl.setAttribute('class', 'past-search');
    pastSeachEl.append(searchBtn);
  })
}

clearBtn.addEventListener('click', function () {

  pastSeachEl.innerHTML = '';
  localStorage.clear();
})
// pastSeachEl.addEventListener('click', getGeoCoordinates)