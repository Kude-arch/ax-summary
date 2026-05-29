import WeekCard from '@/components/WeekCard'
import { Week } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

async function getWeeks(): Promise<Week[]> {
  try {
    const baseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    if (!baseUrl || !key) return []
    const url = `${baseUrl}/rest/v1/weeks?status=eq.published&select=*&order=week_number.asc`
    const res = await fetch(url, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    console.log('[getWeeks] status:', res.status)
    if (!res.ok) {
      console.error('[getWeeks] error body:', await res.text())
      return []
    }
    const data = await res.json()
    console.log('[getWeeks] rows:', data.length)
    return data
  } catch (e) {
    console.error('[getWeeks] exception:', e)
    return []
  }
}

export default async function Home() {
  const weeks = await getWeeks()

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-sm font-semibold text-indigo-600 mb-2">AI 교육 아카이브</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AX 요약정리
          </h1>
          <p className="text-gray-500 text-lg max-w-xl leading-relaxed">
            수업을 듣지 않아도 누구나 따라올 수 있도록, 주차별 이론과 실습을 정리합니다.
          </p>
        </div>
      </section>

      {/* Week grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {weeks && weeks.length > 0 ? (
          <>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              전체 {weeks.length}주차
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {weeks.map((week) => (
                <WeekCard key={week.id} week={week} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-lg font-medium">아직 업로드된 수업이 없습니다.</p>
            <p className="text-sm mt-1">곧 업로드될 예정입니다.</p>
          </div>
        )}
      </section>
    </div>
  )
}
