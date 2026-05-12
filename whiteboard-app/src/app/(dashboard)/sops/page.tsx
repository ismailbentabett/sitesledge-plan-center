'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface SOP {
  id: string
  title: string
  category: string
  status: string
  owner: string
  estimatedMinutes: number
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  under_review: 'warning',
  archived: 'default',
}

export default function SOPsPage() {
  const router = useRouter()
  const [sops, setSOPs] = useState<SOP[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchSOPs() }, [])

  const fetchSOPs = async () => {
    try {
      const res = await fetch('/api/sops')
      if (res.ok) setSOPs(await res.json())
    } catch (error) {
      console.error('Failed to fetch SOPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this SOP?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/sops/${id}`, { method: 'DELETE' })
      if (res.ok) setSOPs(sops.filter((s) => s.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const categories = [...new Set(sops.map((s) => s.category).filter(Boolean))]
  const filtered = sops
    .filter((s) => filterCategory === 'all' || s.category === filterCategory)
    .filter((s) => filterStatus === 'all' || s.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="SOP Library"
        description="Standard operating procedures for fulfillment"
        action={
          <button onClick={() => router.push('/sops/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add SOP
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="under_review">Under Review</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No SOPs yet"
          description="Document your processes for consistent fulfillment"
          action={{ label: 'Add SOP', onClick: () => router.push('/sops/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Est. Time</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sop) => (
                <tr key={sop.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{sop.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sop.category || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge label={sop.status} variant={statusColors[sop.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{sop.owner || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sop.estimatedMinutes ? `${sop.estimatedMinutes} min` : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/sops/${sop.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(sop.id)} disabled={deletingId === sop.id}
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
