import Link from 'next/link'
import { Week } from '@/lib/supabase'

export default function WeekCard({ week }: { week: Week }) {
  const formattedDate = week.date
    ? new Date(week.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <Link href={`/week/${week.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-full hover:shadow-md hover:border-indigo-200 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Week {week.week_number}
          </span>
          {formattedDate && (
            <span className="text-xs text-gray-400">{formattedDate}</span>
          )}
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {week.title}
        </h2>
        {week.description && (
          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
            {week.description}
          </p>
        )}
        <div className="mt-4 flex items-center text-xs text-indigo-500 font-medium">
          자세히 보기 →
        </div>
      </div>
    </Link>
  )
}
