import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Week = {
  id: string
  week_number: number
  title: string
  description: string | null
  date: string | null
  status: 'draft' | 'published'
  created_at: string
}

export type Content = {
  id: string
  week_id: string
  type: 'theory' | 'practice'
  body: string | null
  created_at: string
}

export type Material = {
  id: string
  week_id: string
  label: string
  type: 'file' | 'link' | 'video' | 'lecture'
  url: string
  file_size: number | null
  order: number
  created_at: string
}
