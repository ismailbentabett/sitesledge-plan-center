'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const defaults = {
  name: '',
  hypothesis: '',
  area: 'outreach',
  targetNicheId: '',
  offerId: '',
  outreachCampaignId: '',
  startDate: '',
  endDate: '',
  metricToImprove: '',
  baseline: '',
  result: '',
  decision: 'inconclusive',
  status: 'planned',
  notes: '',
}

export default function ExperimentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  const isNew = itemId === 'new'

  const [item, setItem] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState(defaults)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [niches, setNiches] = useState<{ id: string; name: string }[]>([])
  const [offers, setOffers] = useState<{ id: string; name: string }[]>([])
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch('/api/niches').then((r) => r.ok ? r.json() : []).then(setNiches).catch(() => {})
    fetch('/api/offers').then((r) => r.ok ? r.json() : []).then(setOffers).catch(() => {})
    fetch('/api/outreach').then((r) => r.ok ? r.json() : []).then((data) => setCampaigns(data.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })))).catch(() => {})
    if (isNew) return
    fetch(`/api/experiments/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setItem(data)
          setForm({
            name: data.name as string,
            hypothesis: (data.hypothesis as string) || '',
            area: data.area as string,
            targetNicheId: (data.targetNicheId as string) || '',
            offerId: (data.offerId as string) || '',
            outreachCampaignId: (data.outreachCampaignId as string) || '',
            startDate: (data.startDate as string) ? new Date(data.startDate as string).toISOString().slice(0, 16) : '',
            endDate: (data.endDate as string) ? new Date(data.endDate as string).toISOString().slice(0, 16) : '',
            metricToImprove: (data.metricToImprove as string) || '',
            baseline: (data.baseline as string) || '',
            result: (data.result as string) || '',
            decision: data.decision as string,
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
      const url = isNew ? '/api/experiments' : `/api/experiments/${itemId}`
      const payload = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
      const saved = await res.json()
      if (isNew) router.push(`/experiments/${saved.id}`)
      else { setItem(saved); setSuccess('Saved successfully') }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this experiment?')) return
    try {
      const res = await fetch(`/api/experiments/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/experiments')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Experiment' : (item?.name as string)}
        description={isNew ? 'Add a new experiment' : 'Update this experiment'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={
                form.status === 'running' ? 'warning' : form.status === 'completed' ? 'success' : form.status === 'archived' ? 'default' : 'info'
              } />
              <button onClick={() => router.push('/experiments')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Experiment</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <select value={form.area} onChange={(e) => update('area', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="outreach">Outreach</option>
                <option value="offer">Offer</option>
                <option value="pricing">Pricing</option>
                <option value="channel">Channel</option>
                <option value="funnel">Funnel</option>
                <option value="ad_creative">Ad Creative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="planned">Planned</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hypothesis</label>
            <textarea value={form.hypothesis} onChange={(e) => update('hypothesis', e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Links</h3>
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
              <label className="block text-sm font-medium mb-1">Campaign</label>
              <select value={form.outreachCampaignId} onChange={(e) => update('outreachCampaignId', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">None</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Metrics & Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="datetime-local" value={form.startDate} onChange={(e) => update('startDate', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={(e) => update('endDate', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Metric to Improve</label>
            <input type="text" value={form.metricToImprove} onChange={(e) => update('metricToImprove', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Baseline</label>
            <textarea value={form.baseline} onChange={(e) => update('baseline', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Result</label>
            <textarea value={form.result} onChange={(e) => update('result', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Decision</label>
            <select value={form.decision} onChange={(e) => update('decision', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="scale">Scale</option>
              <option value="keep">Keep</option>
              <option value="kill">Kill</option>
              <option value="inconclusive">Inconclusive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : isNew ? 'Create Experiment' : 'Save Changes'}
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
