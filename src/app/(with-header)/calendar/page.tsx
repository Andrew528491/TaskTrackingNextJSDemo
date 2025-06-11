'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './calendarOverrides.css'

type Task = {
  id: number
  title: string
  due_date?: string
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/auth')

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      if (!error && data) {
        setTasks(data)
      }
    }

    fetchTasks()
  }, [])

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!task.due_date) return acc
    const dateKey = new Date(task.due_date).toISOString().split('T')[0]
    acc[dateKey] = acc[dateKey] || []
    acc[dateKey].push(task)
    return acc
  }, {})

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">Your Task Calendar</h2>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-7xl h-[80vh] overflow-auto">
        <Calendar
          tileContent={({ date }) => {
            const dateKey = date.toISOString().split('T')[0]
            const dayTasks = tasksByDate[dateKey] || []

            return dayTasks.length > 0 ? (
              <ul className="mt-1 text-sm text-slate-700 space-y-0.5">
                {dayTasks.map(task => (
                  <li key={task.id}>• {task.title}</li>
                ))}
              </ul>
            ) : null
          }}
        />
      </div>
    </div>
  )
}