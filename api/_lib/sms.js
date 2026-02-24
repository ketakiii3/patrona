const TEXTBELT_KEY = process.env.TEXTBELT_KEY;

/**
 * Send an SMS via Textbelt.
 * Returns { success, error? }
 */
export async function sendSms(phone, message) {
  if (!TEXTBELT_KEY) {
    console.warn('[Patrona] TEXTBELT_KEY not set — mock SMS to', phone, ':', message);
    return { success: true, mock: true };
  }

  const res = await fetch('https://textbelt.com/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message, key: TEXTBELT_KEY }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Textbelt send failed');
  }
  return { success: true };
}
