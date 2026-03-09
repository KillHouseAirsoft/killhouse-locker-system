const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Helper to call Supabase REST API with authentication
async function fetchSupabase(path: string, options: any = {}) {
  const headers: any = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...(options.headers || {}),
  };
  return fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers,
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const lockerId = Array.isArray(id) ? id[0] : id;

  try {
    // Check locker availability
    const lockerRes = await fetchSupabase(`/rest/v1/lockers?id=eq.${lockerId}&select=status`);
    const lockerData = await lockerRes.json();
    if (!Array.isArray(lockerData) || lockerData.length === 0) {
      return res.status(404).json({ error: 'Locker not found' });
    }
    if (lockerData[0].status !== 'available') {
      return res.status(400).json({ error: 'Locker is not available' });
    }
    // Generate six-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    // Insert session
    const insertRes = await fetchSupabase('/rest/v1/locker_sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ locker_id: lockerId, pin_code: pin, expires_at: expiresAt }]),
    });
    if (!insertRes.ok) {
      const text = await insertRes.text();
      return res.status(500).json({ error: `Insert session failed: ${text}` });
    }
    // Update locker status to in_use
    const updateRes = await fetchSupabase(`/rest/v1/lockers?id=eq.${lockerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in_use' }),
    });
    if (!updateRes.ok) {
      const text = await updateRes.text();
      return res.status(500).json({ error: `Update locker failed: ${text}` });
    }
    return res.status(200).json({ pin_code: pin, expires_at: expiresAt });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to reserve locker' });
  }
}
