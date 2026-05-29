'use client'

import { useState } from 'react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { Content, Material } from '@/lib/supabase'

type Tab = 'theory' | 'practice' | 'material' | 'video'

const TABS: { key: Tab; label: string }[] = [
  { key: 'material', label: '자료' },
  { key: 'theory', label: '이론' },
  { key: 'practice', label: '실습' },
  { key: 'video', label: '참고영상' },
]

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : null
}

function LectureCard({ m }: { m: Material }) {
  const ytId = getYoutubeId(m.url)
  const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null

  return (
    <a
      href={m.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all group mb-6"
    >
      {thumbnail && (
        <div className="relative w-full aspect-video bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={m.label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="bg-indigo-50 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wide">강의 영상</span>
          <p className="text-sm font-semibold text-gray-900 mt-0.5 group-hover:text-indigo-700 transition-colors">
            {m.label}
          </p>
        </div>
        <span className="text-indigo-400 text-lg">▶</span>
      </div>
    </a>
  )
}

export default function WeekTabs({
  theory,
  practice,
  materials,
}: {
  theory: Content | null
  practice: Content | null
  materials: Material[]
}) {
  const lectures = materials.filter((m) => m.type === 'lecture')
  const nonVideos = materials.filter((m) => m.type !== 'video' && m.type !== 'lecture')
  const videos = materials.filter((m) => m.type === 'video')

  const [active, setActive] = useState<Tab>('material')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              active === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Theory */}
      {active === 'theory' && (
        <div>
          {theory?.body ? (
            <MarkdownRenderer content={theory.body} />
          ) : (
            <EmptyState message="이론 내용이 아직 준비되지 않았습니다." />
          )}
        </div>
      )}

      {/* Practice */}
      {active === 'practice' && (
        <div>
          {practice?.body ? (
            <MarkdownRenderer content={practice.body} />
          ) : (
            <EmptyState message="실습 내용이 아직 준비되지 않았습니다." />
          )}
        </div>
      )}

      {/* Materials */}
      {active === 'material' && (
        <div>
          {/* 강의 영상 (상단 강조) */}
          {lectures.map((m) => <LectureCard key={m.id} m={m} />)}

          {/* 일반 자료 */}
          {nonVideos.length > 0 ? (
            <ul className="space-y-3">
              {nonVideos.map((m) => (
                <li key={m.id}>
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 hover:shadow-sm transition-all group"
                  >
                    <span className="text-xl">
                      {m.type === 'file' ? '📄' : '🔗'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {m.label}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{m.url}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-indigo-400 transition-colors">
                      {m.type === 'file' ? '↓' : '↗'}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            lectures.length === 0 && <EmptyState message="등록된 자료가 없습니다." />
          )}
        </div>
      )}

      {/* Videos */}
      {active === 'video' && (
        <div>
          {videos.length > 0 ? (
            <div className="space-y-4">
              {videos.map((m) => {
                const ytId = getYoutubeId(m.url)
                const thumbnail = ytId
                  ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
                  : null

                return (
                  <a
                    key={m.id}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group"
                  >
                    {thumbnail && (
                      <div className="w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={thumbnail}
                          alt={m.label}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md opacity-90 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {m.label}
                      </p>
                      <p className="text-xs text-red-500 mt-2 font-medium">YouTube ↗</p>
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <EmptyState message="등록된 참고영상이 없습니다." />
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-3xl mb-3">🗂️</p>
      <p className="text-sm">{message}</p>
    </div>
  )
}
