import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
let supabaseUrl = rawUrl.replace(/\/$/, '');

// Clean URL: Ensure it's just the origin (e.g. https://xyz.supabase.co)
try {
  if (supabaseUrl.startsWith('http')) {
    const urlObj = new URL(supabaseUrl);
    supabaseUrl = urlObj.origin;
  }
} catch (e) {
  // Fallback to whatever was there
}

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Add defensive check for common copy-paste errors
const isConfigured = 
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    supabaseUrl.startsWith('https://');

if (!isConfigured) {
  console.error('Supabase credentials missing or invalid! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

// Only attempt to create the client if we have a URL to avoid the "supabaseUrl is required" error
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co', 
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);

export { isConfigured };

/**
 * Helper to check if the connection to Supabase is active.
 * Attempts to fetch the current session or a simple public resource.
 */
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('_connection_test').select('*').limit(1);
    // Note: '_connection_test' might not exist, which is fine, we just want to see if the API responds.
    // A 404 or "relation not found" error actually means the connection is active but the table is missing.
    if (error && error.code === 'PGRST116') return { status: 'connected', message: 'Connected (Ready)' };
    if (error) throw error;
    return { status: 'connected', message: 'Connected' };
  } catch (err: any) {
    // If it's a network error or invalid credentials
    if (err.message?.includes('Failed to fetch')) {
      return { status: 'error', message: 'Network Error' };
    }
    return { status: 'checking', message: 'Checking...' };
  }
}
