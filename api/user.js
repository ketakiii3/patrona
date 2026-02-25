import { setCorsHeaders } from './_lib/cors.js';
import { getClerkUserId } from './_lib/auth.js';
import { supabase } from './_lib/supabase.js';

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const clerkId = await getClerkUserId(req);
  if (!clerkId) return res.status(401).json({ success: false, error: 'Unauthorized' });

  if (!supabase) {
    return res.status(503).json({ success: false, error: 'Database not configured' });
  }

  // GET — load user profile + contacts
  if (req.method === 'GET') {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .maybeSingle();

    if (!user) return res.json({ success: true, user: null });

    const { data: contacts } = await supabase
      .from('emergency_contacts')
      .select('name, phone, relationship')
      .eq('user_id', user.id);

    return res.json({
      success: true,
      user: {
        name: user.name,
        homeAddress: user.home_address || '',
        safeWord: user.safe_word,
        emergencyContacts: contacts || [],
      },
    });
  }

  // POST — save/update user profile + contacts
  if (req.method === 'POST') {
    const { name, homeAddress, safeWord, emergencyContacts } = req.body;

    if (!name || !safeWord) {
      return res.status(400).json({ success: false, error: 'name and safeWord are required' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .upsert(
        { clerk_id: clerkId, name, home_address: homeAddress || '', safe_word: safeWord },
        { onConflict: 'clerk_id' }
      )
      .select()
      .single();

    if (error || !user) {
      console.error('[Patrona] User upsert failed:', error);
      return res.status(500).json({ success: false, error: 'Failed to save user' });
    }

    await supabase.from('emergency_contacts').delete().eq('user_id', user.id);

    if (emergencyContacts?.length) {
      await supabase.from('emergency_contacts').insert(
        emergencyContacts.map((c) => ({
          user_id: user.id,
          name: c.name,
          phone: c.phone,
          relationship: c.relationship || '',
        }))
      );
    }

    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
