import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser Supabase client — safe to use in Client Components.
 * Uses the anon key and respects Row-Level Security policies.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
