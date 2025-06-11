'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type Task = {
  id: number
  title: string
  description?: string
  due_date?: string
  is_complete?: boolean
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/auth')

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true })

      if (!error && data) {
        setTasks(data)
      }
    }

    fetchTasks()
  }, [router])

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error, data } = await supabase.from('tasks').insert({
      title,
      description,
      due_date: dueDate || null,
      user_id: user.id,
    }).select().single()

    if (!error && data) {
      setTasks(prev => [...prev, data])
      setTitle('')
      setDescription('')
      setDueDate('')
    }

    setLoading(false)
  }

  const handleCompleteTask = async (taskId: number) => {
  setLoading(true)
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)

  if (!error) {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  setLoading(false)
}

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">Your Tasks</h2>

      {/* Task Form */}
      <form onSubmit={handleAddTask} className="space-y-2 max-w-md ">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <DatePicker
          selected={dueDate ? new Date(dueDate) : null}
          placeholderText='Due date'
          onChange={(date: Date | null) => setDueDate(date ? date.toISOString().split('T')[0] : '')}
          className="w-full border px-3 py-2 rounded"
        />
        <div></div>
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-800 transition"
        >
          {loading ? 'Updating...' : 'Add Task'}
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-gray-500">Congratulations! You have no tasks currently.</p>
        ) : (
          tasks.map(task => (
            <li key={task.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
              <div>
              <h3 className="font-semibold text-lg">{task.title}</h3>
              
              {task.description && <p className="text-gray-600">{task.description}</p>}
              {task.due_date && (
                <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                
              )}
              </div>
              <button
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={loading}
                  className="ml-4 bg-slate-600 hover:bg-slate-800 text-white px-3 py-1 rounded ">
                  Mark as Completed
                </button>  
            </li>
          ))
        )}
      </ul>
    </div>
    
  )
}