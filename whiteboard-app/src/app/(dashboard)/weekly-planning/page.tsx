'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

interface WeeklyPlan {
  id: string
  weekStartDate: string
  weekEndDate: string
  weeklyGoal: string
  topPriorities: string
  mainMetric: string
  whatWorked: string
  whatDidNotWork: string
  mainBottleneck: string
  salesActions: string
  fulfillmentActions: string
  systemActions: string
  delegatedTasks: string
  stoppedTasks: string
  previousWeekReview: string
  notes: string
  createdAt: string
}

function getWeekDates() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

const defaults = {
  weekStartDate: '',
  weekEndDate: '',
  weeklyGoal: '',
  topPriorities: '',
  mainMetric: '',
  whatWorked: '',
  whatDidNotWork: '',
  mainBottleneck: '',
  salesActions: '',
  fulfillmentActions: '',
  systemActions: '',
  delegatedTasks: '',
  stoppedTasks: '',
  previousWeekReview: '',
  notes: '',
}

export default function WeeklyPlanningPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<WeeklyPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...defaults, ...getWeekDates() })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchPlans() }, [])

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/weekly-plans')
      if (res.ok) setPlans(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/weekly-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const saved = await res.json()
        setPlans([saved, ...plans])
        setForm({ ...defaults, ...getWeekDates() })
      }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return
    try {
      const res = await fetch(`/api/weekly-plans/${id}`, { method: 'DELETE' })
      if (res.ok) setPlans(plans.filter((p) => p.id !== id))
    } catch { /* ignore */ }
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader title="Weekly Planning" description="Set goals and review progress each week" />

      <form onSubmit={handleSubmit} className="p-4 border rounded-xl bg-card space-y-4 mb-6">
        <h3 className="text-sm font-semibold">This Week: {new Date(form.weekStartDate).toLocaleDateString()} — {new Date(form.weekEndDate).toLocaleDateString()}</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Weekly Goal</label>
          <input type="text" value={form.weeklyGoal} onChange={(e) => setForm({ ...form, weeklyGoal: e.target.value })}
            className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What's the #1 thing this week?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Main Metric</label>
          <input type="text" value={form.mainMetric} onChange={(e) => setForm({ ...form, mainMetric: e.target.value })}
            className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="What metric matters most?" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Top Priorities</label>
          <textarea value={form.topPriorities} onChange={(e) => setForm({ ...form, topPriorities: e.target.value })} rows={3}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="1. ...&#10;2. ...&#10;3. ..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sales Actions</label>
            <textarea value={form.salesActions} onChange={(e) => setForm({ ...form, salesActions: e.target.value })} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fulfillment Actions</label>
            <textarea value={form.fulfillmentActions} onChange={(e) => setForm({ ...form, fulfillmentActions: e.target.value })} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">System Actions</label>
            <textarea value={form.systemActions} onChange={(e) => setForm({ ...form, systemActions: e.target.value })} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Delegated Tasks</label>
            <textarea value={form.delegatedTasks} onChange={(e) => setForm({ ...form, delegatedTasks: e.target.value })} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stopped Tasks</label>
            <textarea value={form.stoppedTasks} onChange={(e) => setForm({ ...form, stoppedTasks: e.target.value })} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Main Bottleneck</label>
            <textarea value={form.mainBottleneck} onChange={(e) => setForm({ ...form, mainBottleneck: e.target.value })} rows={2}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button type="submit" disabled={saving}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
          {saving ? 'Saving...' : 'Save Plan'}
        </button>
      </form>

      {plans.length === 0 ? (
        <EmptyState title="No plans yet" description="Create your first weekly plan above" />
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Past Plans</h3>
          {plans.map((plan) => (
            <div key={plan.id} className="p-4 border rounded-xl bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {new Date(plan.weekStartDate).toLocaleDateString()} — {new Date(plan.weekEndDate).toLocaleDateString()}
                </span>
                <button onClick={() => handleDelete(plan.id)} className="text-xs text-destructive hover:text-destructive/80">Delete</button>
              </div>
              {plan.weeklyGoal && <p className="text-sm"><span className="text-muted-foreground">Goal:</span> {plan.weeklyGoal}</p>}
              {plan.topPriorities && <p className="text-sm mt-1"><span className="text-muted-foreground">Priorities:</span> {plan.topPriorities}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
