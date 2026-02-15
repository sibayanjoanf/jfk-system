import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use this one in your components
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ONLY use this in Server Actions or Route Handlers (API folders)
// Never import this into a "use client" file
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error("Missing Service Role Key")
  return createClient(supabaseUrl, serviceKey)
}