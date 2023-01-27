'use strict';
// var localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)

const APIKey = 'be7058c093e84628bb5922daf319347b';
let storredCities = JSON.parse(localStorage.getItem('cities')) || [];
const cityFormEl = document.querySelector('form');
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector("#search-btn");
const clearBtn = document.querySelector('#clear-btn');
const pastSeachEl = document.querySelector('#past-searched-cities');
const currentWeatherEl = document.querySelector('.current-weather');
const forecastEl = document.querySelector('#five-day-weather');
const forecastCards = document.querySelectorAll('#five-day-weather-cards');

function displayCurrentWeather(currentWeather) {
  // console.log(currentWeather);

  // console.log(dayjs().format('MM/DD/YYYY'));
  var iconUrl = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;

  // console.log(currentWeather.dt);
  // console.log(iconUrl);
  // console.log(currentWeather.main.temp);
  // console.log(currentWeather.main.feels_like);
  // console.log(currentWeather.wind.speed);
  // console.log(currentWeather.main.humidity);
  const cityName = currentWeather.name;
  const date = dayjs((currentWeather.dt + currentWeather.timezone) * 1000).format('ddd MM/DD/YYYY hh:mm:ss a');
  const temp = currentWeather.main.temp;
  const tempFeelsLike = currentWeather.main.feels_like;
  const wind = currentWeather.wind.speed;
  const humidity = currentWeather.main.humidity;

  currentWeatherEl.innerHTML = `
  <h4 class="my-2">${cityName} </h4>
  <h5>${date}</h5> 
  <div class="my-2"> <img src="${iconUrl}" alt="icon"></div>
  <div>
    <span> Temp: </span>
    <span> ${temp}</span>
    <span>&deg;F</span>
  </div>
  <div>
    <span> Feels: </span>
    <span>${tempFeelsLike}</span>
    <span>&deg;F</span>
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
// saveHistory();  
// console.log((dayjs((currentWeather.dt + currentWeather.timezone) * 1000).format('MM/DD/YYYY hh:mm:ss a')));
  return;
}

let days = 0;
function displayWeatherForecast(forecast) {
  console.log(forecast);
  for (let i = 0; i < forecast.list.length; i++) {
    const cityName = forecast.city.name;
    const date = dayjs(forecast.list[i].dt_txt).format('ddd MM/DD/YYYY hh:mm:ss a');
    var iconUrl = `https://openweathermap.org/img/w/${forecast.list[i].weather[0].icon}.png`;
    const temp = forecast.list[i].main.temp;
    const tempFeelsLike = forecast.list[i].main.feels_like;
    const wind = forecast.list[i].wind.speed;
    const humidity = forecast.list[i].main.humidity;

    if (forecast.list[i].dt_txt.split(' ')[1] == '12:00:00') {
      // let card = document.createElement(div);
      // card.setAttribute('class','card col-2.m1 bg-primary text-white p-1 m-2');

      forecastCards[days].innerHTML = `
    <h4 class="my-2">${cityName} </h4>
    <h5>${date}</h5> 
    <div class="my-2"> <img src="${iconUrl}" alt="icon"></div>
    <div>
      <span> Temp: </span>
      <span> ${temp}</span>
      <span>&deg;F</span>
    </div>
    <div>
      <span> Feels: </span>
      <span>${tempFeelsLike}</span>
      <span>&deg;F</span>
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
      days++;
    }
  }
  days = 0;
}

//Create Variables for the API Call

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

cityFormEl.addEventListener('submit', function (e) {
  e.preventDefault();

  let city = cityInput.value.trim();
  getGeoCoordinates(city);
  if (city) {
    cityFormEl.reset();
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

  if (history.length > 10) {
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
      getGeoCoordinates(city)});
    // searchBtn.onclick = 
    // searchBtn.setAttribute('class', 'btn btn-primary btn-lg my-1');
    searchBtn.innerHTML = city;
    // pastSeachEl.setAttribute('class', 'past-search');
    pastSeachEl.append(searchBtn);
  })
}

clearBtn.addEventListener('click', function () {
  localStorage.clear();  
})
// pastSeachEl.addEventListener('click', getGeoCoordinates)
