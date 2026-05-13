'use client'

import { useState, useEffect, useCallback } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import { useToast, ToastContainer } from '@/components/Toast'
import MRRChart from '@/components/ui/MRRChart'
import ClientGrowthChart from '@/components/ui/ClientGrowthChart'
import PipelineChart from '@/components/ui/PipelineChart'
import AINarrative from '@/components/ui/AINarrative'
import AIAlerts from '@/components/ui/AIAlerts'
import Link from 'next/link'

interface MetricsData {
  clientCount: number
  activeClients: number
  churnedClients: number
  totalMRR: number
  prospectCount: number
  noteCount: number
  decisionCount: number
  whiteboardCount: number
  sopCount: number
  runningExperiments: number
  activeCampaigns: number
  financialRecords: Array<{ year: number; month: number; mrr: number; newClients: number; churnedClients: number }>
  activeNiches: Array<{ id: string; name: string; status: string }>
  activeOffers: Array<{ id: string; name: string; status: string }>
  overdueTasks: number
  highChurnClients: number
  pinnedNotes: Array<{ id: string; title: string }>
  recentDecisions: Array<{ id: string; title: string; status: string }>
  weeklyPlan: { id: string; weeklyGoal: string; topPriorities: string } | null
  vaTaskStats: { todo: number; done: number; total: number }
}

export default function MetricsPage() {
  const { toasts, dismissToast, error } = useToast()
  const [data, setData] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics')
      if (res.ok) setData(await res.json())
      else error('Failed to load metrics')
    } catch {
      error('Failed to load metrics')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchMetrics() }, [fetchMetrics])

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fade-in">
        <div className="space-y-2"><div className="h-8 w-48 bg-muted rounded animate-pulse-skeleton" /><div className="h-4 w-72 bg-muted rounded animate-pulse-skeleton" /></div>
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse-skeleton" />)}</div>
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse-skeleton" />)}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Failed to load metrics</p>
          <Button variant="outline" className="mt-4" onClick={() => { setLoading(true); fetchMetrics() }}>Retry</Button>
        </div>
      </div>
    )
  }

  const latestMRR = data.financialRecords.length > 0 ? data.financialRecords[0].mrr : data.totalMRR
  const avgNewClients = data.financialRecords.length > 0
    ? Math.round(data.financialRecords.reduce((s, r) => s + r.newClients, 0) / data.financialRecords.length)
    : 0

  return (
    <>
      <ModulePage
        title="Metrics Dashboard"
        description="Aggregated metrics from all modules"
        action={<Button variant="outline" onClick={() => { setLoading(true); fetchMetrics() }}>Refresh</Button>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">MRR</p>
            <p className="text-2xl font-bold mt-1">${latestMRR.toLocaleString()}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Active Clients</p>
            <p className="text-2xl font-bold mt-1">{data.activeClients}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Prospects</p>
            <p className="text-2xl font-bold mt-1">{data.prospectCount}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Avg New Clients/Mo</p>
            <p className="text-2xl font-bold mt-1">{avgNewClients}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold mt-1">{data.activeCampaigns}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Running Experiments</p>
            <p className="text-2xl font-bold mt-1">{data.runningExperiments}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">Overdue Tasks</p>
            <p className="text-2xl font-bold mt-1 text-destructive">{data.overdueTasks}</p>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm">
            <p className="text-sm text-muted-foreground">High Churn Risk</p>
            <p className="text-2xl font-bold mt-1 text-destructive">{data.highChurnClients}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">VA Task Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">To Do</span><span className="font-medium">{data.vaTaskStats.todo}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Done</span><span className="font-medium">{data.vaTaskStats.done}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-medium">{data.vaTaskStats.total}</span></div>
            </div>
          </div>

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Content</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Whiteboards</span><span className="font-medium">{data.whiteboardCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Notes</span><span className="font-medium">{data.noteCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Decisions</span><span className="font-medium">{data.decisionCount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">SOPs</span><span className="font-medium">{data.sopCount}</span></div>
            </div>
          </div>
        </div>

        {data.activeNiches.length > 0 && (
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Active Niches</h3>
            <div className="flex flex-wrap gap-2">
              {data.activeNiches.map((n) => (
                <Link key={n.id} href={`/niches/${n.id}`} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                  {n.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {data.activeOffers.length > 0 && (
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Active Offers</h3>
            <div className="flex flex-wrap gap-2">
              {data.activeOffers.map((o) => (
                <Link key={o.id} href={`/offers/${o.id}`} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors">
                  {o.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {data.financialRecords.length > 0 && (
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Recent Financial Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 font-medium text-muted-foreground">Period</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">MRR</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">New</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Churned</th>
                  </tr>
                </thead>
                <tbody>
                  {data.financialRecords.map((r) => (
                    <tr key={`${r.year}-${r.month}`} className="border-b last:border-0">
                      <td className="py-2">{r.month}/{r.year}</td>
                      <td className="py-2 font-medium">${r.mrr.toLocaleString()}</td>
                      <td className="py-2 text-green-600">+{r.newClients}</td>
                      <td className="py-2 text-red-600">-{r.churnedClients}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AINarrative />
        <AIAlerts />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MRRChart />
          <ClientGrowthChart />
        </div>
        <PipelineChart />
      </ModulePage>

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
