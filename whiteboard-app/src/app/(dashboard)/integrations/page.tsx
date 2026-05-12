'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Integration {
  id: string
  name: string
  provider: string
  status: string
  lastSyncAt: string | null
  createdAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  disabled: 'default',
  active: 'success',
  error: 'danger',
}

export default function IntegrationsPage() {
  const router = useRouter()
  const [connections, setConnections] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchConnections() }, [])

  const fetchConnections = async () => {
    try {
      const res = await fetch('/api/integrations')
      if (res.ok) setConnections(await res.json())
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this integration?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/integrations/${id}`, { method: 'DELETE' })
      if (res.ok) setConnections(connections.filter((c) => c.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = connections
    .filter((c) => filterStatus === 'all' || c.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Integrations"
        description="Manage external service connections"
        action={
          <button onClick={() => router.push('/integrations/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Connection
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="disabled">Disabled</option>
          <option value="active">Active</option>
          <option value="error">Error</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No integrations yet"
          description="Connect external services to extend functionality"
          action={{ label: 'Add Connection', onClick: () => router.push('/integrations/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Sync</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((conn) => (
                <tr key={conn.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{conn.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{conn.provider || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge label={conn.status} variant={statusColors[conn.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{conn.lastSyncAt ? new Date(conn.lastSyncAt).toLocaleDateString() : 'Never'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/integrations/${conn.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(conn.id)} disabled={deletingId === conn.id}
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
