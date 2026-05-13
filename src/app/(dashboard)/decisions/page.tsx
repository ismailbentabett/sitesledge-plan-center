'use client'

import { useState, useEffect, useCallback } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import DataTable, { Column } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

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
  const { toasts, dismissToast, success, error } = useToast()
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaults)
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<Decision | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchDecisions = useCallback(async () => {
    try {
      const res = await fetch('/api/decisions')
      if (res.ok) setDecisions(await res.json())
    } catch {
      error('Failed to load decisions')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchDecisions() }, [fetchDecisions])

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
        success('Decision logged')
      }
    } catch {
      error('Failed to create decision')
    }
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
        setDecisions(decisions.map((d) => (d.id === id ? updated : d)))
      }
    } catch {
      error('Failed to update status')
    }
  }

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/decisions/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setDecisions((prev) => prev.filter((d) => d.id !== deleteTarget.id))
        success('Decision deleted')
      } else {
        error('Failed to delete decision')
      }
    } catch {
      error('Failed to delete decision')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = decisions.filter((d) => filterStatus === 'all' || d.status === filterStatus)

  const columns: Column<Decision>[] = [
    { key: 'title', label: 'Decision', sortable: true, render: (d) => <span className="font-medium">{d.title}</span> },
    { key: 'status', label: 'Status', render: (d) => <StatusBadge label={d.status} variant={statusColors[d.status] || 'default'} /> },
    { key: 'chosenOption', label: 'Chosen', render: (d) => <span className="text-muted-foreground truncate block max-w-xs">{d.chosenOption || '-'}</span> },
    { key: 'createdAt', label: 'Created', sortable: true, render: (d) => <span className="text-xs text-muted-foreground">{formatRelativeDate(d.createdAt)}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Decision Log"
        description="Track important business decisions"
        action={
          <Button onClick={() => document.getElementById('new-decision-title')?.focus()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Log Decision
          </Button>
        }
        loading={loading && decisions.length === 0}
      >
        {/* New Decision Form */}
        <div className="p-4 border rounded-xl bg-card space-y-3">
          <h3 className="text-sm font-semibold">New Decision</h3>
          <input
            id="new-decision-title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Decision title..."
            className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
          />
          <textarea
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
            placeholder="Context..."
            rows={2}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea
              value={form.optionsConsidered}
              onChange={(e) => setForm({ ...form, optionsConsidered: e.target.value })}
              placeholder="Options considered..."
              rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              value={form.chosenOption}
              onChange={(e) => setForm({ ...form, chosenOption: e.target.value })}
              placeholder="Chosen option..."
              rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            placeholder="Reasoning..."
            rows={2}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={handleCreate} disabled={!form.title.trim()}>Log Decision</Button>
        </div>

        <div className="flex gap-3">
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="decided">Decided</option>
            <option value="reviewing">Reviewing</option>
            <option value="validated">Validated</option>
            <option value="reversed">Reversed</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          idKey="id"
          loading={loading}
          emptyMessage="No decisions match your filters"
          actions={(decision) => [
            { label: 'View Details', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, onClick: () => {} },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(decision), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Decision"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
