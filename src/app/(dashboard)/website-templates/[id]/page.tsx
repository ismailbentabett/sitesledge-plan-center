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
  nicheId: '',
  pagesIncluded: '[]',
  heroHeadline: '',
  sections: '[]',
  cta: '',
  seoKeywords: '[]',
  exampleUrl: '',
  status: 'draft',
  conversionNotes: '',
  notes: '',
}

export default function WebsiteTemplateDetailPage() {
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
    fetch(`/api/website-templates/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            name: data.name as string,
            nicheId: (data.nicheId as string) || '',
            pagesIncluded: data.pagesIncluded as string,
            heroHeadline: data.heroHeadline as string,
            sections: data.sections as string,
            cta: data.cta as string,
            seoKeywords: data.seoKeywords as string,
            exampleUrl: data.exampleUrl as string,
            status: data.status as string,
            conversionNotes: data.conversionNotes as string,
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
      const url = isNew ? '/api/website-templates' : `/api/website-templates/${itemId}`
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, nicheId: form.nicheId || null }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
      const saved = await res.json()
      if (isNew) router.push(`/website-templates/${saved.id}`)
      else setSuccess('Saved successfully')
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this template?')) return
    try {
      const res = await fetch(`/api/website-templates/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/website-templates')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Website Template' : form.name}
        description={isNew ? 'Add a new website template' : 'Edit website template'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={statusColors[form.status] || 'default'} />
              <button onClick={() => router.push('/website-templates')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
            </div>
          )
        }
      />

      {error && <div className="p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      {success && <div className="p-3 mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Niche ID</label>
              <input type="text" value={form.nicheId} onChange={(e) => update('nicheId', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Headline</label>
            <input type="text" value={form.heroHeadline} onChange={(e) => update('heroHeadline', e.target.value)}
              className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CTA</label>
              <input type="text" value={form.cta} onChange={(e) => update('cta', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Example URL</label>
              <input type="text" value={form.exampleUrl} onChange={(e) => update('exampleUrl', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
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
          <h3 className="text-sm font-semibold">Structure (JSON)</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Pages Included</label>
            <textarea value={form.pagesIncluded} onChange={(e) => update('pagesIncluded', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sections</label>
            <textarea value={form.sections} onChange={(e) => update('sections', e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Keywords</label>
            <textarea value={form.seoKeywords} onChange={(e) => update('seoKeywords', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs" />
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Notes</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Conversion Notes</label>
            <textarea value={form.conversionNotes} onChange={(e) => update('conversionNotes', e.target.value)} rows={2}
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
            {saving ? 'Saving...' : isNew ? 'Create Template' : 'Save Changes'}
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
