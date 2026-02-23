const USER_KEY = 'patrona_user';
const SESSIONS_KEY = 'patrona_sessions';

export function hasUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return false;
    const user = JSON.parse(raw);
    return !!(user?.name && user?.safeWord);
  } catch {
    return false;
  }
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function saveUser(userData) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSession(session) {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions.slice(0, 50)));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
