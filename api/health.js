export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.json({
    ok: true,
    twilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
    timestamp: new Date().toISOString(),
  });
}
