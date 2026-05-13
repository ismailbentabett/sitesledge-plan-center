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
import { formatCurrency, formatRelativeDate } from '@/lib/formatters'

interface Prospect {
  id: string
  businessName: string
  ownerName: string
  email: string
  phone: string
  status: string
  expectedMonthlyValue: number
  closeProbability: number
  nextFollowUpAt: string | null
  createdAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  new: 'info',
  contacted: 'default',
  interested: 'warning',
  proposal_sent: 'warning',
  won: 'success',
  lost: 'danger',
}

const statusLabels: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  interested: 'Interested',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
}

export default function PipelinePage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Prospect | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProspects = useCallback(async () => {
    try {
      const res = await fetch('/api/pipeline')
      if (res.ok) setProspects(await res.json())
    } catch {
      error('Failed to load prospects')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchProspects() }, [fetchProspects])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/pipeline/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setProspects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        success('Prospect deleted')
      } else {
        error('Failed to delete prospect')
      }
    } catch {
      error('Failed to delete prospect')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = prospects.filter((p) => filterStatus === 'all' || p.status === filterStatus)
  const totalValue = filtered.reduce((sum, p) => sum + p.expectedMonthlyValue, 0)
  const weightedValue = filtered.reduce((sum, p) => sum + p.expectedMonthlyValue * p.closeProbability, 0)

  const columns: Column<Prospect>[] = [
    { key: 'businessName', label: 'Business', sortable: true, render: (p) => <span className="font-medium">{p.businessName}</span> },
    { key: 'ownerName', label: 'Owner', render: (p) => <span className="text-muted-foreground">{p.ownerName || '—'}</span> },
    { key: 'email', label: 'Contact', render: (p) => <span className="text-xs text-muted-foreground">{p.email || p.phone || '—'}</span> },
    { key: 'expectedMonthlyValue', label: 'Value', sortable: true, render: (p) => <span>{formatCurrency(p.expectedMonthlyValue)}/mo</span> },
    { key: 'closeProbability', label: 'Probability', sortable: true, render: (p) => <span>{Math.round(p.closeProbability * 100)}%</span> },
    { key: 'nextFollowUpAt', label: 'Follow-up', render: (p) => <span className="text-xs text-muted-foreground">{p.nextFollowUpAt ? formatRelativeDate(p.nextFollowUpAt) : '—'}</span> },
    { key: 'status', label: 'Status', render: (p) => <StatusBadge label={statusLabels[p.status] || p.status} variant={statusColors[p.status] || 'default'} /> },
  ]

  return (
    <>
      <ModulePage
        title="Sales Pipeline"
        description="Track prospects and deal flow"
        action={<Button onClick={() => router.push('/pipeline/new')}>Add Prospect</Button>}
        loading={loading && prospects.length === 0}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Total Prospects</p>
            <p className="text-2xl font-bold mt-1">{filtered.length}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">MRR Potential</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalValue)}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Weighted Value</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(Math.round(weightedValue))}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No prospects match your filters"
          actions={(prospect) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/pipeline/${prospect.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(prospect), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Prospect"
        description={`Are you sure you want to delete "${deleteTarget?.businessName}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
