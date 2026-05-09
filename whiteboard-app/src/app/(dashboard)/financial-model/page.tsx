'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { calculateSummary } from '@/lib/financial-calculations'

interface Scenario {
  id: string
  name: string
  averageMonthlyPrice: number
  setupFee: number | null
  currentClients: number
  newClientsPerMonth: number
  monthlyChurnRate: number
  vaSetupCost: number | null
  softwareCostPerClient: number | null
  monthlyFixedCosts: number
  adSpend: number
  bookedCallCost: number | null
  closeRate: number
  monthsToProject: number
  notes: string
}

const defaults = {
  name: 'Base Case',
  averageMonthlyPrice: 197,
  setupFee: 0,
  currentClients: 0,
  newClientsPerMonth: 5,
  monthlyChurnRate: 0.05,
  vaSetupCost: 0,
  softwareCostPerClient: 50,
  monthlyFixedCosts: 500,
  adSpend: 0,
  bookedCallCost: 0,
  closeRate: 0.25,
  monthsToProject: 12,
  notes: '',
}

export default function FinancialModelPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaults)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchScenarios() }, [])

  const fetchScenarios = async () => {
    try {
      const res = await fetch('/api/financial-scenarios')
      if (res.ok) setScenarios(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/financial-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const saved = await res.json()
        setScenarios([saved, ...scenarios])
        setForm(defaults)
      }
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this scenario?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/financial-scenarios/${id}`, { method: 'DELETE' })
      if (res.ok) setScenarios(scenarios.filter((s) => s.id !== id))
    } catch { /* ignore */ } finally { setDeletingId(null) }
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader title="Financial Model" description="Model your business economics with scenarios" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 border rounded-xl bg-card space-y-4">
            <h3 className="text-sm font-semibold">New Scenario</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Price/mo ($)</label>
                <input type="number" value={form.averageMonthlyPrice} onChange={(e) => setForm({ ...form, averageMonthlyPrice: parseInt(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Clients</label>
                <input type="number" value={form.currentClients} onChange={(e) => setForm({ ...form, currentClients: parseInt(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Clients/mo</label>
                <input type="number" value={form.newClientsPerMonth} onChange={(e) => setForm({ ...form, newClientsPerMonth: parseInt(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Churn Rate</label>
                <input type="number" step="0.01" value={form.monthlyChurnRate} onChange={(e) => setForm({ ...form, monthlyChurnRate: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fixed Costs ($)</label>
                <input type="number" value={form.monthlyFixedCosts} onChange={(e) => setForm({ ...form, monthlyFixedCosts: parseInt(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Software/Client ($)</label>
                <input type="number" value={form.softwareCostPerClient ?? 0} onChange={(e) => setForm({ ...form, softwareCostPerClient: parseInt(e.target.value) || 0 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Months to Project</label>
                <input type="number" value={form.monthsToProject} onChange={(e) => setForm({ ...form, monthsToProject: parseInt(e.target.value) || 12 })}
                  className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <button onClick={handleCreate}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
              Create Scenario
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {scenarios.length === 0 ? (
            <EmptyState title="No scenarios yet" description="Create a scenario to model your business economics" />
          ) : (
            <div className="space-y-4">
              {scenarios.map((s) => {
                const summary = calculateSummary({
                  averageMonthlyPrice: s.averageMonthlyPrice,
                  currentClients: s.currentClients,
                  newClientsPerMonth: s.newClientsPerMonth,
                  monthlyChurnRate: s.monthlyChurnRate,
                  monthlyFixedCosts: s.monthlyFixedCosts,
                  softwareCostPerClient: s.softwareCostPerClient ?? 0,
                  monthsToProject: s.monthsToProject,
                })
                return (
                  <div key={s.id} className="p-4 border rounded-xl bg-card space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">{s.name}</h3>
                      <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}
                        className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div><p className="text-xs text-muted-foreground">Current MRR</p><p className="text-lg font-bold">${summary.currentMRR.toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground">Projected MRR</p><p className="text-lg font-bold">${summary.projectedMRR.toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground">Projected Clients</p><p className="text-lg font-bold">{summary.projectedClients}</p></div>
                      <div><p className="text-xs text-muted-foreground">Monthly Profit</p><p className={`text-lg font-bold ${summary.projectedMonthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${summary.projectedMonthlyProfit.toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground">Break-even</p><p className="text-lg font-bold">{summary.breakEvenMonth ? `Month ${summary.breakEvenMonth}` : 'N/A'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Cumulative Profit</p><p className={`text-lg font-bold ${summary.projectedCumulativeProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>${summary.projectedCumulativeProfit.toLocaleString()}</p></div>
                      <div><p className="text-xs text-muted-foreground">Total Churned</p><p className="text-lg font-bold">{summary.totalChurned}</p></div>
                      <div><p className="text-xs text-muted-foreground">Total Net New</p><p className="text-lg font-bold">{summary.totalNetNew}</p></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
