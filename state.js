const readStoredSet = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
};

const saveStoredSet = (key, values) => {
  try {
    localStorage.setItem(key, JSON.stringify([...values]));
    return true;
  } catch {
    return false;
  }
};

const readStoredValue = (key, fallback = '') => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const saveStoredValue = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const removeStoredValue = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    return false;
  }
  return true;
};

window.NexortState = {
  activeView: 'home',
  activePlatform: 'PC',
  sidebarCollapsed: readStoredValue('nexort-sidebar-collapsed') === 'true',
  isLoading: true,
  recentGames: (() => {
    try {
      const value = JSON.parse(localStorage.getItem('nexort-recent-games') || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  })(),
  downloads: new Map(),
  favorites: readStoredSet('nexort-favorites'),
  library: readStoredSet('nexort-library'),
};

window.NexortStorage = { readStoredSet, saveStoredSet, readStoredValue, saveStoredValue, removeStoredValue };
