# Weather Dashboard - Claude Code Guidelines

## Project Overview

A modern, feature-rich weather dashboard that displays real-time weather data, forecasts, and alerts. Built with vanilla JavaScript, Bootstrap 5, and leveraging the OpenWeatherMap API.

**Live App**: [https://ikaera.github.io/WeatherDashboard/](https://ikaera.github.io/WeatherDashboard/)  
**Repository**: [https://github.com/ikaera/WeatherDashboard](https://github.com/ikaera/WeatherDashboard)

## Key Features

- 🌡️ Real-time weather data with temperature unit toggle (°F/°C)
- 📊 5-day and 24-hour forecasts with visual cards
- 🚨 Smart weather alerts for extreme conditions
- 🌙 Dark/Light theme toggle with system preference detection
- ⭐ Favorite cities with quick access
- 📍 Search history with recent searches (max 10)
- 📊 Compare multiple cities side-by-side (max 5)
- 🔄 Auto-refresh every 15 minutes
- 📱 PWA support with offline caching
- 🎯 Comprehensive weather details (pressure, dew point, wind direction, sunrise/sunset)

## Architecture

### Directory Structure

```
WeatherDashboard/
├── assets/
│   ├── css/
│   │   └── style.css              # Main styles with theme variables
│   ├── js/
│   │   ├── main.js                # ES6 module entry point
│   │   ├── weather.js             # Main app logic, DOM manipulation
│   │   ├── config.js              # API key & config (gitignored)
│   │   ├── config.example.js       # Template for config.js
│   │   ├── weatherUtils.js         # Temperature, favorite, history utilities
│   │   ├── weatherAlerts.js        # Alert detection logic
│   │   ├── themeManager.js         # Dark/light theme management
│   │   └── comparisonManager.js    # Multi-city comparison logic
│   └── images/
├── tests/
│   └── weatherUtils.test.js        # Jest unit tests (29 tests)
├── index.html                      # Main HTML file
├── manifest.json                   # PWA manifest
├── service-worker.js               # Service worker for offline support
├── package.json                    # Dependencies & scripts
├── jest.config.js                  # Jest configuration
├── .gitignore                      # Git ignore rules
├── CLAUDE.md                       # This file
└── README.md                       # Project documentation
```

### Architecture Decisions

1. **ES6 Modules**: Using modern ES6 import/export syntax for code organization
2. **Vanilla JavaScript**: No frameworks - pure JS for simplicity and performance
3. **Service Worker**: Offline support with intelligent caching strategy
4. **LocalStorage**: All user preferences (theme, favorites, history, comparison) persisted
5. **Modular Utilities**: Separated concerns - weather, alerts, themes, comparisons

## Setup & Development

### Prerequisites
- Node.js 14+ (for development/testing only)
- OpenWeatherMap API key (free tier available)

### Installation

1. Clone the repository
2. Create `assets/js/config.js` from `config.example.js`:
   ```javascript
   export const API_KEY = 'your_api_key_here';
   export const REFRESH_INTERVAL = 15 * 60 * 1000;
   ```
3. For local development: `npm install`
4. Run tests: `npm test`

### Running Tests

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm test -- --coverage     # With coverage report
```

## Code Organization

### Core Modules

#### `weather.js` (Main Application)
- DOM manipulation and event handling
- API calls to OpenWeatherMap
- Weather display rendering
- Auto-refresh management
- Event listeners for all UI interactions

#### `weatherUtils.js` (Utilities)
- Temperature conversion (F ↔ C)
- Dew point calculation
- Wind direction formatting
- Pressure conversion
- Favorite cities management
- Search history management

#### `weatherAlerts.js` (Alert System)
- Alert detection based on thresholds
- Extreme heat/cold detection
- Dangerous wind warnings
- Pressure change detection

#### `themeManager.js` (Theme System)
- Light/dark theme toggle
- System preference detection
- Persistent theme storage
- Theme icon management

#### `comparisonManager.js` (City Comparison)
- Store up to 5 cities for comparison
- Add/remove cities from comparison
- Retrieve comparison data

#### `main.js` (Entry Point)
- Imports and initializes all modules
- Loads configuration
- Sets up theme and app

### API Integration

**OpenWeatherMap Endpoints:**
- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- Forecast (5-day): `https://api.openweathermap.org/data/2.5/forecast`

**API Key**: Stored in `config.js` (gitignored for security)

**Data Flow**:
1. Search city → Get coordinates
2. Fetch current weather & forecast
3. Display data with conversions
4. Cache in localStorage
5. Auto-refresh every 15 minutes

## Development Guidelines

### When Adding Features

1. **Create a new module** if it's a distinct concern (like weatherAlerts.js)
2. **Update tests** - maintain 29+ test coverage
3. **Check theme compatibility** - ensure light and dark themes work
4. **Test offline** - verify service worker caching
5. **Commit with meaningful messages** - no "update" or vague commits

### Code Style

- **No comments** unless the WHY is non-obvious
- **Clean function names** - they should describe what they do
- **ES6 syntax** - const/let, arrow functions, template literals
- **Module exports** - CommonJS for tests, ES6 for browser
- **Error handling** - user-friendly messages via `showError()`

### Common Tasks

**Add a new weather detail:**
1. Update `displayCurrentWeather()` in weather.js
2. Add calculation utility if needed (e.g., `calculateDewPoint` in weatherUtils.js)
3. Add test for the calculation
4. Verify in light and dark themes

**Change alert thresholds:**
1. Update `ALERT_THRESHOLDS` in weatherAlerts.js
2. Test alerts display correctly
3. Commit message: "Adjust temperature alert threshold to X°F"

**Add new storage preference:**
1. Create getter/setter in relevant utility module
2. Use consistent localStorage key naming
3. Initialize on page load
4. Add to CLAUDE.md documentation

## Testing

**Test Framework**: Jest  
**Coverage Target**: 100% on utilities  

**Test Files**:
- `tests/weatherUtils.test.js` - 29 tests covering all utility functions

**To Run Tests**:
```bash
npm test                          # Run once
npm run test:watch               # Watch mode
npm test -- --coverage           # Coverage report
```

## Deployment

- **Hosted on**: GitHub Pages
- **Build**: Static files only (no build step)
- **Service Worker**: Auto-registered on page load
- **Cache Busting**: Update `CACHE_VERSION` in service-worker.js when deploying

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 module support required
- Service Worker support for offline features
- LocalStorage support for preferences

## Performance Considerations

1. **Lazy Loading**: Forecasts only fetched when needed
2. **Caching**: Service worker caches API responses
3. **Debouncing**: Temperature unit toggle debounced
4. **Error Handling**: Graceful fallbacks for API failures

## Security

- ✅ API key in gitignored `config.js`
- ✅ No sensitive data in localStorage (only preferences)
- ✅ HTTPS only in production
- ✅ No eval() or dangerous DOM manipulation
- ⚠️ Note: API key is visible in browser requests (normal for frontend)

## Known Limitations

1. Free OpenWeatherMap tier has rate limits
2. Some advanced alert types require paid API
3. Historical weather data not available (API limitation)
4. UV index requires separate API endpoint

## Future Enhancements

- [ ] Hourly precipitation probability
- [ ] Air quality index (AQI) integration
- [ ] Weather maps (interactive)
- [ ] Sunrise/sunset notifications
- [ ] Multiple language support
- [ ] Weather statistics (monthly, yearly)
- [ ] Severe weather webhooks/notifications

## Contributing

When contributing:
1. Create a feature branch from `main`
2. Write/update tests for new features
3. Ensure all tests pass: `npm test`
4. Keep commits atomic with meaningful messages
5. Test in both light and dark themes
6. Test offline functionality

## Resources

- **OpenWeatherMap API**: https://openweathermap.org/api
- **Bootstrap 5**: https://getbootstrap.com/
- **Day.js**: https://day.js.org/
- **Service Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **PWA Manifest**: https://developer.mozilla.org/en-US/docs/Web/Manifest

## Quick Reference

**Environment Setup:**
```bash
npm install              # Install dependencies
cp assets/js/config.example.js assets/js/config.js
# Edit config.js with your API key
```

**Testing:**
```bash
npm test                 # Full test suite
npm run test:watch      # Watch mode
```

**Common Commits:**
```
Add weather alerts for extreme conditions
Improve 5-day forecast display with dynamic cards
Move API key to environment variables
Add dark/light theme toggle with persistent storage
```

---

**Last Updated**: 2026-08-04  
**Version**: 3.0.0 (Tier 3 Complete)
