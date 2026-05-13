'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendPoint {
  month: string
  label: string
  value: number
}

export default function MRRChart() {
  const [data, setData] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/metrics/trends?metric=mrr&months=12')
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
        <p className="text-sm text-muted-foreground">No MRR data available</p>
      </div>
    )
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="p-4 border rounded-xl bg-card">
      <h3 className="text-sm font-semibold mb-4">MRR Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
            stroke="var(--muted-foreground)"
            domain={[0, Math.ceil(maxVal / 1000) * 1000]}
          />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
          />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
