import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let _client: SupabaseClient<Database> | null = null

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Inicialización lazy — solo se crea cuando se usa por primera vez en runtime
export function getSupabase(): SupabaseClient<Database> {
  if (!_client) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase no está configurado')
    }
    _client = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _client
}
