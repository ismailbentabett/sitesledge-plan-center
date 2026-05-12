'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

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
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterChurn, setFilterChurn] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) setClients(await res.json())
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' })
      if (res.ok) setClients(clients.filter((c) => c.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = clients
    .filter((c) => filterStatus === 'all' || c.status === filterStatus)
    .filter((c) => filterChurn === 'all' || c.churnRisk === filterChurn)

  const totalMRR = clients.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.monthlyPrice, 0)
  const activeCount = clients.filter((c) => c.status === 'active').length
  const churnRiskCount = clients.filter((c) => c.churnRisk === 'high').length

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Client Tracker"
        description="Manage clients, track MRR and churn risk"
        action={
          <button onClick={() => router.push('/clients/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Client
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="text-2xl font-bold mt-1">{activeCount}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Total MRR</p>
          <p className="text-2xl font-bold mt-1">${totalMRR.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">High Churn Risk</p>
          <p className="text-2xl font-bold mt-1 text-destructive">{churnRiskCount}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="prospect">Prospect</option>
          <option value="active">Active</option>
          <option value="churned">Churned</option>
          <option value="paused">Paused</option>
        </select>
        <select value={filterChurn} onChange={(e) => setFilterChurn(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Churn Risk</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Add your first client to start tracking MRR"
          action={{ label: 'Add Client', onClick: () => router.push('/clients/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Business</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Package</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">MRR</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Churn Risk</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{client.businessName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{client.contactName}</div>
                    <div className="text-xs">{client.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.packageName || '-'}</td>
                  <td className="px-4 py-3 font-medium">${client.monthlyPrice}</td>
                  <td className="px-4 py-3"><StatusBadge label={client.status} variant={statusColors[client.status] || 'default'} /></td>
                  <td className="px-4 py-3"><StatusBadge label={client.churnRisk} variant={churnColors[client.churnRisk] || 'default'} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/clients/${client.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(client.id)} disabled={deletingId === client.id}
                        className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
