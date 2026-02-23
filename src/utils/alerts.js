const API_URL = import.meta.env.VITE_API_URL || '';

export async function sendEmergencyAlert({ userName, contacts, latitude, longitude, triggerType }) {
  try {
    const response = await fetch(`${API_URL}/api/alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, contacts, latitude, longitude, triggerType }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send alert:', error);
    return { success: false, error: error.message };
  }
}

export async function sendAllClear({ userName, contacts }) {
  try {
    const response = await fetch(`${API_URL}/api/alert/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, contacts }),
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to send all-clear:', error);
    return { success: false, error: error.message };
  }
}

export async function pingLocation({ sessionId, latitude, longitude }) {
  try {
    await fetch(`${API_URL}/api/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, latitude, longitude, timestamp: Date.now() }),
    });
  } catch {
    // Silent — pings are best-effort
  }
}
