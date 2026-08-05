const errorMessageEl = document.querySelector('#error-message');
const weatherPlaceholder = document.querySelector('#weather-placeholder');

function showError(message) {
  if (errorMessageEl) {
    errorMessageEl.textContent = message;
    errorMessageEl.style.display = 'block';
  }
}

function hideError() {
  if (errorMessageEl) {
    errorMessageEl.style.display = 'none';
  }
}

function showLoading() {
  if (weatherPlaceholder) {
    weatherPlaceholder.innerHTML = '<div class="placeholder-content">Loading weather data...</div>';
    weatherPlaceholder.style.display = 'block';
  }
}

function hideLoading() {
  if (weatherPlaceholder) {
    weatherPlaceholder.style.display = 'none';
  }
}

function showSuccess(message) {
  if (errorMessageEl) {
    errorMessageEl.textContent = message;
    errorMessageEl.style.color = '#28a745';
    errorMessageEl.style.display = 'block';
    setTimeout(() => {
      hideError();
      errorMessageEl.style.color = '';
    }, 3000);
  }
}

function showPlaceholder(message) {
  if (weatherPlaceholder) {
    weatherPlaceholder.innerHTML = `<div class="placeholder-content">${message}</div>`;
    weatherPlaceholder.style.display = 'block';
  }
}

export {
  showError,
  hideError,
  showLoading,
  hideLoading,
  showSuccess,
  showPlaceholder,
};
