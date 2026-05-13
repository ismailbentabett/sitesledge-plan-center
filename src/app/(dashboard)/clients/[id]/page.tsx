'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import StatusBadge from '@/components/ui/StatusBadge'

const statusOptions = ['prospect', 'active', 'churned', 'paused']
const churnRiskOptions = ['low', 'medium', 'high']

const defaults = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  businessType: '',
  status: 'prospect',
  monthlyPrice: 0,
  startDate: '',
  renewalDate: '',
  churnDate: '',
  packageName: '',
  websiteUrl: '',
  ghlSubaccountUrl: '',
  googleBusinessProfileUrl: '',
  accessNotes: '',
  churnRisk: 'low',
  notes: '',
  nicheId: '',
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  prospect: 'default', active: 'success', churned: 'danger', paused: 'warning',
}

export default function ClientDetailPage() {
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
    fetch(`/api/clients/${itemId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            businessName: data.businessName as string,
            contactName: data.contactName as string,
            email: data.email as string,
            phone: data.phone as string,
            businessType: data.businessType as string,
            status: data.status as string,
            monthlyPrice: data.monthlyPrice as number,
            startDate: data.startDate ? new Date(data.startDate as string).toISOString().split('T')[0] : '',
            renewalDate: data.renewalDate ? new Date(data.renewalDate as string).toISOString().split('T')[0] : '',
            churnDate: data.churnDate ? new Date(data.churnDate as string).toISOString().split('T')[0] : '',
            packageName: data.packageName as string,
            websiteUrl: data.websiteUrl as string,
            ghlSubaccountUrl: data.ghlSubaccountUrl as string,
            googleBusinessProfileUrl: data.googleBusinessProfileUrl as string,
            accessNotes: data.accessNotes as string,
            churnRisk: data.churnRisk as string,
            notes: data.notes as string,
            nicheId: data.nicheId as string,
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
      const url = isNew ? '/api/clients' : `/api/clients/${itemId}`
      const body: Record<string, unknown> = { ...form, monthlyPrice: Number(form.monthlyPrice) }
      if (form.startDate) body.startDate = new Date(form.startDate).toISOString()
      else body.startDate = null
      if (form.renewalDate) body.renewalDate = new Date(form.renewalDate).toISOString()
      else body.renewalDate = null
      if (form.churnDate) body.churnDate = new Date(form.churnDate).toISOString()
      else body.churnDate = null
      if (!body.nicheId) body.nicheId = null

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
      const saved = await res.json()
      if (isNew) router.push(`/clients/${saved.id}`)
      else setSuccess('Saved successfully')
    } catch {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this client?')) return
    try {
      const res = await fetch(`/api/clients/${itemId}`, { method: 'DELETE' })
      if (res.ok) router.push('/clients')
    } catch {
      alert('Failed to delete')
    }
  }

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }))

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title={isNew ? 'New Client' : form.businessName}
        description={isNew ? 'Add a new client' : 'Edit client details'}
        action={
          !isNew && (
            <div className="flex items-center gap-3">
              <StatusBadge label={form.status} variant={statusColors[form.status] || 'default'} />
              <button onClick={() => router.push('/clients')} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
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
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              <input type="text" value={form.contactName} onChange={(e) => update('contactName', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Type / Niche</label>
              <input type="text" value={form.businessType} onChange={(e) => update('businessType', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Package</label>
              <input type="text" value={form.packageName} onChange={(e) => update('packageName', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Financials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Price ($)</label>
              <input type="number" value={form.monthlyPrice} onChange={(e) => update('monthlyPrice', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {statusOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Churn Risk</label>
              <select value={form.churnRisk} onChange={(e) => update('churnRisk', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                {churnRiskOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Renewal Date</label>
              <input type="date" value={form.renewalDate} onChange={(e) => update('renewalDate', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Churn Date</label>
              <input type="date" value={form.churnDate} onChange={(e) => update('churnDate', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">Access & URLs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website URL</label>
              <input type="text" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GHL Sub-account URL</label>
              <input type="text" value={form.ghlSubaccountUrl} onChange={(e) => update('ghlSubaccountUrl', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Google Business Profile URL</label>
              <input type="text" value={form.googleBusinessProfileUrl} onChange={(e) => update('googleBusinessProfileUrl', e.target.value)}
                className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Access Notes</label>
            <textarea value={form.accessNotes} onChange={(e) => update('accessNotes', e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
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
            {saving ? 'Saving...' : isNew ? 'Create Client' : 'Save Changes'}
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
