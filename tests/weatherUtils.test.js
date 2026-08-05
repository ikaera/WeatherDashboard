const weatherUtils = require('../assets/js/weatherUtils');

describe('Temperature Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getTemperatureUnit', () => {
    it('returns F as default', () => {
      expect(weatherUtils.getTemperatureUnit()).toBe('F');
    });

    it('returns saved unit from localStorage', () => {
      localStorage.setItem('tempUnit', 'C');
      expect(weatherUtils.getTemperatureUnit()).toBe('C');
    });
  });

  describe('setTemperatureUnit', () => {
    it('saves F to localStorage', () => {
      weatherUtils.setTemperatureUnit('F');
      expect(localStorage.getItem('tempUnit')).toBe('F');
    });

    it('saves C to localStorage', () => {
      weatherUtils.setTemperatureUnit('C');
      expect(localStorage.getItem('tempUnit')).toBe('C');
    });

    it('throws error for invalid unit', () => {
      expect(() => {
        weatherUtils.setTemperatureUnit('K');
      }).toThrow('Invalid unit. Use "F" or "C"');
    });
  });

  describe('formatTemperature', () => {
    it('returns Fahrenheit temperature rounded', () => {
      expect(weatherUtils.formatTemperature(72.4, 'F')).toBe(72);
    });

    it('converts and returns Celsius temperature rounded', () => {
      // 32°F = 0°C
      expect(weatherUtils.formatTemperature(32, 'C')).toBe(0);
      // 68°F ≈ 20°C
      expect(weatherUtils.formatTemperature(68, 'C')).toBe(20);
    });
  });

  describe('getTemperatureSymbol', () => {
    it('returns °F for Fahrenheit', () => {
      expect(weatherUtils.getTemperatureSymbol('F')).toBe('°F');
    });

    it('returns °C for Celsius', () => {
      expect(weatherUtils.getTemperatureSymbol('C')).toBe('°C');
    });
  });

  describe('convertTemperature', () => {
    it('returns Celsius when unit is C', () => {
      expect(weatherUtils.convertTemperature(20, 'C')).toBe(20);
    });

    it('converts Celsius to Fahrenheit', () => {
      // 0°C = 32°F
      expect(weatherUtils.convertTemperature(0, 'F')).toBe(32);
      // 20°C = 68°F
      expect(weatherUtils.convertTemperature(20, 'F')).toBe(68);
    });
  });
});
