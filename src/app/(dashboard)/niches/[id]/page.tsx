'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const scoreFields = [
  { key: 'repeatPurchasePotentialScore', label: 'Repeat Purchase Potential' },
  { key: 'callVolumeScore', label: 'Call Volume' },
  { key: 'reviewImportanceScore', label: 'Review Importance' },
  { key: 'websiteQualityGapScore', label: 'Website Quality Gap' },
  { key: 'competitionLevelScore', label: 'Competition Level' },
  { key: 'ownerSophisticationScore', label: 'Owner Sophistication' },
  { key: 'urgencyScore', label: 'Urgency' },
  { key: 'easeOfFindingLeadsScore', label: 'Ease of Finding Leads' },
  { key: 'easeOfFulfillmentScore', label: 'Ease of Fulfillment' },
  { key: 'retentionPotentialScore', label: 'Retention Potential' },
  { key: 'affordabilityScore', label: 'Affordability' },
]

const defaults = {
  name: '',
  description: '',
  averageTicketValue: null as number | null,
  repeatPurchasePotentialScore: 3,
  callVolumeScore: 3,
  reviewImportanceScore: 3,
  websiteQualityGapScore: 3,
  competitionLevelScore: 3,
  ownerSophisticationScore: 3,
  urgencyScore: 3,
  easeOfFindingLeadsScore: 3,
  easeOfFulfillmentScore: 3,
  retentionPotentialScore: 3,
  affordabilityScore: 3,
  offerAngle: '',
  outreachAngle: '',
  objections: '',
  notes: '',
  status: 'researching',
}

export default function NicheDetailPage() {
  const router = useRouter()
  const params = useParams()
  const nicheId = params?.id as string
  const isNew = nicheId === 'new'

  const [niche, setNiche] = useState<Record<string, unknown> | null>(null)
  const [form, setForm] = useState(defaults)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (isNew) return
    fetch(`/api/niches/${nicheId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setNiche(data)
          setForm({
            name: data.name as string,
            description: data.description as string,
            averageTicketValue: data.averageTicketValue as number | null,
            repeatPurchasePotentialScore: data.repeatPurchasePotentialScore as number,
            callVolumeScore: data.callVolumeScore as number,
            reviewImportanceScore: data.reviewImportanceScore as number,
            websiteQualityGapScore: data.websiteQualityGapScore as number,
            competitionLevelScore: data.competitionLevelScore as number,
            ownerSophisticationScore: data.ownerSophisticationScore as number,
            urgencyScore: data.urgencyScore as number,
            easeOfFindingLeadsScore: data.easeOfFindingLeadsScore as number,
            easeOfFulfillmentScore: data.easeOfFulfillmentScore as number,
            retentionPotentialScore: data.retentionPotentialScore as number,
            affordabilityScore: data.affordabilityScore as number,
            offerAngle: data.offerAngle as string,
            outreachAngle: data.outreachAngle as string,
            objections: data.objections as string,
            notes: data.notes as string,
            status: data.status as string,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [nicheId, isNew])

  const calcScore = () => {
    const vals = scoreFields.map((f) => form[f.key as keyof typeof form] as number)
    const total = vals.reduce((a, b) => a + b, 0)
    return Math.round((total / vals.length) * 10) / 10
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const method = isNew ? 'POST' : 'PATCH'
      const url = isNew ? '/api/niches' : `/api/niches/${nicheId}`
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
        router.push(`/niches/${saved.id}`)
      } else {
        setNiche(saved)
        setSuccess('Saved successfully')
      }
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this niche?')) return
    try {
      const res = await fetch(`/api/niches/${nicheId}`, { method: 'DELETE' })
      if (res.ok) router.push('/niches')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  const score = calcScore()
  const scoreColor = score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Niche' : niche?.name as string}
        description={isNew ? 'Add a new niche to evaluate' : 'Evaluate and score this niche'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={
                form.status === 'active' ? 'success' : form.status === 'testing' ? 'warning' : form.status === 'rejected' ? 'danger' : form.status === 'paused' ? 'default' : 'info'
              } />
              <button onClick={() => router.push('/niches')}
                className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Opportunity Score</h3>
            <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scoreFields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium mb-1 text-muted-foreground">{field.label}</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button key={v} type="button" onClick={() => update(field.key, v)}
                      className={`flex-1 h-8 text-xs rounded-md border transition-colors ${
                        (form[field.key as keyof typeof form] as number) === v
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-accent'
                      }`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Plumbers" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Avg Ticket Value ($)</label>
              <input type="number" value={form.averageTicketValue ?? ''} onChange={(e) => update('averageTicketValue', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="researching">Researching</option>
              <option value="testing">Testing</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Angles</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Offer Angle</label>
            <textarea value={form.offerAngle} onChange={(e) => update('offerAngle', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Outreach Angle</label>
            <textarea value={form.outreachAngle} onChange={(e) => update('outreachAngle', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Objections</label>
            <textarea value={form.objections} onChange={(e) => update('objections', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
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
            {saving ? 'Saving...' : isNew ? 'Create Niche' : 'Save Changes'}
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
