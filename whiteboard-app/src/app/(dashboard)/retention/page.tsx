'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface RetentionPlaybook {
  id: string
  name: string
  trigger: string
  timing: string
  status: string
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  archived: 'default',
}

export default function RetentionPage() {
  const router = useRouter()
  const [playbooks, setPlaybooks] = useState<RetentionPlaybook[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchPlaybooks() }, [])

  const fetchPlaybooks = async () => {
    try {
      const res = await fetch('/api/retention')
      if (res.ok) setPlaybooks(await res.json())
    } catch (error) {
      console.error('Failed to fetch playbooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this playbook?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/retention/${id}`, { method: 'DELETE' })
      if (res.ok) setPlaybooks(playbooks.filter((p) => p.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = playbooks
    .filter((p) => filterStatus === 'all' || p.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Retention Planner"
        description="Churn prevention and client retention playbooks"
        action={
          <button onClick={() => router.push('/retention/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Playbook
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No retention playbooks"
          description="Create playbooks to prevent client churn"
          action={{ label: 'Add Playbook', onClick: () => router.push('/retention/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trigger</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Timing</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((playbook) => (
                <tr key={playbook.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{playbook.name}</td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-xs">{playbook.trigger || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{playbook.timing || '-'}</td>
                  <td className="px-4 py-3"><StatusBadge label={playbook.status} variant={statusColors[playbook.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/retention/${playbook.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(playbook.id)} disabled={deletingId === playbook.id}
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
