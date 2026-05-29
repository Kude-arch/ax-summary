import Link from 'next/link'
import { logout } from '../actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
              관리자
            </Link>
            <Link href="/admin/week/new" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              + 새 주차
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              사이트 보기
            </Link>
            <form action={logout}>
              <button type="submit" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </div>
    </div>
  )
}
