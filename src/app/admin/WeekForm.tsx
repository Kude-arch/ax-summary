'use client'

import { useState, useTransition } from 'react'
import { createWeek, updateWeek, WeekInput, MaterialInput } from './actions'

type Props = {
  mode: 'create' | 'edit'
  weekId?: string
  defaultValues?: Partial<WeekInput>
}

const emptyMaterial = (): MaterialInput => ({ label: '', type: 'link', url: '', order: 0 })

export default function WeekForm({ mode, weekId, defaultValues }: Props) {
  const [weekNumber, setWeekNumber] = useState(defaultValues?.week_number?.toString() ?? '')
  const [title, setTitle] = useState(defaultValues?.title ?? '')
  const [description, setDescription] = useState(defaultValues?.description ?? '')
  const [date, setDate] = useState(defaultValues?.date ?? '')
  const [status, setStatus] = useState<'draft' | 'published'>(defaultValues?.status ?? 'draft')
  const [theoryBody, setTheoryBody] = useState(defaultValues?.theory_body ?? '')
  const [practiceBody, setPracticeBody] = useState(defaultValues?.practice_body ?? '')
  const [materials, setMaterials] = useState<MaterialInput[]>(
    defaultValues?.materials ?? []
  )
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const addMaterial = () => setMaterials([...materials, emptyMaterial()])
  const removeMaterial = (i: number) => setMaterials(materials.filter((_, idx) => idx !== i))
  const updateMaterial = (i: number, field: keyof MaterialInput, value: string) => {
    setMaterials(materials.map((m, idx) => idx === i ? { ...m, [field]: value } : m))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const data: WeekInput = {
      week_number: parseInt(weekNumber),
      title,
      description,
      date,
      status,
      theory_body: theoryBody,
      practice_body: practiceBody,
      materials: materials.map((m, i) => ({ ...m, order: i })),
    }

    startTransition(async () => {
      const result = mode === 'create'
        ? await createWeek(data)
        : await updateWeek(weekId!, data)
      if (result?.error) setError(result.error)
    })
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'
  const sectionClass = 'bg-white border border-gray-200 rounded-xl p-6 space-y-4'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 기본 정보 */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-gray-900 text-base">기본 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>주차 번호 *</label>
            <input type="number" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)}
              required min={1} className={inputClass} placeholder="1" />
          </div>
          <div>
            <label className={labelClass}>날짜</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>제목 *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            required className={inputClass} placeholder="수업 제목을 입력하세요" />
        </div>
        <div>
          <label className={labelClass}>설명</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2} className={inputClass} placeholder="수업에 대한 간단한 설명" />
        </div>
        <div>
          <label className={labelClass}>공개 상태</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
            className={inputClass}>
            <option value="draft">준비중 (비공개)</option>
            <option value="published">공개</option>
          </select>
        </div>
      </div>

      {/* 이론 */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-gray-900 text-base">이론</h2>
        <p className="text-xs text-gray-400">마크다운 형식으로 작성하세요.</p>
        <textarea value={theoryBody} onChange={(e) => setTheoryBody(e.target.value)}
          rows={12} className={`${inputClass} font-mono text-xs leading-relaxed`}
          placeholder="## 이론 제목&#10;&#10;내용을 입력하세요..." />
      </div>

      {/* 실습 */}
      <div className={sectionClass}>
        <h2 className="font-semibold text-gray-900 text-base">실습</h2>
        <p className="text-xs text-gray-400">바이브코딩 예시 코드와 설명을 마크다운으로 작성하세요.</p>
        <textarea value={practiceBody} onChange={(e) => setPracticeBody(e.target.value)}
          rows={12} className={`${inputClass} font-mono text-xs leading-relaxed`}
          placeholder="## 실습 제목&#10;&#10;```python&#10;# 코드 예시&#10;```" />
      </div>

      {/* 자료 */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-base">자료</h2>
          <button type="button" onClick={addMaterial}
            className="text-xs text-indigo-600 hover:underline">
            + 추가
          </button>
        </div>
        {materials.length === 0 ? (
          <p className="text-sm text-gray-400">자료가 없습니다. 추가 버튼을 눌러 자료를 등록하세요.</p>
        ) : (
          <div className="space-y-3">
            {materials.map((m, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <input value={m.label} onChange={(e) => updateMaterial(i, 'label', e.target.value)}
                    className={inputClass} placeholder="자료명" />
                  <select value={m.type} onChange={(e) => updateMaterial(i, 'type', e.target.value)}
                    className={inputClass}>
                    <option value="lecture">강의 영상 (유튜브)</option>
                    <option value="link">링크</option>
                    <option value="file">파일 URL</option>
                    <option value="video">참고영상 (유튜브)</option>
                  </select>
                  <input value={m.url} onChange={(e) => updateMaterial(i, 'url', e.target.value)}
                    className={inputClass} placeholder="https://..." />
                </div>
                <button type="button" onClick={() => removeMaterial(i)}
                  className="text-gray-300 hover:text-red-400 transition-colors mt-2 text-sm">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-2 px-6 rounded-lg transition-colors text-sm">
          {isPending ? '저장 중...' : mode === 'create' ? '주차 생성' : '변경사항 저장'}
        </button>
        <a href="/admin" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2 px-6 rounded-lg transition-colors text-sm">
          취소
        </a>
      </div>
    </form>
  )
}
