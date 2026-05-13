'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PipelinePoint {
  status: string
  value: number
}

const statusLabels: Record<string, string> = {
  lead: 'Lead',
  contacted: 'Contacted',
  replied: 'Replied',
  interested: 'Interested',
  booked_call: 'Booked Call',
  no_show: 'No Show',
  proposal_sent: 'Proposal',
  closed_won: 'Won',
  closed_lost: 'Lost',
}

export default function PipelineChart() {
  const [data, setData] = useState<PipelinePoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/metrics/trends?metric=pipeline')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setData(json.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="h-64 bg-muted rounded-xl animate-pulse-skeleton" />

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border rounded-xl bg-card">
        <p className="text-sm text-muted-foreground">No pipeline data available</p>
      </div>
    )
  }

  const chartData = data.map((d) => ({ ...d, label: statusLabels[d.status] || d.status }))

  return (
    <div className="p-4 border rounded-xl bg-card">
      <h3 className="text-sm font-semibold mb-4">Pipeline Funnel</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" angle={-30} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
          />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
