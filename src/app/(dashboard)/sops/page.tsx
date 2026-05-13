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

interface SOP {
  id: string
  title: string
  category: string
  status: string
  owner: string
  estimatedMinutes: number
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  under_review: 'warning',
  archived: 'default',
}

export default function SOPsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [sops, setSOPs] = useState<SOP[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<SOP | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchSOPs = useCallback(async () => {
    try {
      const res = await fetch('/api/sops')
      if (res.ok) setSOPs(await res.json())
    } catch {
      error('Failed to load SOPs')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchSOPs() }, [fetchSOPs])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/sops/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setSOPs((prev) => prev.filter((s) => s.id !== deleteTarget.id))
        success('SOP deleted')
      } else {
        error('Failed to delete SOP')
      }
    } catch {
      error('Failed to delete SOP')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const categories = [...new Set(sops.map((s) => s.category).filter(Boolean))]
  const filtered = sops
    .filter((s) => filterCategory === 'all' || s.category === filterCategory)
    .filter((s) => filterStatus === 'all' || s.status === filterStatus)

  const columns: Column<SOP>[] = [
    { key: 'title', label: 'Title', sortable: true, render: (s) => <span className="font-medium">{s.title}</span> },
    { key: 'category', label: 'Category', sortable: true, render: (s) => <span className="text-muted-foreground">{s.category || '-'}</span> },
    { key: 'status', label: 'Status', render: (s) => <StatusBadge label={s.status} variant={statusColors[s.status] || 'default'} /> },
    { key: 'owner', label: 'Owner', render: (s) => <span className="text-muted-foreground">{s.owner || '-'}</span> },
    { key: 'estimatedMinutes', label: 'Est. Time', sortable: true, render: (s) => <span className="text-muted-foreground">{s.estimatedMinutes ? `${s.estimatedMinutes} min` : '-'}</span> },
  ]

  return (
    <>
      <ModulePage
        title="SOP Library"
        description="Standard operating procedures for fulfillment"
        action={<Button onClick={() => router.push('/sops/new')}>Add SOP</Button>}
        loading={loading && sops.length === 0}
      >
        <div className="flex gap-3">
          <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="under_review">Under Review</option>
            <option value="archived">Archived</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No SOPs match your filters"
          actions={(sop) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/sops/${sop.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(sop), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete SOP"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
