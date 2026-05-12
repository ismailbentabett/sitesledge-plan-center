'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface FulfillmentTask {
  id: string
  clientId: string
  title: string
  stage: string
  status: string
  assignedTo: string
  priority: string
  dueDate: string | null
  qaStatus: string
  createdAt: string
  updatedAt: string
}

const stageColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  onboarding: 'info',
  setup: 'warning',
  active: 'success',
  review: 'default',
  complete: 'success',
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  not_started: 'default',
  in_progress: 'info',
  done: 'success',
  blocked: 'danger',
}

const priorityColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'default',
  medium: 'info',
  high: 'warning',
  urgent: 'danger',
}

export default function FulfillmentPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<FulfillmentTask[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStage, setFilterStage] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/fulfillment')
      if (res.ok) setTasks(await res.json())
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/fulfillment/${id}`, { method: 'DELETE' })
      if (res.ok) setTasks(tasks.filter((t) => t.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = tasks
    .filter((t) => filterStage === 'all' || t.stage === filterStage)
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Fulfillment Tracker"
        description="Track client onboarding and setup tasks"
        action={
          <button onClick={() => router.push('/fulfillment/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Stages</option>
          <option value="onboarding">Onboarding</option>
          <option value="setup">Setup</option>
          <option value="active">Active</option>
          <option value="review">Review</option>
          <option value="complete">Complete</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No fulfillment tasks"
          description="Add a task to track client fulfillment"
          action={{ label: 'Add Task', onClick: () => router.push('/fulfillment/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Task</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stage</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assigned</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{task.title}</td>
                  <td className="px-4 py-3"><StatusBadge label={task.stage} variant={stageColors[task.stage] || 'default'} /></td>
                  <td className="px-4 py-3"><StatusBadge label={task.status} variant={statusColors[task.status] || 'default'} /></td>
                  <td className="px-4 py-3"><StatusBadge label={task.priority} variant={priorityColors[task.priority] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{task.assignedTo || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/fulfillment/${task.id}`)}
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
