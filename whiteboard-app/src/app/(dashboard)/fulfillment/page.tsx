'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ModulePage from '@/components/ui/ModulePage'
import DataTable, { Column } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

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
  const { toasts, dismissToast, success, error } = useToast()
  const [tasks, setTasks] = useState<FulfillmentTask[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStage, setFilterStage] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<FulfillmentTask | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/fulfillment')
      if (res.ok) setTasks(await res.json())
    } catch {
      error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/fulfillment/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id))
        success('Task deleted')
      } else {
        error('Failed to delete task')
      }
    } catch {
      error('Failed to delete task')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = tasks
    .filter((t) => filterStage === 'all' || t.stage === filterStage)
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)

  const columns: Column<FulfillmentTask>[] = [
    { key: 'title', label: 'Task', sortable: true, render: (t) => <span className="font-medium">{t.title}</span> },
    { key: 'stage', label: 'Stage', render: (t) => <StatusBadge label={t.stage} variant={stageColors[t.stage] || 'default'} /> },
    { key: 'status', label: 'Status', render: (t) => <StatusBadge label={t.status} variant={statusColors[t.status] || 'default'} /> },
    { key: 'priority', label: 'Priority', render: (t) => <StatusBadge label={t.priority} variant={priorityColors[t.priority] || 'default'} /> },
    { key: 'assignedTo', label: 'Assigned', render: (t) => <span className="text-muted-foreground">{t.assignedTo || '-'}</span> },
    { key: 'dueDate', label: 'Due', sortable: true, render: (t) => <span className="text-muted-foreground">{t.dueDate ? formatRelativeDate(t.dueDate) : '-'}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Fulfillment Tracker"
        description="Track client onboarding and setup tasks"
        action={<Button onClick={() => router.push('/fulfillment/new')}>Add Task</Button>}
        loading={loading && tasks.length === 0}
      >
        <div className="flex gap-3">
          <Select value={filterStage} onChange={(e) => setFilterStage(e.target.value)}>
            <option value="all">All Stages</option>
            <option value="onboarding">Onboarding</option>
            <option value="setup">Setup</option>
            <option value="active">Active</option>
            <option value="review">Review</option>
            <option value="complete">Complete</option>
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="blocked">Blocked</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No fulfillment tasks match your filters"
          actions={(task) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/fulfillment/${task.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(task), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
