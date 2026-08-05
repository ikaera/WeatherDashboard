const COMPARISON_KEY = 'citiesComparison';
const MAX_COMPARE_CITIES = 5;

function getComparisonCities() {
  const comparison = localStorage.getItem(COMPARISON_KEY) || '[]';
  return JSON.parse(comparison);
}

function addCityToComparison(cityData) {
  const cities = getComparisonCities();
  const normalizedCity = cityData.name.toLowerCase();

  if (cities.length >= MAX_COMPARE_CITIES) {
    throw new Error(`Maximum ${MAX_COMPARE_CITIES} cities in comparison`);
  }

  if (cities.some(c => c.name.toLowerCase() === normalizedCity)) {
    return false;
  }

  cities.push({
    name: cityData.name,
    country: cityData.sys?.country || '',
    temp: cityData.main.temp,
    humidity: cityData.main.humidity,
    windSpeed: cityData.wind.speed,
    weatherMain: cityData.weather[0].main,
    icon: cityData.weather[0].icon,
    feelsLike: cityData.main.feels_like,
    timestamp: new Date().getTime()
  });

  localStorage.setItem(COMPARISON_KEY, JSON.stringify(cities));
  return true;
}

function removeCityFromComparison(cityName) {
  const cities = getComparisonCities();
  const normalizedCity = cityName.toLowerCase();
  const filtered = cities.filter(c => c.name.toLowerCase() !== normalizedCity);
  localStorage.setItem(COMPARISON_KEY, JSON.stringify(filtered));
  return cities.length !== filtered.length;
}

function clearComparison() {
  localStorage.removeItem(COMPARISON_KEY);
}

function isInComparison(cityName) {
  const cities = getComparisonCities();
  const normalizedCity = cityName.toLowerCase();
  return cities.some(c => c.name.toLowerCase() === normalizedCity);
}

export {
  getComparisonCities,
  addCityToComparison,
  removeCityFromComparison,
  clearComparison,
  isInComparison,
  MAX_COMPARE_CITIES,
  COMPARISON_KEY
};
