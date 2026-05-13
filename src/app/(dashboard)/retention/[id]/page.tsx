'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const statusOptions = ['draft', 'active', 'archived']

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default', active: 'success', archived: 'default',
}

const defaults = {
  name: '',
  trigger: '',
  timing: '',
  message: '',
  actionSteps: '[]',
  status: 'draft',
  notes: '',
}

export default function RetentionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params?.id as string
  const isNew = itemId === 'new'

  const [form, setForm] = useState(defaults)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isNew) return
    fetch(`/api/retention/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            name: data.name as string,
            trigger: data.trigger as string,
            timing: data.timing as string,
            message: data.message as string,
            actionSteps: data.actionSteps as string,
            status: data.status as string,
            notes: data.notes as string,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [itemId, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const method = isNew ? 'POST' : 'PATCH'
      const url = isNew ? '/api/retention' : `/api/retention/${itemId}`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
      const saved = await res.json()
      if (isNew) router.push(`/retention/${saved.id}`)
      else setSuccess('Saved successfully')
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this playbook?')) return
    try {
      const res = await fetch(`/api/retention/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/retention')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Retention Playbook' : form.name}
        description={isNew ? 'Add a new retention playbook' : 'Edit retention playbook'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={statusColors[form.status] || 'default'} />
              <button onClick={() => router.push('/retention')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Details</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Trigger</label>
              <input type="text" value={form.trigger} onChange={(e) => update('trigger', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Client misses payment" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timing</label>
              <input type="text" value={form.timing} onChange={(e) => update('timing', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Within 24 hours" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Action Steps (JSON)</label>
            <textarea value={form.actionSteps} onChange={(e) => update('actionSteps', e.target.value)} rows={4}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              {statusOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Notes</h3>
          <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : isNew ? 'Create Playbook' : 'Save Changes'}
          </button>
          {!isNew && (
            <button type="button" onClick={handleDelete}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors">
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
