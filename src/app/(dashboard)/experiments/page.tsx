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
import { formatDate } from '@/lib/formatters'

interface Experiment {
  id: string
  name: string
  area: string
  status: string
  decision: string
  startDate: string | null
  endDate: string | null
  createdAt: string
}

const areaLabels: Record<string, string> = {
  outreach: 'Outreach',
  offer: 'Offer',
  pricing: 'Pricing',
  channel: 'Channel',
  funnel: 'Funnel',
  ad_creative: 'Ad Creative',
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  planned: 'info',
  running: 'warning',
  completed: 'success',
  archived: 'default',
}

const decisionColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  scale: 'success',
  keep: 'info',
  kill: 'danger',
  inconclusive: 'default',
}

export default function ExperimentsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterArea, setFilterArea] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Experiment | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchExperiments = useCallback(async () => {
    try {
      const res = await fetch('/api/experiments')
      if (res.ok) setExperiments(await res.json())
    } catch {
      error('Failed to load experiments')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchExperiments() }, [fetchExperiments])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/experiments/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setExperiments((prev) => prev.filter((e) => e.id !== deleteTarget.id))
        success('Experiment deleted')
      } else {
        error('Failed to delete experiment')
      }
    } catch {
      error('Failed to delete experiment')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = experiments.filter((e) =>
    (filterArea === 'all' || e.area === filterArea) &&
    (filterStatus === 'all' || e.status === filterStatus)
  )

  const columns: Column<Experiment>[] = [
    { key: 'name', label: 'Experiment', sortable: true, render: (e) => <span className="font-medium">{e.name}</span> },
    { key: 'area', label: 'Area', render: (e) => <span className="text-muted-foreground">{areaLabels[e.area] || e.area}</span> },
    { key: 'status', label: 'Status', render: (e) => <StatusBadge label={e.status} variant={statusColors[e.status] || 'default'} /> },
    { key: 'decision', label: 'Decision', render: (e) => <StatusBadge label={e.decision} variant={decisionColors[e.decision] || 'default'} /> },
    { key: 'startDate', label: 'Period', render: (e) => <span className="text-xs text-muted-foreground">{e.startDate ? formatDate(e.startDate) : '—'} → {e.endDate ? formatDate(e.endDate) : '—'}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Experiment Tracker"
        description="Track hypotheses, results, and decisions"
        action={<Button onClick={() => router.push('/experiments/new')}>Add Experiment</Button>}
        loading={loading && experiments.length === 0}
      >
        <div className="flex gap-3">
          <Select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
            <option value="all">All Areas</option>
            {Object.entries(areaLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No experiments match your filters"
          actions={(experiment) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/experiments/${experiment.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(experiment), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Experiment"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
