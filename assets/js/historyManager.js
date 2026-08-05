const MAX_HISTORY = 10;
const pastSearchEl = document.querySelector('#past-searched-cities');

function saveHistory(city) {
  let history = localStorage.getItem('history') || [];
  if (history.length > 0) {
    history = JSON.parse(history);
  }

  const normalizedCity = city.trim();
  const cityIndex = history.findIndex(c => c.toLowerCase() === normalizedCity.toLowerCase());

  if (cityIndex !== -1) {
    history.splice(cityIndex, 1);
  }

  history.push(normalizedCity);

  if (history.length > MAX_HISTORY) {
    history.shift();
  }

  localStorage.setItem('history', JSON.stringify(history));
  loadHistory();
}

function getHistory() {
  let history = localStorage.getItem('history') || [];
  return history.length > 0 ? JSON.parse(history) : [];
}

function loadHistory(onCitySelect) {
  if (!pastSearchEl) return;

  pastSearchEl.innerHTML = '<h5 class="w-100 mb-3">🔍 Recent Searches</h5>';
  const history = getHistory();

  if (history.length === 0) {
    pastSearchEl.innerHTML += '<p class="text-muted w-100">No recent searches</p>';
    return;
  }

  history.forEach(city => {
    const searchBtn = document.createElement('button');
    searchBtn.setAttribute('class', 'btn btn-outline-secondary btn-sm mx-1 my-1 d-flex align-items-center gap-2');
    searchBtn.innerHTML = `<span>🌍</span> ${city}`;
    searchBtn.addEventListener('click', () => {
      if (onCitySelect) onCitySelect(city);
    });
    pastSearchEl.appendChild(searchBtn);
  });
}

function clearHistory() {
  if (pastSearchEl) {
    pastSearchEl.innerHTML = '';
  }
  localStorage.removeItem('history');
}

export {
  saveHistory,
  getHistory,
  loadHistory,
  clearHistory,
};
