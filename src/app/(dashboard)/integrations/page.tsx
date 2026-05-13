'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ModulePage from '@/components/ui/ModulePage'
import DataTable from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

interface IntegrationConnection {
  id: string
  name: string
  provider: string
  status: string
  lastSyncAt: string | null
  notes: string
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  disabled: 'default',
  active: 'success',
  error: 'danger',
}

export default function IntegrationsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [connections, setConnections] = useState<IntegrationConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<IntegrationConnection | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations')
      if (res.ok) setConnections(await res.json())
    } catch {
      error('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchConnections() }, [fetchConnections])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/integrations/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setConnections((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        success('Integration deleted')
      } else {
        error('Failed to delete integration')
      }
    } catch {
      error('Failed to delete integration')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = connections.filter((c) => filterStatus === 'all' || c.status === filterStatus)

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (c: IntegrationConnection) => <span className="font-medium">{c.name}</span> },
    { key: 'provider', label: 'Provider', render: (c: IntegrationConnection) => <span className="text-muted-foreground">{c.provider || '-'}</span> },
    { key: 'status', label: 'Status', render: (c: IntegrationConnection) => <StatusBadge label={c.status} variant={statusColors[c.status] || 'default'} /> },
    { key: 'lastSyncAt', label: 'Last Sync', render: (c: IntegrationConnection) => <span className="text-xs text-muted-foreground">{c.lastSyncAt ? formatRelativeDate(c.lastSyncAt) : 'Never'}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Integrations"
        description="Manage external system connections"
        action={<Button onClick={() => router.push('/integrations/new')}>Add Connection</Button>}
        loading={loading && connections.length === 0}
      >
        <div className="p-4 mb-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm border border-yellow-200 dark:border-yellow-800">
          These are placeholder entries for future CRM and external system integrations. No real API connections are active.
        </div>

        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="disabled">Disabled</option>
            <option value="active">Active</option>
            <option value="error">Error</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No integrations match your filters"
          actions={(conn: IntegrationConnection) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/integrations/${conn.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(conn), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Integration"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
