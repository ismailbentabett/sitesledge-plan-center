'use client'

import { useEffect, useState } from 'react'

interface Anomaly {
  metric: string
  label: string
  currentValue: number
  average: number
  deviation: number
  direction: 'up' | 'down'
  possibleCause: string
  action: string
}

export default function AIAlerts() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetch('/api/metrics/anomalies')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.anomalies?.length > 0) {
          setAnomalies(data.anomalies)
          setVisible(true)
        }
      })
  }, [])

  if (!visible) return null

  return (
    <div className="space-y-3">
      {anomalies.map((a) => (
        <div
          key={a.metric}
          className={`p-4 border rounded-xl ${a.direction === 'down' ? 'border-destructive/30 bg-destructive/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-2 h-2 rounded-full ${a.direction === 'down' ? 'bg-destructive' : 'bg-yellow-500'}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {a.label} is {a.direction === 'down' ? 'below' : 'above'} normal range
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Current: {formatValue(a.metric, a.currentValue)} vs. {formatValue(a.metric, a.average)} avg ({a.deviation > 0 ? '+' : ''}{a.deviation}%)
              </p>
              {a.possibleCause && (
                <p className="text-xs text-muted-foreground mt-1">Possible cause: {a.possibleCause}</p>
              )}
              {a.action && (
                <p className="text-xs text-primary mt-1 font-medium">Action: {a.action}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatValue(metric: string, value: number): string {
  if (metric === 'mrr') return `$${value.toLocaleString()}`
  if (metric === 'newClients') return `${value} clients`
  if (metric === 'churn') return `${value} churned`
  return String(value)
}
