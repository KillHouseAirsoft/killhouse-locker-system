import { Request, Response } from 'express';
import { supabase } from '../supabaseClient.js';

/**
 * GET /api/lockers
 * Returns a list of all lockers with their current status and metadata.
 * Locks are ordered by ascending id.  If an error occurs while querying
 * Supabase, the server responds with a 500 status code.
 */
export async function getLockersList(req: Request, res: Response) {
  try {
    const { data, error } = await supabase
      .from('lockers')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      throw error;
    }
    return res.json(data ?? []);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch lockers list' });
  }
}
