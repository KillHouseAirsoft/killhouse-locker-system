import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file.  On Vercel, these variables are provided
// automatically via the project settings.
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
