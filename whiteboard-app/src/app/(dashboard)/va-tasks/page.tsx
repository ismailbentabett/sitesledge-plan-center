'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface VATask {
  id: string
  title: string
  description: string
  assignedTo: string
  assignedVAName: string
  status: string
  priority: string
  dueDate: string | null
  qaStatus: string
  clientId: string | null
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  todo: 'default',
  in_progress: 'info',
  done: 'success',
  archived: 'default',
}

const priorityColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

export default function VATasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<VATask[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/va-tasks')
      if (res.ok) setTasks(await res.json())
    } catch (error) {
      console.error('Failed to fetch VA tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/va-tasks/${id}`, { method: 'DELETE' })
      if (res.ok) setTasks(tasks.filter((t) => t.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = tasks
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)
    .filter((t) => filterPriority === 'all' || t.priority === filterPriority)

  const overdueCount = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done' && t.status !== 'archived').length
  const todoCount = tasks.filter((t) => t.status === 'todo').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="VA Task System"
        description="Manage virtual assistant tasks and assignments"
        action={
          <button onClick={() => router.push('/va-tasks/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">To Do</p>
          <p className="text-2xl font-bold mt-1">{todoCount}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{doneCount}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold mt-1 text-destructive">{overdueCount}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="archived">Archived</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No VA tasks yet"
          description="Add tasks to delegate to your virtual assistants"
          action={{ label: 'Add Task', onClick: () => router.push('/va-tasks/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Task</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assigned To</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">QA</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{task.assignedVAName || task.assignedTo || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge label={task.status} variant={statusColors[task.status] || 'default'} /></td>
                  <td className="px-4 py-3"><StatusBadge label={task.priority} variant={priorityColors[task.priority] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{task.qaStatus || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/va-tasks/${task.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(task.id)} disabled={deletingId === task.id}
                        className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
