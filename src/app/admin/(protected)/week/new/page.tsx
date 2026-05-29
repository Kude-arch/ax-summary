import WeekForm from '../../../WeekForm'

export default function NewWeekPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">새 주차 추가</h1>
      <WeekForm mode="create" />
    </div>
  )
}
