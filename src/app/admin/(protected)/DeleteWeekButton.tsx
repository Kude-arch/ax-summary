'use client'

import { deleteWeek } from '../actions'

export default function DeleteWeekButton({ id, title }: { id: string; title: string }) {
  return (
    <form action={deleteWeek.bind(null, id)}>
      <button
        type="submit"
        className="text-red-400 hover:text-red-600 transition-colors"
        onClick={(e) => {
          if (!confirm(`"${title}" 주차를 삭제할까요?`)) e.preventDefault()
        }}
      >
        삭제
      </button>
    </form>
  )
}
