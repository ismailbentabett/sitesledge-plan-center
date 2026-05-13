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
import { formatCurrency } from '@/lib/formatters'
import { formatRelativeDate } from '@/lib/formatters'

interface Client {
  id: string
  businessName: string
  contactName: string
  email: string
  phone: string
  businessType: string
  status: string
  monthlyPrice: number
  packageName: string
  churnRisk: string
  startDate: string | null
  renewalDate: string | null
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  prospect: 'default',
  active: 'success',
  churned: 'danger',
  paused: 'warning',
}

const churnColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

export default function ClientsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterChurn, setFilterChurn] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) setClients(await res.json())
    } catch {
      error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchClients() }, [fetchClients])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/clients/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        success('Client deleted')
      } else {
        error('Failed to delete client')
      }
    } catch {
      error('Failed to delete client')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = clients
    .filter((c) => filterStatus === 'all' || c.status === filterStatus)
    .filter((c) => filterChurn === 'all' || c.churnRisk === filterChurn)

  const totalMRR = clients.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.monthlyPrice, 0)
  const activeCount = clients.filter((c) => c.status === 'active').length
  const churnRiskCount = clients.filter((c) => c.churnRisk === 'high').length

  const columns: Column<Client>[] = [
    {
      key: 'businessName',
      label: 'Business',
      sortable: true,
      render: (client) => <span className="font-medium">{client.businessName}</span>,
    },
    {
      key: 'contactName',
      label: 'Contact',
      sortable: true,
      render: (client) => (
        <div>
          <div>{client.contactName}</div>
          <div className="text-xs text-muted-foreground">{client.email}</div>
        </div>
      ),
    },
    {
      key: 'packageName',
      label: 'Package',
      sortable: true,
      render: (client) => <span className="text-muted-foreground">{client.packageName || '-'}</span>,
    },
    {
      key: 'monthlyPrice',
      label: 'MRR',
      sortable: true,
      render: (client) => <span className="font-medium">{formatCurrency(client.monthlyPrice)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (client) => <StatusBadge label={client.status} variant={statusColors[client.status] || 'default'} />,
    },
    {
      key: 'churnRisk',
      label: 'Churn Risk',
      render: (client) => <StatusBadge label={client.churnRisk} variant={churnColors[client.churnRisk] || 'default'} />,
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      render: (client) => <span className="text-xs text-muted-foreground">{formatRelativeDate(client.updatedAt)}</span>,
    },
  ]

  return (
    <>
      <ModulePage
        title="Client Tracker"
        description="Manage clients, track MRR and churn risk"
        action={
          <Button onClick={() => router.push('/clients/new')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Client
          </Button>
        }
        loading={loading && clients.length === 0}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Active Clients</p>
            <p className="text-2xl font-bold mt-1">{activeCount}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Total MRR</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalMRR)}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">High Churn Risk</p>
            <p className="text-2xl font-bold mt-1 text-destructive">{churnRiskCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="churned">Churned</option>
            <option value="paused">Paused</option>
          </Select>
          <Select
            value={filterChurn}
            onChange={(e) => setFilterChurn(e.target.value)}
          >
            <option value="all">All Churn Risk</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No clients match your filters"
          actions={(client) => [
            {
              label: 'Edit',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              ),
              onClick: () => router.push(`/clients/${client.id}`),
            },
            {
              label: 'Delete',
              icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              ),
              onClick: () => setDeleteTarget(client),
              variant: 'danger',
            },
          ]}
        />
      </ModulePage>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Client"
        description={`Are you sure you want to delete "${deleteTarget?.businessName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />

      {/* Toasts */}
      {typeof window !== 'undefined' && (
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      )}
    </>
  )
}
