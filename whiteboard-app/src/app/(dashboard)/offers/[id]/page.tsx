'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const defaults = {
  name: '',
  targetNicheId: null as string | null,
  status: 'draft',
  priceMonthly: 197,
  setupFee: null as number | null,
  mainPromise: '',
  mechanism: '',
  includedAssets: '',
  bonuses: '',
  guarantee: '',
  riskReversal: '',
  urgencyAngle: '',
  scarcityAngle: '',
  primaryObjection: '',
  objectionResponse: '',
  coldEmailVersion: '',
  coldCallVersion: '',
  landingPageHeadline: '',
  metaAdAngle: '',
  notes: '',
}

export default function OfferDetailPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string
  const isNew = offerId === 'new'

  const [offer, setOffer] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState(defaults)
  const [niches, setNiches] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetch('/api/niches')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setNiches(data))
      .catch(() => {})

    if (isNew) {
      setLoading(false)
      return
    }

    fetch(`/api/offers/${offerId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setOffer(data)
          setForm({
            name: data.name as string,
            targetNicheId: data.targetNicheId as string | null,
            status: data.status as string,
            priceMonthly: data.priceMonthly as number,
            setupFee: data.setupFee as number | null,
            mainPromise: data.mainPromise as string,
            mechanism: data.mechanism as string,
            includedAssets: data.includedAssets as string,
            bonuses: data.bonuses as string,
            guarantee: data.guarantee as string,
            riskReversal: data.riskReversal as string,
            urgencyAngle: data.urgencyAngle as string,
            scarcityAngle: data.scarcityAngle as string,
            primaryObjection: data.primaryObjection as string,
            objectionResponse: data.objectionResponse as string,
            coldEmailVersion: data.coldEmailVersion as string,
            coldCallVersion: data.coldCallVersion as string,
            landingPageHeadline: data.landingPageHeadline as string,
            metaAdAngle: data.metaAdAngle as string,
            notes: data.notes as string,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [offerId, isNew])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PATCH'
      const url = isNew ? '/api/offers' : `/api/offers/${offerId}`
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
      if (isNew) {
        router.push(`/offers/${saved.id}`)
      } else {
        setOffer(saved)
        setSuccess('Saved successfully')
      }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this offer?')) return
    try {
      const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' })
      if (res.ok) router.push('/offers')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Offer' : (offer?.name as string)}
        description={isNew ? 'Create a new offer' : 'Edit offer positioning and pricing'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={
                form.status === 'active' ? 'success' : form.status === 'testing' ? 'warning' : form.status === 'retired' ? 'danger' : 'default'
              } />
              <button onClick={() => router.push('/offers')}
                className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Core</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Foundation Package" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Price ($)</label>
              <input type="number" value={form.priceMonthly} onChange={(e) => update('priceMonthly', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Setup Fee ($)</label>
              <input type="number" value={form.setupFee ?? ''} onChange={(e) => update('setupFee', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Niche</label>
              <select value={form.targetNicheId ?? ''} onChange={(e) => update('targetNicheId', e.target.value || null)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">None</option>
                {niches.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
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
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Positioning</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Main Promise</label>
            <textarea value={form.mainPromise} onChange={(e) => update('mainPromise', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mechanism</label>
            <textarea value={form.mechanism} onChange={(e) => update('mechanism', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Included Assets</label>
            <textarea value={form.includedAssets} onChange={(e) => update('includedAssets', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bonuses</label>
            <textarea value={form.bonuses} onChange={(e) => update('bonuses', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Risk &amp; Urgency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Guarantee</label>
              <textarea value={form.guarantee} onChange={(e) => update('guarantee', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Risk Reversal</label>
              <textarea value={form.riskReversal} onChange={(e) => update('riskReversal', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Urgency Angle</label>
              <textarea value={form.urgencyAngle} onChange={(e) => update('urgencyAngle', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scarcity Angle</label>
              <textarea value={form.scarcityAngle} onChange={(e) => update('scarcityAngle', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Objections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Objection</label>
              <textarea value={form.primaryObjection} onChange={(e) => update('primaryObjection', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Objection Response</label>
              <textarea value={form.objectionResponse} onChange={(e) => update('objectionResponse', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Channel Versions</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Cold Email Version</label>
            <textarea value={form.coldEmailVersion} onChange={(e) => update('coldEmailVersion', e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cold Call Version</label>
            <textarea value={form.coldCallVersion} onChange={(e) => update('coldCallVersion', e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Landing Page Headline</label>
              <input type="text" value={form.landingPageHeadline} onChange={(e) => update('landingPageHeadline', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Ad Angle</label>
              <input type="text" value={form.metaAdAngle} onChange={(e) => update('metaAdAngle', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
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
            {saving ? 'Saving...' : isNew ? 'Create Offer' : 'Save Changes'}
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
