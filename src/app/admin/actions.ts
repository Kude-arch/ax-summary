'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export type MaterialInput = {
  label: string
  type: 'file' | 'link'
  url: string
  order: number
}

export type WeekInput = {
  week_number: number
  label: string
  title: string
  description: string
  date: string
  status: 'draft' | 'published'
  theory_body: string
  practice_body: string
  materials: MaterialInput[]
}

export async function login(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function createWeek(data: WeekInput) {
  const supabase = await createClient()

  const { data: week, error } = await supabase
    .from('ax_weeks')
    .insert({
      week_number: data.week_number,
      label: data.label || null,
      title: data.title,
      description: data.description || null,
      date: data.date || null,
      status: data.status,
    })
    .select()
    .single()

  if (error || !week) return { error: error?.message ?? '생성 실패' }

  const contentInserts = []
  if (data.theory_body) {
    contentInserts.push({ week_id: week.id, type: 'theory', body: data.theory_body })
  }
  if (data.practice_body) {
    contentInserts.push({ week_id: week.id, type: 'practice', body: data.practice_body })
  }
  if (contentInserts.length > 0) {
    await supabase.from('ax_contents').insert(contentInserts)
  }

  if (data.materials.length > 0) {
    await supabase.from('ax_materials').insert(
      data.materials.map((m) => ({ ...m, week_id: week.id }))
    )
  }

  redirect('/admin')
}

export async function updateWeek(id: string, data: WeekInput) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('ax_weeks')
    .update({
      week_number: data.week_number,
      label: data.label || null,
      title: data.title,
      description: data.description || null,
      date: data.date || null,
      status: data.status,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  await supabase.from('ax_contents').delete().eq('week_id', id)
  await supabase.from('ax_materials').delete().eq('week_id', id)

  const contentInserts = []
  if (data.theory_body) {
    contentInserts.push({ week_id: id, type: 'theory', body: data.theory_body })
  }
  if (data.practice_body) {
    contentInserts.push({ week_id: id, type: 'practice', body: data.practice_body })
  }
  if (contentInserts.length > 0) {
    await supabase.from('ax_contents').insert(contentInserts)
  }

  if (data.materials.length > 0) {
    await supabase.from('ax_materials').insert(
      data.materials.map((m) => ({ ...m, week_id: id }))
    )
  }

  redirect('/admin')
}

export async function deleteWeek(id: string) {
  const supabase = await createClient()
  await supabase.from('ax_weeks').delete().eq('id', id)
  redirect('/admin')
}
