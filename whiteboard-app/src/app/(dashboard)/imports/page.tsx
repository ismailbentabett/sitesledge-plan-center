'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface ImportBatch {
  id: string
  name: string
  source: string
  recordCount: number
  status: string
  fileName: string
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  pending: 'default',
  processing: 'info',
  completed: 'success',
  failed: 'danger',
}

export default function ImportsPage() {
  const router = useRouter()
  const [batches, setBatches] = useState<ImportBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchBatches() }, [])

  const fetchBatches = async () => {
    try {
      const res = await fetch('/api/imports')
      if (res.ok) setBatches(await res.json())
    } catch (error) {
      console.error('Failed to fetch imports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this import batch?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/imports/${id}`, { method: 'DELETE' })
      if (res.ok) setBatches(batches.filter((b) => b.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = batches
    .filter((b) => filterStatus === 'all' || b.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Data Imports"
        description="Track CSV imports and data batches"
        action={
          <button onClick={() => router.push('/imports/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Import
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No imports yet"
          description="Track your data import batches here"
          action={{ label: 'New Import', onClick: () => router.push('/imports/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Records</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">File</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((batch) => (
                <tr key={batch.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{batch.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{batch.source || '-'}</td>
                  <td className="px-4 py-3">{batch.recordCount}</td>
                  <td className="px-4 py-3"><StatusBadge label={batch.status} variant={statusColors[batch.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">{batch.fileName || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/imports/${batch.id}`)}
                        className="text-xs text-primary hover:text-primary/80">View</button>
                      <button onClick={() => handleDelete(batch.id)} disabled={deletingId === batch.id}
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
