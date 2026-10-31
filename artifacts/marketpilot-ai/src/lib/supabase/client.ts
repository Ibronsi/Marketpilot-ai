import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const publishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

const hasRequiredValues = Boolean(supabaseUrl && publishableKey);
const hasPublishableKey = publishableKey.startsWith('sb_publishable_');
const hasValidUrl = (() => {
  if (!supabaseUrl) return false;
  try {
    const parsed = new URL(supabaseUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
})();

export const supabaseConfigurationMessage =
  !hasRequiredValues
    ? 'Le projet Supabase n’est pas encore configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans les variables d’environnement.'
    : !hasPublishableKey
      ? 'La clé configurée n’est pas une clé publique sb_publishable_. Aucune clé secrète ou service_role ne doit être placée dans le navigateur.'
      : !hasValidUrl
        ? 'L’URL Supabase configurée est invalide.'
        : null;

export const isSupabaseConfigured = supabaseConfigurationMessage === null;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, publishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null;
