'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Niche {
  id: string
  name: string
  description: string
  status: string
  opportunityScore: number
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  researching: 'info',
  testing: 'warning',
  active: 'success',
  paused: 'default',
  rejected: 'danger',
}

export default function NichesPage() {
  const router = useRouter()
  const [niches, setNiches] = useState<Niche[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'opportunityScore' | 'name' | 'createdAt'>('opportunityScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchNiches() }, [])

  const fetchNiches = async () => {
    try {
      const res = await fetch('/api/niches')
      if (res.ok) {
        const data = await res.json()
        setNiches(data)
      }
    } catch (error) {
      console.error('Failed to fetch niches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this niche?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/niches/${id}`, { method: 'DELETE' })
      if (res.ok) setNiches(niches.filter((n) => n.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = niches
    .filter((n) => filterStatus === 'all' || n.status === filterStatus)
    .sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      }
      return 0
    })

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Niche Research Hub"
        description="Evaluate and score target niches"
        action={
          <button onClick={() => router.push('/niches/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Niche
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="researching">Researching</option>
          <option value="testing">Testing</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="opportunityScore">Sort by Score</option>
          <option value="name">Sort by Name</option>
          <option value="createdAt">Sort by Date</option>
        </select>
        <button onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          className="h-9 px-3 text-sm border rounded-md bg-background hover:bg-accent transition-colors">
          {sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No niches yet"
          description="Add your first niche to start evaluating opportunities"
          action={{ label: 'Add Niche', onClick: () => router.push('/niches/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Niche</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Score</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Updated</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((niche) => (
                <tr key={niche.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{niche.name}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${niche.opportunityScore >= 4 ? 'text-green-600' : niche.opportunityScore >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {niche.opportunityScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge label={niche.status} variant={statusColors[niche.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(niche.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/niches/${niche.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(niche.id)} disabled={deletingId === niche.id}
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
