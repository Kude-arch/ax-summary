import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import WeekTabs from './WeekTabs'
import type { Metadata } from 'next'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  )
}

export async function generateMetadata(props: PageProps<'/week/[id]'>): Promise<Metadata> {
  const { id } = await props.params
  const supabase = getSupabase()
  const { data: week } = await supabase.from('weeks').select('title, description').eq('id', id).single()
  if (!week) return {}
  return { title: `${week.title} | AX 요약정리`, description: week.description ?? undefined }
}

export default async function WeekPage(props: PageProps<'/week/[id]'>) {
  const { id } = await props.params
  const supabase = getSupabase()

  const [{ data: week }, { data: contents }, { data: materials }] = await Promise.all([
    supabase.from('weeks').select('*').eq('id', id).eq('status', 'published').single(),
    supabase.from('contents').select('*').eq('week_id', id),
    supabase.from('materials').select('*').eq('week_id', id).order('order', { ascending: true }),
  ])

  if (!week) notFound()

  const theory = contents?.find((c) => c.type === 'theory') ?? null
  const practice = contents?.find((c) => c.type === 'practice') ?? null

  const formattedDate = week.date
    ? new Date(week.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">홈</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Week {week.week_number}</span>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Week {week.week_number}
          </span>
          {formattedDate && (
            <span className="text-xs text-gray-400">{formattedDate}</span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{week.title}</h1>
        {week.description && (
          <p className="text-gray-500 leading-relaxed">{week.description}</p>
        )}
      </div>

      {/* Tabs */}
      <WeekTabs
        theory={theory}
        practice={practice}
        materials={materials ?? []}
      />

      {/* Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">
          ← 전체 목록으로
        </Link>
      </div>
    </div>
  )
}
