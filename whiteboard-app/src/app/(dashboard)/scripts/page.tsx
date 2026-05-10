'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Script {
  id: string
  title: string
  type: string
  channel: string
  status: string
  createdAt: string
}

const typeLabels: Record<string, string> = {
  cold_email: 'Cold Email',
  cold_call: 'Cold Call',
  voicemail: 'Voicemail',
  follow_up: 'Follow-up',
  linkedin_message: 'LinkedIn',
  sms: 'SMS',
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  active: 'success',
  archived: 'info',
}

export default function ScriptsPage() {
  const router = useRouter()
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchScripts() }, [])

  const fetchScripts = async () => {
    try {
      const res = await fetch('/api/scripts')
      if (res.ok) setScripts(await res.json())
    } catch (error) {
      console.error('Failed to fetch scripts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this script?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/scripts/${id}`, { method: 'DELETE' })
      if (res.ok) setScripts(scripts.filter((s) => s.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = scripts.filter((s) =>
    (filterType === 'all' || s.type === filterType) &&
    (filterStatus === 'all' || s.status === filterStatus)
  )

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Script Library"
        description="Manage outreach scripts and templates"
        action={
          <button onClick={() => router.push('/scripts/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Script
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Types</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
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
          title="No scripts yet"
          description="Add your first outreach script"
          action={{ label: 'Add Script', onClick: () => router.push('/scripts/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Channel</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{typeLabels[s.type] || s.type}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{s.channel}</td>
                  <td className="px-4 py-3"><StatusBadge label={s.status} variant={statusColors[s.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/scripts/${s.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}
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
