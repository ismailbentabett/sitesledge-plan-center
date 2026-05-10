'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Experiment {
  id: string
  name: string
  area: string
  status: string
  decision: string
  startDate: string | null
  endDate: string | null
  createdAt: string
}

const areaLabels: Record<string, string> = {
  outreach: 'Outreach',
  offer: 'Offer',
  pricing: 'Pricing',
  channel: 'Channel',
  funnel: 'Funnel',
  ad_creative: 'Ad Creative',
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  planned: 'info',
  running: 'warning',
  completed: 'success',
  archived: 'default',
}

const decisionColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  scale: 'success',
  keep: 'info',
  kill: 'danger',
  inconclusive: 'default',
}

export default function ExperimentsPage() {
  const router = useRouter()
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterArea, setFilterArea] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchExperiments() }, [])

  const fetchExperiments = async () => {
    try {
      const res = await fetch('/api/experiments')
      if (res.ok) setExperiments(await res.json())
    } catch (error) {
      console.error('Failed to fetch experiments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experiment?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/experiments/${id}`, { method: 'DELETE' })
      if (res.ok) setExperiments(experiments.filter((e) => e.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = experiments.filter((e) =>
    (filterArea === 'all' || e.area === filterArea) &&
    (filterStatus === 'all' || e.status === filterStatus)
  )

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Experiment Tracker"
        description="Track hypotheses, results, and decisions"
        action={
          <button onClick={() => router.push('/experiments/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Experiment
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Areas</option>
          {Object.entries(areaLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="planned">Planned</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No experiments yet"
          description="Add your first experiment to start testing"
          action={{ label: 'Add Experiment', onClick: () => router.push('/experiments/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Experiment</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Area</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Decision</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Period</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{areaLabels[e.area] || e.area}</td>
                  <td className="px-4 py-3"><StatusBadge label={e.status} variant={statusColors[e.status] || 'default'} /></td>
                  <td className="px-4 py-3"><StatusBadge label={e.decision} variant={decisionColors[e.decision] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {e.startDate ? new Date(e.startDate).toLocaleDateString() : '—'} → {e.endDate ? new Date(e.endDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/experiments/${e.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(e.id)} disabled={deletingId === e.id}
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
