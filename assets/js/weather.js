'use strict';
// var localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)

const APIKey = 'be7058c093e84628bb5922daf319347b';
let storredCities = JSON.parse(localStorage.getItem('cities')) || [];
const cityFormEl = document.querySelector('form');
const cityInput = document.querySelector('#city-input');

function displayCurrentWeather(currentWeather) {
  console.log(currentWeather);
 
  console.log(dayjs().format('MM/DD/YYYY'));
  var iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;

  console.log(currentWeather.dt);
  console.log(iconUrl);
  console.log(currentWeather.main.temp);
  console.log(currentWeather.main.feels_like);
  console.log(currentWeather.wind.speed);
  console.log(currentWeather.main.humidity);
  
}
function displayWeatherForecast(forecast) {
  console.log(forecast);
}

//Create Variables for the API Call

//Make the API Call Using Fetch

//// get weather information

function getWeatherForcast(data) {

  // const base = '"http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;';
  // const query = `${id}?apikey=${key}`;
  const requestUrl = "http://api.openweathermap.org/data/2.5/forecast?lon=" + data.longitude + "&lat=" + data.latitude + "&appid=" + APIKey+'&units=imperial';

  fetch(requestUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      displayWeatherForecast(data);
    })

};

//Using the OpenWeatherMap APIs, how could we retrieve geographical coordinates given a city name.
function getGeoCoordinates(city) {
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
      // console.log(data);
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
  return;
}

cityFormEl.addEventListener('submit', function (e) {
  e.preventDefault();
  let city = cityInput.value.trim();
  getGeoCoordinates(city);
}
)