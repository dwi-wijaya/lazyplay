
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabaseServiceRole = import.meta.env.VITE_SUPABASE_SERVICE_ROLE

export const supabase = createClient(supabaseUrl, supabaseKey)
export const adminSupabase = createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})
