const API_URL = import.meta.env.VITE_API_URL || '';

async function authHeaders(getToken) {
  const headers = { 'Content-Type': 'application/json' };
  if (getToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function sendEmergencyAlert({ userName, contacts, latitude, longitude, triggerType, getToken }) {
  try {
    const response = await fetch(`${API_URL}/api/alert`, {
      method: 'POST',
      headers: await authHeaders(getToken),
      body: JSON.stringify({ userName, contacts, latitude, longitude, triggerType }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send alert:', error);
    return { success: false, error: error.message };
  }
}

export async function sendAllClear({ userName, contacts, getToken }) {
  try {
    const response = await fetch(`${API_URL}/api/alert/clear`, {
      method: 'POST',
      headers: await authHeaders(getToken),
      body: JSON.stringify({ userName, contacts }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send all-clear:', error);
    return { success: false, error: error.message };
  }
}

export async function pingLocation({ sessionId, latitude, longitude, getToken }) {
  try {
    await fetch(`${API_URL}/api/ping`, {
      method: 'POST',
      headers: await authHeaders(getToken),
      body: JSON.stringify({ sessionId, latitude, longitude, timestamp: Date.now() }),
    });
  } catch {
    // Silent — pings are best-effort
  }
}
