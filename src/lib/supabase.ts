import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURACIÓN DE SUPABASE:
 * Aquí se inicializa la conexión con el Backend (Baas - Backend as a Service).
 * Utilizamos variables de entorno para no exponer las claves directamente en el código.
 */

// Extraemos la URL y la Key Anónima de las variables de entorno (.env)
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
let supabaseUrl = rawUrl.replace(/\/$/, '');

// Limpieza de URL para asegurar que sea válida
try {
  if (supabaseUrl.startsWith('http')) {
    const urlObj = new URL(supabaseUrl);
    supabaseUrl = urlObj.origin;
  }
} catch (e) {}

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Verificación de seguridad para confirmar que el proyecto está conectado
const isConfigured = 
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://');

/**
 * INSTANCIA DE SUPABASE:
 * Esta es la variable que importamos en otros archivos para hacer
 * 'supabase.from(...)' o 'supabase.auth(...)'.
 */
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
