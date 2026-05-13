'use client'

import { useEffect, useState, useCallback } from 'react'

export default function AINarrative() {
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(false)

  const fetchNarrative = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/metrics/narrative')
      if (!res.ok) return
      const data = await res.json()
      setNarrative(data.narrative)
      setAvailable(data.available)
    } catch {
      setAvailable(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchNarrative() }, [fetchNarrative])

  if (!available && !loading) return null

  return (
    <div className="p-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-primary/70">AI Analysis</span>
          {loading && <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />}
        </div>
        {!loading && narrative && (
          <button onClick={fetchNarrative} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Regenerate
          </button>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse-skeleton" />
          <div className="h-3 bg-muted rounded w-full animate-pulse-skeleton" />
          <div className="h-3 bg-muted rounded w-5/6 animate-pulse-skeleton" />
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse-skeleton" />
        </div>
      ) : narrative ? (
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{narrative}</div>
      ) : (
        <p className="text-sm text-muted-foreground">Set OPENAI_API_KEY to enable AI-powered insights</p>
      )}
    </div>
  )
}
