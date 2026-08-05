# Contributing to Weather Dashboard

Thank you for your interest in contributing to the Weather Dashboard! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Ask questions before making assumptions
- Credit others' work appropriately

## Getting Started

### Prerequisites

- Node.js 14+ 
- Git
- OpenWeatherMap API key (free tier: https://openweathermap.org/api)

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/ikaera/WeatherDashboard.git
cd WeatherDashboard

# Install dependencies
npm install

# Create config file
cp assets/js/config.example.js assets/js/config.js

# Edit config.js with your API key
# export const API_KEY = 'your_api_key_here';

# Run tests to verify setup
npm test
```

## Making Changes

### Branch Naming

Use clear, descriptive branch names:
- `feature/dark-theme` - New feature
- `fix/temperature-conversion-bug` - Bug fix
- `docs/update-readme` - Documentation
- `test/add-alert-tests` - Tests

```bash
git checkout -b feature/your-feature-name
```

### Commit Messages

Write clear, atomic commits with meaningful messages:

**Good:**
```
Add weather alerts for extreme conditions
Improve 5-day forecast display with dynamic cards
Fix temperature conversion edge case for below zero
```

**Avoid:**
```
Update code
Fix stuff
Work in progress
```

**Format:**
- First line: 50 characters max, imperative mood ("Add" not "Added")
- Blank line
- Optional detailed explanation (if needed)

### Testing

All changes must maintain or improve test coverage:

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode (for development)
npm run test:watch
```

**Test Guidelines:**
- Write tests for new utilities
- Cover edge cases (zero, negative, boundary values)
- Update existing tests if behavior changes
- Maintain 100% coverage for utilities (weatherUtils.js)

## Feature Development Checklist

- [ ] **Code**: Feature implemented with clean, readable code
- [ ] **Tests**: New tests added; coverage maintained (29+ tests)
- [ ] **Documentation**: Code comments explain non-obvious WHY
- [ ] **Themes**: Works in both light and dark themes
- [ ] **Offline**: Works with service worker (PWA compatible)
- [ ] **Accessibility**: Semantic HTML, proper labels, keyboard navigation
- [ ] **Performance**: No memory leaks, efficient DOM updates
- [ ] **Errors**: Graceful error handling with user-friendly messages
- [ ] **Commit**: Single, well-described commit (or logical series)

## Pull Request Process

1. **Push your branch** to your fork
2. **Create a Pull Request** with:
   - Clear title describing the change
   - Description of what and why
   - Link any related issues
   - Screenshot/demo if UI changes
3. **Wait for review** (target: 24-48 hours)
4. **Address feedback** - push additional commits
5. **Merge** once approved

### PR Title Format

```
[Feature/Fix/Docs] Brief description of change

Examples:
[Feature] Add hourly forecast display
[Fix] Correct temperature conversion bug
[Docs] Update API key setup instructions
```

## Code Style

### General Principles

- **No unnecessary comments** - code should be self-documenting
- **Meaningful names** - functions and variables explain their purpose
- **Single responsibility** - functions do one thing well
- **DRY** - Don't repeat yourself

### JavaScript Style Guide

```javascript
// ✅ Good: Clear variable names, const by default
const tempUnit = getTemperatureUnit();
const formattedTemp = formatTemperature(72.5, tempUnit);

// ❌ Avoid: Unclear abbreviations, var
var t = gt();
var f = fmt(72.5, t);
```

```javascript
// ✅ Good: Arrow functions for callbacks
alerts.forEach(alert => displayAlert(alert));

// ✅ Good: Template literals
const message = `Temperature is ${temp}${unit}`;

// ❌ Avoid: String concatenation
var message = 'Temperature is ' + temp + unit;
```

### CSS Style Guide

```css
/* ✅ Good: Clear selectors, organized properties */
.forecast-card {
  background: var(--cl-primary-opacity);
  padding: 15px;
  border-radius: 8px;
  transition: transform 0.2s;
}

/* ❌ Avoid: Generic selectors, magic numbers */
.card {
  background: #0b0980d8;
  padding: 15px;
  border-radius: 8;
}
```

## Directory Structure

When adding new files:

- **New utilities** → `assets/js/utilityName.js`
- **New styles** → Add to `assets/css/style.css` with clear sections
- **Tests for utilities** → `tests/utilityName.test.js`
- **Documentation** → Update relevant sections in `CLAUDE.md`

## Architecture Guidelines

### Module Organization

```javascript
// ✅ Good: Clear exports, organized structure
export function getWeatherAlerts(data) { ... }
export const ALERT_THRESHOLDS = { ... };

// ✅ Good: Separate concerns
// weatherAlerts.js handles alert logic
// weather.js handles display/DOM
```

### LocalStorage Conventions

```javascript
// Define constants for keys
const THEME_KEY = 'theme';
const FAVORITES_KEY = 'favoriteCities';

// Use JSON for complex data
const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
```

## Documentation Updates

Update relevant documentation when:
- Adding a new feature
- Changing API behavior
- Adding configuration options
- Fixing bugs with workarounds

**Files to update:**
- `CLAUDE.md` - Architecture, setup, guidelines
- `README.md` - User-facing documentation
- Inline code comments - Non-obvious logic only

## Performance Considerations

- Minimize DOM manipulation (batch updates)
- Cache DOM queries that are reused
- Use debouncing for frequent events
- Profile before and after changes
- Service worker caching for offline support

## Accessibility

- Use semantic HTML (`<button>`, `<section>`, etc.)
- Include alt text for images
- Ensure keyboard navigation works
- Sufficient color contrast (WCAG AA minimum)
- ARIA labels where needed

## Security

- Never commit API keys or secrets
- Always use `config.js` (gitignored) for sensitive data
- Validate user input before using in DOM
- Use safe methods (not `innerHTML` for untrusted data)
- Keep dependencies updated

## Troubleshooting

### Tests fail locally

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Service worker issues

```javascript
// Clear old service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### Theme not applying

Check:
1. `data-theme` attribute on `<html>` element
2. CSS variables in `:root` and `[data-theme="dark"]`
3. Browser DevTools → Elements → Check computed styles

## Questions?

- Check `CLAUDE.md` for project guidelines
- Review existing code for patterns
- Open an issue for discussion before major changes
- Ask in PR comments for clarification

## Recognition

All contributors will be credited in:
- `README.md` contributors section
- GitHub contributors page
- Release notes

Thank you for contributing to Weather Dashboard! 🌤️
