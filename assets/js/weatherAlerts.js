const ALERT_THRESHOLDS = {
  temperature: { extreme: 115, freezing: 10 },
  windSpeed: { dangerous: 40, high: 25 },
  humidity: { extreme: 90 },
  pressure: { low: 950 },
};

function getWeatherAlerts(weatherData) {
  const alerts = [];
  const temp = weatherData.main.temp;
  const windSpeed = weatherData.wind.speed;
  const humidity = weatherData.main.humidity;
  const pressure = weatherData.main.pressure;

  if (temp >= ALERT_THRESHOLDS.temperature.extreme) {
    alerts.push({
      type: 'danger',
      icon: '🔥',
      title: 'Extreme Heat',
      message: `Temperature is ${Math.round(temp)}°F - dangerous heat conditions.`
    });
  } else if (temp <= ALERT_THRESHOLDS.temperature.freezing) {
    alerts.push({
      type: 'warning',
      icon: '❄️',
      title: 'Freezing Temperature',
      message: `Temperature is ${Math.round(temp)}°F - freezing conditions.`
    });
  }

  if (windSpeed >= ALERT_THRESHOLDS.windSpeed.dangerous) {
    alerts.push({
      type: 'danger',
      icon: '💨',
      title: 'Dangerous Wind',
      message: `Wind speed is ${Math.round(windSpeed)} MPH - dangerous conditions.`
    });
  } else if (windSpeed >= ALERT_THRESHOLDS.windSpeed.high) {
    alerts.push({
      type: 'warning',
      icon: '🌪️',
      title: 'High Winds',
      message: `Wind speed is ${Math.round(windSpeed)} MPH - use caution.`
    });
  }

  if (humidity >= ALERT_THRESHOLDS.humidity.extreme) {
    alerts.push({
      type: 'info',
      icon: '💧',
      title: 'High Humidity',
      message: `Humidity is ${humidity}% - very humid.`
    });
  }

  if (pressure <= ALERT_THRESHOLDS.pressure.low) {
    alerts.push({
      type: 'warning',
      icon: '📉',
      title: 'Low Pressure',
      message: `Pressure is ${pressure}mb - may indicate incoming storms.`
    });
  }

  return alerts;
}

export { getWeatherAlerts, ALERT_THRESHOLDS };
