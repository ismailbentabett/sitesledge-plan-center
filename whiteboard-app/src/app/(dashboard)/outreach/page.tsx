'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Campaign {
  id: string
  name: string
  channel: string
  status: string
  sentCount: number
  replyCount: number
  bookedCallCount: number
  closedWonCount: number
  replyRate: number
  bookedCallRate: number
  createdAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  paused: 'warning',
  completed: 'info',
}

export default function OutreachPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchCampaigns() }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/outreach')
      if (res.ok) setCampaigns(await res.json())
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/outreach/${id}`, { method: 'DELETE' })
      if (res.ok) setCampaigns(campaigns.filter((c) => c.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = campaigns.filter((c) => filterStatus === 'all' || c.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Outreach Planner"
        description="Track outreach campaigns and response rates"
        action={
          <button onClick={() => router.push('/outreach/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Campaign
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Add your first outreach campaign to start tracking"
          action={{ label: 'Add Campaign', onClick: () => router.push('/outreach/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Channel</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Sent</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reply Rate</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Booked</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.channel || '—'}</td>
                  <td className="px-4 py-3">{c.sentCount}</td>
                  <td className="px-4 py-3">{c.replyRate}%</td>
                  <td className="px-4 py-3">{c.bookedCallCount}</td>
                  <td className="px-4 py-3"><StatusBadge label={c.status} variant={statusColors[c.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/outreach/${c.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id}
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
