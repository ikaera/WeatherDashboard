# Weather Dashboard

A modern, feature-rich weather application that provides real-time weather data, forecasts, and intelligent weather alerts for travelers planning trips.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Testing](#testing)
- [Contributing](#contributing)

## Overview

Weather Dashboard helps travelers plan their trips by providing comprehensive weather information for multiple cities. Search for any city to see current conditions, 5-day forecasts, hourly trends, and intelligent weather alerts based on dangerous conditions.

### User Story

As a traveler, I want to see the weather outlook for multiple cities so that I can plan my trip accordingly.

### Core Requirements

- Search for cities and view current weather conditions
- See 5-day weather forecasts
- View hourly forecasts for the next 24 hours
- Access search history for quick lookups
- Receive alerts for extreme weather conditions
- Compare multiple cities side-by-side
- Toggle between temperature units (Fahrenheit/Celsius)
- Use the app offline with service worker support

## Features

### Current Weather Display

- Real-time temperature and "feels like" conditions
- Weather description with icon
- Wind speed and direction
- Humidity levels
- Atmospheric pressure
- Dew point calculation
- Visibility range
- Sunrise and sunset times

### Forecasting

- 5-day weather forecast with daily conditions
- 24-hour hourly forecast with horizontal scroll
- Temperature, wind, and humidity for each period
- Weather icons for visual reference

### Smart Features

- **Weather Alerts**: Automatic warnings for extreme heat (115F+), freezing (10F-), dangerous winds (40+ MPH), and low pressure systems
- **Multiple City Comparison**: Compare up to 5 cities side-by-side
- **Favorite Cities**: Star favorite locations for quick access
- **Search History**: Track last 10 searched cities
- **Auto-Refresh**: Weather data updates automatically every 15 minutes

### User Interface

- Dark/Light theme toggle with system preference detection
- Temperature unit toggle (Fahrenheit/Celsius)
- Responsive design for mobile and desktop
- Error handling with user-friendly messages
- Loading states and spinners

### Offline & PWA

- Progressive Web App (PWA) support
- Service worker caching for offline access
- Installable as a native app on mobile/desktop
- Works without internet after initial load

## Live Demo

Visit the live application: https://ikaera.github.io/WeatherDashboard/

## Getting Started

### Prerequisites

- Node.js 14+ (for development/testing)
- OpenWeatherMap API key (free tier available at https://openweathermap.org/api)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/ikaera/WeatherDashboard.git
   cd WeatherDashboard
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create configuration file
   ```bash
   cp assets/js/config.example.js assets/js/config.js
   ```

4. Add your API key to `assets/js/config.js`
   ```javascript
   export const API_KEY = 'your_api_key_here';
   export const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
   ```

### Development

Run tests to verify setup:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

View coverage report:
```bash
npm test -- --coverage
```

## Usage

1. **Search for a City**
   - Enter city name in search box
   - Click Search or press Enter
   - Current weather and forecasts display immediately

2. **View Current Weather**
   - Shows temperature, conditions, wind, humidity, pressure, and more
   - Display updates in real-time every 15 minutes

3. **Check Forecasts**
   - Hourly forecast: 24-hour scrollable view
   - 5-day forecast: Daily overview with conditions

4. **Manage Cities**
   - Star button: Add/remove from favorites
   - Recent Searches: Click to view again
   - Compare Cities: Add up to 5 for side-by-side view

5. **Customize**
   - Toggle theme: Use moon/sun button in header
   - Change units: Switch between F/C in header
   - Auto-refresh: Updates every 15 minutes

## Architecture

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Bootstrap 5, custom CSS
- **APIs**: OpenWeatherMap (Weather data)
- **Storage**: localStorage (Preferences, history, favorites)
- **Caching**: Service Worker (Offline support)
- **Testing**: Jest (Unit tests)
- **Build**: No build step required (vanilla + CDN)

### File Structure

```
assets/
  js/
    main.js                 # Application entry point
    weather.js              # Core app logic
    weatherUtils.js         # Utility functions
    weatherAlerts.js        # Alert detection
    themeManager.js         # Theme system
    comparisonManager.js    # City comparison
    config.js               # API configuration
  css/
    style.css               # Styles with theme variables

index.html                  # Main HTML file
manifest.json               # PWA manifest
service-worker.js           # Service worker for caching
jest.config.js              # Jest configuration

tests/
  weatherUtils.test.js       # Unit tests (29 tests)
```

### Module Organization

- **weather.js**: DOM manipulation, event handling, API coordination
- **weatherUtils.js**: Temperature conversion, favorite/history management (100% tested)
- **weatherAlerts.js**: Weather condition analysis and alert detection
- **themeManager.js**: Light/dark theme logic with system preference support
- **comparisonManager.js**: Multi-city comparison data management

## Technologies

- **JavaScript (ES6+)**: Modern syntax with import/export modules
- **Bootstrap 5**: Responsive CSS framework
- **OpenWeatherMap API**: Real-time weather data
- **Service Workers**: Offline caching and PWA support
- **localStorage**: Client-side data persistence
- **Day.js**: Date and time formatting
- **Jest**: Unit testing framework

## Testing

All utility functions have 100% test coverage (29 passing tests).

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm test -- --coverage  # Coverage report
```

Test files:
- `tests/weatherUtils.test.js`: Temperature conversion, favorites, history management

## API Details

### Endpoints Used

1. **Current Weather**
   - Endpoint: `/data/2.5/weather`
   - Returns: Current conditions, temperature, wind, humidity, pressure

2. **5-Day Forecast**
   - Endpoint: `/data/2.5/forecast`
   - Returns: Hourly data for 5 days (40 data points)

### API Key Setup

Get a free API key:
1. Visit https://openweathermap.org/api
2. Sign up for a free account
3. Generate API key from dashboard
4. Add to `assets/js/config.js`

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Quick start:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

For detailed contribution guidelines, see CONTRIBUTING.md.

## Resources

- OpenWeatherMap API Documentation: https://openweathermap.org/api
- Bootstrap 5: https://getbootstrap.com/
- Day.js: https://day.js.org/
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Progressive Web Apps: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Version History

- v3.0.0: Added dark theme, weather alerts, hourly forecast, city comparison, PWA support
- v2.0.0: Added temperature toggle, favorite cities, improved forecast display
- v1.0.0: Initial release with current weather and 5-day forecast

---

Built with focus on user experience, code quality, and offline accessibility.
