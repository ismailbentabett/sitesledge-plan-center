'use client'

import { useState, useEffect, useCallback } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import DataTable, { Column } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

interface WeeklyPlan {
  id: string
  weekStartDate: string
  weekEndDate: string
  weeklyGoal: string
  topPriorities: string
  mainMetric: string
  whatWorked: string
  whatDidNotWork: string
  mainBottleneck: string
  salesActions: string
  fulfillmentActions: string
  systemActions: string
  delegatedTasks: string
  stoppedTasks: string
  previousWeekReview: string
  notes: string
  createdAt: string
}

export default function WeeklyPlanningPage() {
  const { toasts, dismissToast, success, error } = useToast()
  const [plans, setPlans] = useState<WeeklyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<WeeklyPlan | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/weekly-plans')
      if (res.ok) setPlans(await res.json())
    } catch {
      error('Failed to load plans')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchPlans() }, [fetchPlans])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/weekly-plans/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        success('Plan deleted')
      } else {
        error('Failed to delete plan')
      }
    } catch {
      error('Failed to delete plan')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const columns: Column<WeeklyPlan>[] = [
    { key: 'weeklyGoal', label: 'Weekly Goal', sortable: true, render: (p) => <span className="font-medium truncate block max-w-xs">{p.weeklyGoal || '-'}</span> },
    { key: 'mainMetric', label: 'Main Metric', render: (p) => <span className="text-muted-foreground truncate block max-w-xs">{p.mainMetric || '-'}</span> },
    { key: 'weekStartDate', label: 'Week', sortable: true, render: (p) => <span className="text-xs text-muted-foreground">{formatRelativeDate(p.weekStartDate)}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Weekly Planning"
        description="Set goals and review progress each week"
        loading={loading && plans.length === 0}
      >
        <DataTable
          columns={columns}
          data={plans}
          idKey="id"
          loading={loading}
          emptyMessage="No weekly plans yet"
          actions={(plan) => [
            { label: 'View', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, onClick: () => {} },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(plan), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Plan"
        description={`Are you sure you want to delete the plan for "${deleteTarget?.weeklyGoal || 'this week'}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
