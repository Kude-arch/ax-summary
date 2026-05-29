import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import WeekForm from '../../../../WeekForm'

export default async function EditWeekPage(props: PageProps<'/admin/week/[id]/edit'>) {
  const { id } = await props.params
  const supabase = await createClient()

  const [{ data: week }, { data: contents }, { data: materials }] = await Promise.all([
    supabase.from('weeks').select('*').eq('id', id).single(),
    supabase.from('contents').select('*').eq('week_id', id),
    supabase.from('materials').select('*').eq('week_id', id).order('order', { ascending: true }),
  ])

  if (!week) notFound()

  const theory = contents?.find((c) => c.type === 'theory')
  const practice = contents?.find((c) => c.type === 'practice')

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">
        Week {week.week_number} 수정
      </h1>
      <WeekForm
        mode="edit"
        weekId={week.id}
        defaultValues={{
          week_number: week.week_number,
          title: week.title,
          description: week.description ?? '',
          date: week.date ?? '',
          status: week.status as 'draft' | 'published',
          theory_body: theory?.body ?? '',
          practice_body: practice?.body ?? '',
          materials: materials?.map((m) => ({
            label: m.label,
            type: m.type as 'file' | 'link',
            url: m.url,
            order: m.order,
          })) ?? [],
        }}
      />
    </div>
  )
}
