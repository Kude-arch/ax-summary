import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'AX 요약정리',
  description: 'AI 교육 내용을 주차별로 정리한 학습 자료',
  openGraph: {
    title: 'AX 요약정리',
    description: 'AI 교육 내용을 주차별로 정리한 학습 자료',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-gray-50 font-[var(--font-geist)]">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-400">
          © 2025 AX 요약정리
        </footer>
      </body>
    </html>
  )
}
