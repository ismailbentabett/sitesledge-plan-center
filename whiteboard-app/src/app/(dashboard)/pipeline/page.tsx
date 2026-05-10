'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

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
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchProspects() }, [])

  const fetchProspects = async () => {
    try {
      const res = await fetch('/api/pipeline')
      if (res.ok) setProspects(await res.json())
    } catch (error) {
      console.error('Failed to fetch prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this prospect?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/pipeline/${id}`, { method: 'DELETE' })
      if (res.ok) setProspects(prospects.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = prospects.filter((p) => filterStatus === 'all' || p.status === filterStatus)
  const totalValue = filtered.reduce((sum, p) => sum + p.expectedMonthlyValue, 0)
  const weightedValue = filtered.reduce((sum, p) => sum + p.expectedMonthlyValue * p.closeProbability, 0)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Sales Pipeline"
        description="Track prospects and deal flow"
        action={
          <button onClick={() => router.push('/pipeline/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Prospect
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-xs text-muted-foreground mb-1">Total Prospects</p>
          <p className="text-2xl font-bold">{filtered.length}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-xs text-muted-foreground mb-1">Total MRR Potential</p>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-xs text-muted-foreground mb-1">Weighted Value</p>
          <p className="text-2xl font-bold">${Math.round(weightedValue).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No prospects yet"
          description="Add your first prospect to start building your pipeline"
          action={{ label: 'Add Prospect', onClick: () => router.push('/pipeline/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Business</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Value</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Probability</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Follow-up</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.businessName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.ownerName || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{p.email || p.phone || '—'}</td>
                  <td className="px-4 py-3">${p.expectedMonthlyValue}/mo</td>
                  <td className="px-4 py-3">{Math.round(p.closeProbability * 100)}%</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {p.nextFollowUpAt ? new Date(p.nextFollowUpAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3"><StatusBadge label={statusLabels[p.status] || p.status} variant={statusColors[p.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/pipeline/${p.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}
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
