import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import DeleteWeekButton from './DeleteWeekButton'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: weeks } = await supabase
    .from('weeks')
    .select('*')
    .order('week_number', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">주차 관리</h1>
        <Link
          href="/admin/week/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + 새 주차 추가
        </Link>
      </div>

      {weeks && weeks.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-16">주차</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">제목</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-24">날짜</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 w-20">상태</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 w-24">관리</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">W{week.week_number}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{week.title}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {week.date ? new Date(week.date).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      week.status === 'published'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {week.status === 'published' ? '공개' : '준비중'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/week/${week.id}/edit`}
                        className="text-indigo-600 hover:underline"
                      >
                        수정
                      </Link>
                      <DeleteWeekButton id={week.id} title={week.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 bg-white border border-gray-200 rounded-xl">
          <p className="text-3xl mb-3">📝</p>
          <p className="text-sm">등록된 주차가 없습니다.</p>
          <Link href="/admin/week/new" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
            첫 번째 주차 추가하기 →
          </Link>
        </div>
      )}
    </div>
  )
}
