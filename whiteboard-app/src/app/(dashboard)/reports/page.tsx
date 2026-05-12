'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Array<Record<string, unknown>>>([])
  const [financials, setFinancials] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/clients').then((r) => r.ok ? r.json() : []),
      fetch('/api/financials').then((r) => r.ok ? r.json() : []),
    ]).then(([c, f]) => {
      setClients(c)
      setFinancials(f)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  const activeClients = clients.filter((c) => c.status === 'active')
  const churnedClients = clients.filter((c) => c.status === 'churned')
  const totalMrr = activeClients.reduce((sum, c) => sum + (c.monthlyPrice as number || 0), 0)
  const avgTicket = activeClients.length > 0 ? totalMrr / activeClients.length : 0

  const mrrByStatus = clients.reduce((acc: Record<string, number>, c) => {
    const status = c.status as string
    acc[status] = (acc[status] || 0) + (c.monthlyPrice as number || 0)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Reports"
        description="Business performance overview"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Total MRR</p>
          <p className="text-2xl font-bold mt-1">${totalMrr.toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="text-2xl font-bold mt-1">{activeClients.length}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Avg Revenue/Client</p>
          <p className="text-2xl font-bold mt-1">${Math.round(avgTicket).toLocaleString()}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Churned</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{churnedClients.length}</p>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card mb-6">
        <h3 className="text-sm font-semibold mb-3">MRR by Client Status</h3>
        <div className="space-y-2">
          {Object.entries(mrrByStatus).map(([status, mrr]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-sm capitalize">{status}</span>
              <span className="text-sm font-medium">${(mrr as number).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <h3 className="text-sm font-semibold mb-3">Financial Records</h3>
        {financials.length === 0 ? (
          <p className="text-sm text-muted-foreground">No financial records yet</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Period</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">MRR</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">New</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground">Churned</th>
                </tr>
              </thead>
              <tbody>
                {financials.slice(0, 12).map((f) => (
                  <tr key={String(f.id)} className="border-b last:border-0">
                    <td className="px-4 py-2">{String(f.month)}/{String(f.year)}</td>
                    <td className="px-4 py-2">${(f.mrr as number)?.toLocaleString()}</td>
                    <td className="px-4 py-2">{f.newClients as number}</td>
                    <td className="px-4 py-2">{f.churnedClients as number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
