'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const defaults = {
  name: '',
  targetNicheId: '',
  offerId: '',
  channel: '',
  status: 'draft',
  leadSource: '',
  messageVersion: '',
  callToAction: '',
  dailyVolume: 0,
  sentCount: 0,
  replyCount: 0,
  positiveReplyCount: 0,
  bookedCallCount: 0,
  closedWonCount: 0,
  notes: '',
}

export default function OutreachDetailPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params?.id as string
  const isNew = itemId === 'new'

  const [item, setItem] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState(defaults)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [niches, setNiches] = useState<{ id: string; name: string }[]>([])
  const [offers, setOffers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch('/api/niches').then((r) => r.ok ? r.json() : []).then(setNiches).catch(() => {})
    fetch('/api/offers').then((r) => r.ok ? r.json() : []).then(setOffers).catch(() => {})
    if (isNew) return
    fetch(`/api/outreach/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setItem(data)
          setForm({
            name: data.name as string,
            targetNicheId: (data.targetNicheId as string) || '',
            offerId: (data.offerId as string) || '',
            channel: data.channel as string,
            status: data.status as string,
            leadSource: data.leadSource as string,
            messageVersion: data.messageVersion as string,
            callToAction: data.callToAction as string,
            dailyVolume: data.dailyVolume as number,
            sentCount: data.sentCount as number,
            replyCount: data.replyCount as number,
            positiveReplyCount: data.positiveReplyCount as number,
            bookedCallCount: data.bookedCallCount as number,
            closedWonCount: data.closedWonCount as number,
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
      const url = isNew ? '/api/outreach' : `/api/outreach/${itemId}`
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
      if (isNew) router.push(`/outreach/${saved.id}`)
      else { setItem(saved); setSuccess('Saved successfully') }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this campaign?')) return
    try {
      const res = await fetch(`/api/outreach/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/outreach')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  const rates = {
    replyRate: form.sentCount > 0 ? Math.round((form.replyCount / form.sentCount) * 1000) / 10 : 0,
    positiveReplyRate: form.replyCount > 0 ? Math.round((form.positiveReplyCount / form.replyCount) * 1000) / 10 : 0,
    bookedCallRate: form.sentCount > 0 ? Math.round((form.bookedCallCount / form.sentCount) * 1000) / 10 : 0,
    closeRate: form.bookedCallCount > 0 ? Math.round((form.closedWonCount / form.bookedCallCount) * 1000) / 10 : 0,
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Campaign' : (item?.name as string)}
        description={isNew ? 'Add a new outreach campaign' : 'Track and update this campaign'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={
                form.status === 'active' ? 'success' : form.status === 'paused' ? 'warning' : form.status === 'completed' ? 'info' : 'default'
              } />
              <button onClick={() => router.push('/outreach')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Performance Rates</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground">Reply Rate</p><p className="text-xl font-bold">{rates.replyRate}%</p></div>
            <div><p className="text-xs text-muted-foreground">Positive Reply</p><p className="text-xl font-bold">{rates.positiveReplyRate}%</p></div>
            <div><p className="text-xs text-muted-foreground">Booked Call</p><p className="text-xl font-bold">{rates.bookedCallRate}%</p></div>
            <div><p className="text-xs text-muted-foreground">Close Rate</p><p className="text-xl font-bold">{rates.closeRate}%</p></div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Counters</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { key: 'sentCount', label: 'Sent' },
              { key: 'replyCount', label: 'Replies' },
              { key: 'positiveReplyCount', label: 'Positive' },
              { key: 'bookedCallCount', label: 'Booked Calls' },
              { key: 'closedWonCount', label: 'Closed Won' },
              { key: 'dailyVolume', label: 'Daily Volume' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">{f.label}</label>
                <input type="number" value={(form as Record<string, unknown>)[f.key] as number}
                  onChange={(e) => update(f.key, parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Details</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Niche</label>
              <select value={form.targetNicheId} onChange={(e) => update('targetNicheId', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">None</option>
                {niches.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offer</label>
              <select value={form.offerId} onChange={(e) => update('offerId', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">None</option>
                {offers.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Channel</label>
              <input type="text" value={form.channel} onChange={(e) => update('channel', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Lead Source</label>
              <input type="text" value={form.leadSource} onChange={(e) => update('leadSource', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message Version</label>
              <input type="text" value={form.messageVersion} onChange={(e) => update('messageVersion', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Call to Action</label>
            <input type="text" value={form.callToAction} onChange={(e) => update('callToAction', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : isNew ? 'Create Campaign' : 'Save Changes'}
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
