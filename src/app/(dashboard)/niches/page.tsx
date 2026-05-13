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

interface Niche {
  id: string
  name: string
  description: string
  status: string
  opportunityScore: number
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  researching: 'info',
  testing: 'warning',
  active: 'success',
  paused: 'default',
  rejected: 'danger',
}

export default function NichesPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [niches, setNiches] = useState<Niche[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Niche | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchNiches = useCallback(async () => {
    try {
      const res = await fetch('/api/niches')
      if (res.ok) setNiches(await res.json())
    } catch {
      error('Failed to load niches')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchNiches() }, [fetchNiches])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/niches/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setNiches((prev) => prev.filter((n) => n.id !== deleteTarget.id))
        success('Niche deleted')
      } else {
        error('Failed to delete niche')
      }
    } catch {
      error('Failed to delete niche')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = niches.filter((n) => filterStatus === 'all' || n.status === filterStatus)

  const columns: Column<Niche>[] = [
    { key: 'name', label: 'Niche', sortable: true, render: (n) => <span className="font-medium">{n.name}</span> },
    {
      key: 'opportunityScore',
      label: 'Score',
      sortable: true,
      render: (n) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${n.opportunityScore >= 4 ? 'bg-green-500' : n.opportunityScore >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${(n.opportunityScore / 5) * 100}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${n.opportunityScore >= 4 ? 'text-green-600' : n.opportunityScore >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
            {n.opportunityScore.toFixed(1)}
          </span>
        </div>
      ),
    },
    { key: 'status', label: 'Status', render: (n) => <StatusBadge label={n.status} variant={statusColors[n.status] || 'default'} /> },
    { key: 'updatedAt', label: 'Updated', sortable: true, render: (n) => <span className="text-xs text-muted-foreground">{formatRelativeDate(n.updatedAt)}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Niche Research Hub"
        description="Evaluate and score target niches"
        action={<Button onClick={() => router.push('/niches/new')}>Add Niche</Button>}
        loading={loading && niches.length === 0}
      >
        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="researching">Researching</option>
            <option value="testing">Testing</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No niches match your filters"
          actions={(niche) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/niches/${niche.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(niche), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Niche"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
