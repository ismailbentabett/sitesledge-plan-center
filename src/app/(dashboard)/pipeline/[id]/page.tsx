'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const defaults = {
  businessName: '',
  ownerName: '',
  nicheId: '',
  phone: '',
  email: '',
  website: '',
  googleRating: null as number | null,
  reviewCount: null as number | null,
  currentWebsiteQualityScore: 0,
  painPoint: '',
  offerAngle: '',
  status: 'new',
  lastContactedAt: '',
  nextFollowUpAt: '',
  expectedMonthlyValue: 0,
  closeProbability: 0,
  notes: '',
}

export default function ProspectDetailPage() {
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

  useEffect(() => {
    fetch('/api/niches').then((r) => r.ok ? r.json() : []).then(setNiches).catch(() => {})
    if (isNew) return
    fetch(`/api/pipeline/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setItem(data)
          setForm({
            businessName: data.businessName as string,
            ownerName: (data.ownerName as string) || '',
            nicheId: (data.nicheId as string) || '',
            phone: (data.phone as string) || '',
            email: (data.email as string) || '',
            website: (data.website as string) || '',
            googleRating: data.googleRating as number | null,
            reviewCount: data.reviewCount as number | null,
            currentWebsiteQualityScore: data.currentWebsiteQualityScore as number,
            painPoint: (data.painPoint as string) || '',
            offerAngle: (data.offerAngle as string) || '',
            status: data.status as string,
            lastContactedAt: (data.lastContactedAt as string) ? new Date(data.lastContactedAt as string).toISOString().slice(0, 16) : '',
            nextFollowUpAt: (data.nextFollowUpAt as string) ? new Date(data.nextFollowUpAt as string).toISOString().slice(0, 16) : '',
            expectedMonthlyValue: data.expectedMonthlyValue as number,
            closeProbability: data.closeProbability as number,
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
      const url = isNew ? '/api/pipeline' : `/api/pipeline/${itemId}`
      const payload = {
        ...form,
        lastContactedAt: form.lastContactedAt ? new Date(form.lastContactedAt).toISOString() : null,
        nextFollowUpAt: form.nextFollowUpAt ? new Date(form.nextFollowUpAt).toISOString() : null,
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
      if (isNew) router.push(`/pipeline/${saved.id}`)
      else { setItem(saved); setSuccess('Saved successfully') }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this prospect?')) return
    try {
      const res = await fetch(`/api/pipeline/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/pipeline')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Prospect' : (item?.businessName as string)}
        description={isNew ? 'Add a new prospect to your pipeline' : 'Update prospect details'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={
                form.status === 'won' ? 'success' : form.status === 'lost' ? 'danger' : form.status === 'interested' ? 'warning' : form.status === 'proposal_sent' ? 'warning' : form.status === 'contacted' ? 'default' : 'info'
              } />
              <button onClick={() => router.push('/pipeline')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Business Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input type="text" value={form.businessName} onChange={(e) => update('businessName', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Owner Name</label>
              <input type="text" value={form.ownerName} onChange={(e) => update('ownerName', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input type="text" value={form.website} onChange={(e) => update('website', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Research</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Google Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={form.googleRating ?? ''} onChange={(e) => update('googleRating', e.target.value ? parseFloat(e.target.value) : null)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Review Count</label>
              <input type="number" value={form.reviewCount ?? ''} onChange={(e) => update('reviewCount', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website Quality (0-10)</label>
              <input type="number" min="0" max="10" value={form.currentWebsiteQualityScore} onChange={(e) => update('currentWebsiteQualityScore', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pain Point</label>
              <textarea value={form.painPoint} onChange={(e) => update('painPoint', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Offer Angle</label>
              <textarea value={form.offerAngle} onChange={(e) => update('offerAngle', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Deal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expected MRR ($)</label>
              <input type="number" value={form.expectedMonthlyValue} onChange={(e) => update('expectedMonthlyValue', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Close Probability (0-1)</label>
              <input type="number" step="0.01" min="0" max="1" value={form.closeProbability} onChange={(e) => update('closeProbability', parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Niche</label>
              <select value={form.nicheId} onChange={(e) => update('nicheId', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">None</option>
                {niches.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Contacted</label>
              <input type="datetime-local" value={form.lastContactedAt} onChange={(e) => update('lastContactedAt', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Next Follow-up</label>
              <input type="datetime-local" value={form.nextFollowUpAt} onChange={(e) => update('nextFollowUpAt', e.target.value)}
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
            {saving ? 'Saving...' : isNew ? 'Create Prospect' : 'Save Changes'}
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
