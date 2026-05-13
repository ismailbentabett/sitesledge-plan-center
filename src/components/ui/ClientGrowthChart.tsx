'use client'

import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendPoint {
  label: string
  value: number
  churned: number
}

export default function ClientGrowthChart() {
  const [data, setData] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/metrics/trends?metric=clients&months=12')
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
        <p className="text-sm text-muted-foreground">No client growth data available</p>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-xl bg-card">
      <h3 className="text-sm font-semibold mb-4">Client Growth</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
          />
          <Area type="monotone" dataKey="value" name="New Clients" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%, 0.15)" strokeWidth={2} />
          <Area type="monotone" dataKey="churned" name="Churned" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%, 0.15)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
