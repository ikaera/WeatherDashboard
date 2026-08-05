let refreshTimer = null;
let currentRefreshCallback = null;

function startAutoRefresh(refreshCallback, interval) {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }

  currentRefreshCallback = refreshCallback;
  refreshTimer = setInterval(() => {
    if (currentRefreshCallback) {
      currentRefreshCallback();
    }
  }, interval);
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

function isAutoRefreshActive() {
  return refreshTimer !== null;
}

export {
  startAutoRefresh,
  stopAutoRefresh,
  isAutoRefreshActive,
};
