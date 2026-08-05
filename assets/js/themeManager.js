const THEME_KEY = 'theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
}

function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || getSystemTheme();
}

function setTheme(theme) {
  if (![LIGHT_THEME, DARK_THEME].includes(theme)) {
    throw new Error('Invalid theme. Use "light" or "dark"');
  }
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function initializeTheme() {
  const savedTheme = getSavedTheme();
  setTheme(savedTheme);
  return savedTheme;
}

function toggleTheme() {
  const currentTheme = getSavedTheme();
  const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
  setTheme(newTheme);
  return newTheme;
}

export { getSavedTheme, setTheme, initializeTheme, toggleTheme, LIGHT_THEME, DARK_THEME, THEME_KEY };
