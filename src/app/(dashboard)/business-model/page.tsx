'use client'

import { useState, useEffect, useCallback } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import Button from '@/components/ui/Button'
import { useToast, ToastContainer } from '@/components/Toast'

interface BusinessModel {
  id: string
  name: string
  targetCustomer: string
  coreProblem: string
  mainPromise: string
  mechanism: string
  priceMin: number
  priceMax: number
  setupFee: number | null
  fulfillmentCostMin: number | null
  fulfillmentCostMax: number | null
  corePillars: string
  acquisitionChannels: string
  fulfillmentProcess: string
  retentionMechanism: string
  notes: string
}

const defaultModel = {
  name: '',
  targetCustomer: '',
  coreProblem: '',
  mainPromise: '',
  mechanism: '',
  priceMin: 97,
  priceMax: 297,
  setupFee: null as number | null,
  fulfillmentCostMin: null as number | null,
  fulfillmentCostMax: null as number | null,
  corePillars: JSON.stringify(['SEO website', 'Google review automation', 'Missed-call text-back', 'Database reactivation']),
  acquisitionChannels: '',
  fulfillmentProcess: '',
  retentionMechanism: '',
  notes: '',
}

export default function BusinessModelPage() {
  const { toasts, dismissToast, success, error } = useToast()
  const [model, setModel] = useState<BusinessModel | null>(null)
  const [form, setForm] = useState(defaultModel)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/business-model')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setModel(data)
          setForm({
            name: data.name || '',
            targetCustomer: data.targetCustomer || '',
            coreProblem: data.coreProblem || '',
            mainPromise: data.mainPromise || '',
            mechanism: data.mechanism || '',
            priceMin: data.priceMin ?? 97,
            priceMax: data.priceMax ?? 297,
            setupFee: data.setupFee,
            fulfillmentCostMin: data.fulfillmentCostMin,
            fulfillmentCostMax: data.fulfillmentCostMax,
            corePillars: data.corePillars || '',
            acquisitionChannels: data.acquisitionChannels || '',
            fulfillmentProcess: data.fulfillmentProcess || '',
            retentionMechanism: data.retentionMechanism || '',
            notes: data.notes || '',
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = model ? 'PATCH' : 'POST'
      const url = model ? `/api/business-model/${model.id}` : '/api/business-model'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        error(data.error || 'Failed to save')
        return
      }

      const saved = await res.json()
      setModel(saved)
      success('Saved successfully')
    } catch {
      error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const update = (field: string, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fade-in">
        <div className="space-y-2"><div className="h-8 w-48 bg-muted rounded animate-pulse-skeleton" /><div className="h-4 w-72 bg-muted rounded animate-pulse-skeleton" /></div>
        <div className="h-64 bg-muted rounded-xl animate-pulse-skeleton" />
      </div>
    )
  }

  return (
    <>
      <ModulePage
        title="Business Model"
        description="Define your core business assumptions and pricing"
        loading={false}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border rounded-xl bg-card space-y-4">
            <h3 className="text-sm font-semibold">Core Identity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                  className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Local Marketing Foundation" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Customer</label>
                <input type="text" value={form.targetCustomer} onChange={(e) => update('targetCustomer', e.target.value)}
                  className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g., Local service businesses" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Core Problem</label>
              <textarea value={form.coreProblem} onChange={(e) => update('coreProblem', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What problem do you solve?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Main Promise</label>
              <textarea value={form.mainPromise} onChange={(e) => update('mainPromise', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What do you guarantee?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mechanism</label>
              <textarea value={form.mechanism} onChange={(e) => update('mechanism', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="How do you deliver results?" />
            </div>
          </div>

          <div className="p-4 border rounded-xl bg-card space-y-4">
            <h3 className="text-sm font-semibold">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price Min ($)</label>
                <input type="number" value={form.priceMin} onChange={(e) => update('priceMin', parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price Max ($)</label>
                <input type="number" value={form.priceMax} onChange={(e) => update('priceMax', parseInt(e.target.value) || 0)}
                  className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Setup Fee ($)</label>
                <input type="number" value={form.setupFee ?? ''} onChange={(e) => update('setupFee', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Optional" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fulfillment Cost ($)</label>
                <div className="flex gap-2">
                  <input type="number" value={form.fulfillmentCostMin ?? ''} onChange={(e) => update('fulfillmentCostMin', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Min" />
                  <input type="number" value={form.fulfillmentCostMax ?? ''} onChange={(e) => update('fulfillmentCostMax', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Max" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-xl bg-card space-y-4">
            <h3 className="text-sm font-semibold">Operations</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Core Pillars (JSON)</label>
              <textarea value={form.corePillars} onChange={(e) => update('corePillars', e.target.value)} rows={3}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono text-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Acquisition Channels</label>
              <textarea value={form.acquisitionChannels} onChange={(e) => update('acquisitionChannels', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fulfillment Process</label>
              <textarea value={form.fulfillmentProcess} onChange={(e) => update('fulfillmentProcess', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Retention Mechanism</label>
              <textarea value={form.retentionMechanism} onChange={(e) => update('retentionMechanism', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <Button type="submit" loading={saving}>{model ? 'Update' : 'Create'}</Button>
        </form>
      </ModulePage>

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
