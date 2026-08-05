'use strict';

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

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTemperatureUnit,
    setTemperatureUnit,
    convertTemperature,
    formatTemperature,
    getTemperatureSymbol,
    TEMP_UNIT_KEY,
  };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.weatherUtils = {
    getTemperatureUnit,
    setTemperatureUnit,
    convertTemperature,
    formatTemperature,
    getTemperatureSymbol,
    TEMP_UNIT_KEY,
  };
}
