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

  describe('calculateDewPoint', () => {
    it('calculates dew point correctly', () => {
      // At 20°C with 50% humidity, dew point is approximately 9.3°C
      const dewPoint = weatherUtils.calculateDewPoint(20, 50);
      expect(dewPoint).toBeGreaterThan(8);
      expect(dewPoint).toBeLessThan(11);
    });

    it('returns higher dew point with higher humidity', () => {
      const dewPoint50 = weatherUtils.calculateDewPoint(20, 50);
      const dewPoint80 = weatherUtils.calculateDewPoint(20, 80);
      expect(dewPoint80).toBeGreaterThan(dewPoint50);
    });
  });

  describe('getWindDirection', () => {
    it('returns N for 0 degrees', () => {
      expect(weatherUtils.getWindDirection(0)).toBe('N');
    });

    it('returns E for 90 degrees', () => {
      expect(weatherUtils.getWindDirection(90)).toBe('E');
    });

    it('returns S for 180 degrees', () => {
      expect(weatherUtils.getWindDirection(180)).toBe('S');
    });

    it('returns W for 270 degrees', () => {
      expect(weatherUtils.getWindDirection(270)).toBe('W');
    });

    it('returns NE for 45 degrees', () => {
      expect(weatherUtils.getWindDirection(45)).toBe('NE');
    });
  });

  describe('formatPressure', () => {
    it('converts pressure in mb to inHg', () => {
      const pressure = weatherUtils.formatPressure(1013.25);
      expect(pressure.mb).toBe(1013.25);
      expect(parseFloat(pressure.inHg)).toBeCloseTo(29.92, 1);
    });
  });
});
