'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Decision {
  id: string
  title: string
  context: string
  optionsConsidered: string
  chosenOption: string
  reason: string
  expectedResult: string
  outcome: string
  status: string
  reviewDate: string | null
  createdAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  open: 'info',
  decided: 'default',
  reviewing: 'warning',
  validated: 'success',
  reversed: 'danger',
}

const defaults = {
  title: '',
  context: '',
  optionsConsidered: '',
  chosenOption: '',
  reason: '',
  expectedResult: '',
  outcome: '',
  status: 'open',
  reviewDate: null as string | null,
}

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaults)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { fetchDecisions() }, [])

  const fetchDecisions = async () => {
    try {
      const res = await fetch('/api/decisions')
      if (res.ok) setDecisions(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleCreate = async () => {
    if (!form.title.trim()) return
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const saved = await res.json()
        setDecisions([saved, ...decisions])
        setForm(defaults)
      }
    } catch { /* ignore */ }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/decisions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setDecisions(decisions.map((d) => d.id === id ? updated : d))
      }
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this decision?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/decisions/${id}`, { method: 'DELETE' })
      if (res.ok) setDecisions(decisions.filter((d) => d.id !== id))
    } catch { /* ignore */ } finally { setDeletingId(null) }
  }

  const filtered = decisions.filter((d) => filterStatus === 'all' || d.status === filterStatus)

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader title="Decision Log" description="Track important business decisions" />

      <div className="p-4 border rounded-xl bg-card space-y-3 mb-6">
        <h3 className="text-sm font-semibold">New Decision</h3>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Decision title..."
          className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium" />
        <textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })} placeholder="Context..." rows={2}
          className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea value={form.optionsConsidered} onChange={(e) => setForm({ ...form, optionsConsidered: e.target.value })} placeholder="Options considered..." rows={2}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          <textarea value={form.chosenOption} onChange={(e) => setForm({ ...form, chosenOption: e.target.value })} placeholder="Chosen option..." rows={2}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reasoning..." rows={2}
          className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        <button onClick={handleCreate} disabled={!form.title.trim()}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
          Log Decision
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="decided">Decided</option>
          <option value="reviewing">Reviewing</option>
          <option value="validated">Validated</option>
          <option value="reversed">Reversed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No decisions yet" description="Log your first business decision above" />
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="p-4 border rounded-xl bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">{d.title}</h4>
                  <StatusBadge label={d.status} variant={statusColors[d.status] || 'default'} />
                </div>
                <div className="flex items-center gap-2">
                  <select value={d.status} onChange={(e) => handleStatusChange(d.id, e.target.value)}
                    className="h-7 px-2 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="open">Open</option>
                    <option value="decided">Decided</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="validated">Validated</option>
                    <option value="reversed">Reversed</option>
                  </select>
                  <button onClick={() => handleDelete(d.id)} disabled={deletingId === d.id}
                    className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                </div>
              </div>
              {d.context && <p className="text-sm text-muted-foreground">{d.context}</p>}
              {d.chosenOption && <p className="text-sm mt-1"><span className="text-muted-foreground">Chosen:</span> {d.chosenOption}</p>}
              {d.reason && <p className="text-sm mt-1"><span className="text-muted-foreground">Reason:</span> {d.reason}</p>}
              <p className="text-xs text-muted-foreground mt-2">{new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
