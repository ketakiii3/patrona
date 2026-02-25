const API_URL = import.meta.env.VITE_API_URL || '';

async function authHeaders(getToken) {
  const headers = { 'Content-Type': 'application/json' };
  if (getToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loadUserFromCloud(getToken) {
  try {
    const res = await fetch(`${API_URL}/api/user`, {
      headers: await authHeaders(getToken),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function saveUserToCloud(userData, getToken) {
  try {
    await fetch(`${API_URL}/api/user`, {
      method: 'POST',
      headers: await authHeaders(getToken),
      body: JSON.stringify(userData),
    });
  } catch {
    // best-effort — localStorage is the fallback
  }
}
