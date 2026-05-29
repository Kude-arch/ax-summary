import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
          AX 요약정리
        </Link>
        <Link
          href="/admin"
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          관리자
        </Link>
      </div>
    </header>
  )
}
