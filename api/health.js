import { setCorsHeaders } from './_lib/cors.js';

export default function handler(req, res) {
  setCorsHeaders(req, res);

  res.json({
    ok: true,
    twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    timestamp: new Date().toISOString(),
  });
}
