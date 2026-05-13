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

interface Funnel {
  id: string
  name: string
  trafficSource: string
  conversionRate: number
  costPerBookedCall: number
  closeRate: number
  status: string
  createdAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  testing: 'warning',
  active: 'success',
  paused: 'default',
  retired: 'info',
}

export default function FunnelsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Funnel | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchFunnels = useCallback(async () => {
    try {
      const res = await fetch('/api/funnels')
      if (res.ok) setFunnels(await res.json())
    } catch {
      error('Failed to load funnels')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchFunnels() }, [fetchFunnels])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/funnels/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setFunnels((prev) => prev.filter((f) => f.id !== deleteTarget.id))
        success('Funnel deleted')
      } else {
        error('Failed to delete funnel')
      }
    } catch {
      error('Failed to delete funnel')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = funnels.filter((f) => filterStatus === 'all' || f.status === filterStatus)

  const columns: Column<Funnel>[] = [
    { key: 'name', label: 'Funnel', sortable: true, render: (f) => <span className="font-medium">{f.name}</span> },
    { key: 'trafficSource', label: 'Traffic Source', render: (f) => <span className="text-muted-foreground">{f.trafficSource || '—'}</span> },
    { key: 'conversionRate', label: 'Conv. Rate', sortable: true, render: (f) => <span>{(f.conversionRate * 100).toFixed(1)}%</span> },
    { key: 'costPerBookedCall', label: 'Cost/Booked', sortable: true, render: (f) => <span>${f.costPerBookedCall}</span> },
    { key: 'closeRate', label: 'Close Rate', sortable: true, render: (f) => <span>{(f.closeRate * 100).toFixed(1)}%</span> },
    { key: 'status', label: 'Status', render: (f) => <StatusBadge label={f.status} variant={statusColors[f.status] || 'default'} /> },
  ]

  return (
    <>
      <ModulePage
        title="Funnel Planner"
        description="Plan and track marketing funnels"
        action={<Button onClick={() => router.push('/funnels/new')}>Add Funnel</Button>}
        loading={loading && funnels.length === 0}
      >
        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="testing">Testing</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="retired">Retired</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No funnels match your filters"
          actions={(funnel) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/funnels/${funnel.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(funnel), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Funnel"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
