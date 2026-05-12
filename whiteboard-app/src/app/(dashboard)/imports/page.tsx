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

interface ImportBatch {
  id: string
  name: string
  source: string
  recordCount: number
  status: string
  fileName: string
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'default',
  processing: 'info',
  completed: 'success',
  failed: 'danger',
}

export default function ImportsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [batches, setBatches] = useState<ImportBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<ImportBatch | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchBatches = useCallback(async () => {
    try {
      const res = await fetch('/api/imports')
      if (res.ok) setBatches(await res.json())
    } catch {
      error('Failed to load imports')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchBatches() }, [fetchBatches])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/imports/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setBatches((prev) => prev.filter((b) => b.id !== deleteTarget.id))
        success('Import batch deleted')
      } else {
        error('Failed to delete import batch')
      }
    } catch {
      error('Failed to delete import batch')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = batches.filter((b) => filterStatus === 'all' || b.status === filterStatus)
  const totalRecords = batches.reduce((sum, b) => sum + b.recordCount, 0)
  const completedCount = batches.filter((b) => b.status === 'completed').length

  const columns: Column<ImportBatch>[] = [
    { key: 'name', label: 'Name', sortable: true, render: (b) => <span className="font-medium">{b.name}</span> },
    { key: 'source', label: 'Source', render: (b) => <span className="text-muted-foreground">{b.source || '-'}</span> },
    { key: 'fileName', label: 'File', render: (b) => <span className="text-muted-foreground truncate block max-w-xs">{b.fileName || '-'}</span> },
    { key: 'recordCount', label: 'Records', sortable: true, render: (b) => <span>{b.recordCount.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (b) => <StatusBadge label={b.status} variant={statusColors[b.status] || 'default'} /> },
    { key: 'createdAt', label: 'Date', sortable: true, render: (b) => <span className="text-xs text-muted-foreground">{formatRelativeDate(b.createdAt)}</span> },
  ]

  return (
    <>
      <ModulePage
        title="CSV Import / Data Room"
        description="Import and manage CSV data batches"
        action={<div className="flex items-center gap-2"><Button onClick={() => router.push('/imports/new')}>New Import</Button><Button variant="outline" onClick={() => router.push('/imports/new?upload=true')}>Upload CSV</Button></div>}
        loading={loading && batches.length === 0}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Total Batches</p>
            <p className="text-2xl font-bold mt-1">{batches.length}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold mt-1">{totalRecords.toLocaleString()}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold mt-1 text-green-600">{completedCount}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No import batches match your filters"
          actions={(batch) => [
            { label: 'View', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, onClick: () => router.push(`/imports/${batch.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(batch), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Import Batch"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
