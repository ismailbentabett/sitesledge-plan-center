'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const defaults = {
  name: '',
  targetNicheId: '',
  offerId: '',
  trafficSource: '',
  landingPageUrl: '',
  calendarUrl: '',
  followUpSequence: '',
  conversionRate: 0,
  costPerBookedCall: 0,
  closeRate: 0,
  status: 'draft',
  notes: '',
}

export default function FunnelDetailPage() {
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
    fetch(`/api/funnels/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setItem(data)
          setForm({
            name: data.name as string,
            targetNicheId: (data.targetNicheId as string) || '',
            offerId: (data.offerId as string) || '',
            trafficSource: (data.trafficSource as string) || '',
            landingPageUrl: (data.landingPageUrl as string) || '',
            calendarUrl: (data.calendarUrl as string) || '',
            followUpSequence: data.followUpSequence as string,
            conversionRate: data.conversionRate as number,
            costPerBookedCall: data.costPerBookedCall as number,
            closeRate: data.closeRate as number,
            status: data.status as string,
            notes: (data.notes as string) || '',
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
      const url = isNew ? '/api/funnels' : `/api/funnels/${itemId}`
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
      if (isNew) router.push(`/funnels/${saved.id}`)
      else { setItem(saved); setSuccess('Saved successfully') }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this funnel?')) return
    try {
      const res = await fetch(`/api/funnels/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/funnels')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Funnel' : (item?.name as string)}
        description={isNew ? 'Add a new funnel' : 'Update this funnel'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={
                form.status === 'active' ? 'success' : form.status === 'testing' ? 'warning' : form.status === 'retired' ? 'info' : 'default'
              } />
              <button onClick={() => router.push('/funnels')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Funnel Setup</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-1">Traffic Source</label>
              <input type="text" value={form.trafficSource} onChange={(e) => update('trafficSource', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Landing Page URL</label>
              <input type="text" value={form.landingPageUrl} onChange={(e) => update('landingPageUrl', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Calendar URL</label>
              <input type="text" value={form.calendarUrl} onChange={(e) => update('calendarUrl', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="draft">Draft</option>
              <option value="testing">Testing</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Conversion Rate (0-1)</label>
              <input type="number" step="0.01" min="0" max="1" value={form.conversionRate} onChange={(e) => update('conversionRate', parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost per Booked Call ($)</label>
              <input type="number" value={form.costPerBookedCall} onChange={(e) => update('costPerBookedCall', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Close Rate (0-1)</label>
              <input type="number" step="0.01" min="0" max="1" value={form.closeRate} onChange={(e) => update('closeRate', parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Follow-up Sequence (JSON)</h3>
          <textarea value={form.followUpSequence} onChange={(e) => update('followUpSequence', e.target.value)} rows={6}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            placeholder='[{"step": 1, "delay": "1d", "type": "email", "content": "..."}]' />
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : isNew ? 'Create Funnel' : 'Save Changes'}
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
