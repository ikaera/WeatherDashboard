import { API_KEY, REFRESH_INTERVAL } from './config.js';
import { initializeApp } from './weather.js';
import { initializeTheme } from './themeManager.js';

initializeTheme();
initializeApp(API_KEY, REFRESH_INTERVAL);
