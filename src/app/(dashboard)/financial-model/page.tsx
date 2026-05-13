'use client'

import { useState, useEffect, useCallback } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useToast, ToastContainer } from '@/components/Toast'
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
  const { toasts, dismissToast, success, error } = useToast()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaults)
  const [deleteTarget, setDeleteTarget] = useState<Scenario | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchScenarios = useCallback(async () => {
    try {
      const res = await fetch('/api/financial-scenarios')
      if (res.ok) setScenarios(await res.json())
    } catch {
      error('Failed to load scenarios')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchScenarios() }, [fetchScenarios])

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
        success('Scenario created')
      }
    } catch {
      error('Failed to create scenario')
    }
  }

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/financial-scenarios/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setScenarios((prev) => prev.filter((s) => s.id !== deleteTarget.id))
        success('Scenario deleted')
      } else {
        error('Failed to delete scenario')
      }
    } catch {
      error('Failed to delete scenario')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  return (
    <>
      <ModulePage
        title="Financial Model"
        description="Model your business economics with scenarios"
        loading={loading && scenarios.length === 0}
      >
        {/* New Scenario Form */}
        <div className="p-4 border rounded-xl bg-card space-y-4">
          <h3 className="text-sm font-semibold">New Scenario</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Price/mo ($)</label>
              <input type="number" value={form.averageMonthlyPrice} onChange={(e) => setForm({ ...form, averageMonthlyPrice: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Current Clients</label>
              <input type="number" value={form.currentClients} onChange={(e) => setForm({ ...form, currentClients: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">New Clients/mo</label>
              <input type="number" value={form.newClientsPerMonth} onChange={(e) => setForm({ ...form, newClientsPerMonth: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Churn Rate</label>
              <input type="number" step="0.01" value={form.monthlyChurnRate} onChange={(e) => setForm({ ...form, monthlyChurnRate: parseFloat(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fixed Costs ($)</label>
              <input type="number" value={form.monthlyFixedCosts} onChange={(e) => setForm({ ...form, monthlyFixedCosts: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Software/Client ($)</label>
              <input type="number" value={form.softwareCostPerClient ?? 0} onChange={(e) => setForm({ ...form, softwareCostPerClient: parseInt(e.target.value) || 0 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Months to Project</label>
              <input type="number" value={form.monthsToProject} onChange={(e) => setForm({ ...form, monthsToProject: parseInt(e.target.value) || 12 })}
                className="w-full h-9 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <Button onClick={handleCreate}>Create Scenario</Button>
        </div>

        {/* Scenarios */}
        {scenarios.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No scenarios yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create a scenario to model your business economics</p>
          </div>
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
                    <button onClick={() => setDeleteTarget(s)} className="text-xs text-destructive hover:text-destructive/80">Delete</button>
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
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Scenario"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
