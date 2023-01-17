// DO NOT USE 
'use strict';
const cityInputElemt = document.querySelector('form');
const searchButton = document.querySelector('.search-button');
const pastSearched = document.querySelector('.past-searches');

let currentCity;




const updateUI = (data) => {
  // destructure properties
  const { cityDets, weather } = data;

  // update details template
  details.innerHTML = `
    <h4 class="my-2">${cityDets.EnglishName}</h4>
    <div class="my-2">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather}</span>
      <span>&deg;F</span>
    </div>
  `;

  // update the night/day & icon images
  const iconSrc = ``;
  icon.setAttribute('src', iconSrc);
  
  const timeSrc = weather;
  time.setAttribute('src', timeSrc);

  
}
// const updateCity ;

cityForm.addEventListener('submit', function (e) {
  // prevent default action
  e.preventDefault();
  
  //  retrieve geographical coordinates given a city nam
  const city =  trim();
  cityForm.reset();

  // update the user interface with new city
  updateCity(city)
    .then(data => updateUI(data))
    .catch(err => console.log(err));
});