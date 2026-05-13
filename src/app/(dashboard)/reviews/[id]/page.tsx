'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'

const defaults = {
  clientId: '',
  currentGoogleRating: 0,
  currentReviewCount: 0,
  targetReviewCount: 0,
  reviewRequestAutomationStatus: '',
  reviewRequestMessage: '',
  reviewLink: '',
  newReviewsThisMonth: 0,
  negativeReviews: '[]',
  responseNeeded: false,
  notes: '',
}

export default function ReviewDetailPage() {
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
    fetch(`/api/reviews/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            clientId: data.clientId as string,
            currentGoogleRating: data.currentGoogleRating as number,
            currentReviewCount: data.currentReviewCount as number,
            targetReviewCount: data.targetReviewCount as number,
            reviewRequestAutomationStatus: data.reviewRequestAutomationStatus as string,
            reviewRequestMessage: data.reviewRequestMessage as string,
            reviewLink: data.reviewLink as string,
            newReviewsThisMonth: data.newReviewsThisMonth as number,
            negativeReviews: data.negativeReviews as string,
            responseNeeded: data.responseNeeded as boolean,
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
      const url = isNew ? '/api/reviews' : `/api/reviews/${itemId}`
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
      if (isNew) router.push(`/reviews/${saved.id}`)
      else setSuccess('Saved successfully')
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this tracker?')) return
    try {
      const res = await fetch(`/api/reviews/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/reviews')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Review Tracker' : `Client: ${form.clientId}`}
        description={isNew ? 'Add a new review tracker' : 'Edit review tracker'}
        action={
          !isNew && (
            <button onClick={() => router.push('/reviews')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Client & Ratings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client ID</label>
              <input type="text" value={form.clientId} onChange={(e) => update('clientId', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Google Rating</label>
              <input type="number" step="0.1" min="0" max="5" value={form.currentGoogleRating} onChange={(e) => update('currentGoogleRating', parseFloat(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Reviews</label>
              <input type="number" value={form.currentReviewCount} onChange={(e) => update('currentReviewCount', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Reviews</label>
              <input type="number" value={form.targetReviewCount} onChange={(e) => update('targetReviewCount', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New This Month</label>
              <input type="number" value={form.newReviewsThisMonth} onChange={(e) => update('newReviewsThisMonth', parseInt(e.target.value) || 0)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Review Request</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Automation Status</label>
            <input type="text" value={form.reviewRequestAutomationStatus} onChange={(e) => update('reviewRequestAutomationStatus', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Review Request Message</label>
            <textarea value={form.reviewRequestMessage} onChange={(e) => update('reviewRequestMessage', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Review Link</label>
            <input type="text" value={form.reviewLink} onChange={(e) => update('reviewLink', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Management</h3>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.responseNeeded} onChange={(e) => update('responseNeeded', e.target.checked)}
                className="rounded border-gray-300" />
              <span className="text-sm font-medium">Response Needed</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Negative Reviews (JSON)</label>
            <textarea value={form.negativeReviews} onChange={(e) => update('negativeReviews', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs" />
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
            {saving ? 'Saving...' : isNew ? 'Create Tracker' : 'Save Changes'}
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
