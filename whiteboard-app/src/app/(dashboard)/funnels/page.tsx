'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

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
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchFunnels() }, [])

  const fetchFunnels = async () => {
    try {
      const res = await fetch('/api/funnels')
      if (res.ok) setFunnels(await res.json())
    } catch (error) {
      console.error('Failed to fetch funnels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this funnel?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/funnels/${id}`, { method: 'DELETE' })
      if (res.ok) setFunnels(funnels.filter((f) => f.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = funnels.filter((f) => filterStatus === 'all' || f.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Funnel Planner"
        description="Plan and track marketing funnels"
        action={
          <button onClick={() => router.push('/funnels/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Funnel
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="testing">Testing</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No funnels yet"
          description="Add your first funnel to start planning"
          action={{ label: 'Add Funnel', onClick: () => router.push('/funnels/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Funnel</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Traffic Source</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Conv. Rate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cost/Booked</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Close Rate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.trafficSource || '—'}</td>
                  <td className="px-4 py-3">{(f.conversionRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3">${f.costPerBookedCall}</td>
                  <td className="px-4 py-3">{(f.closeRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3"><StatusBadge label={f.status} variant={statusColors[f.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/funnels/${f.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(f.id)} disabled={deletingId === f.id}
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
