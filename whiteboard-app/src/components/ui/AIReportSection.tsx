'use client'

interface AIReportSectionProps {
  analysis: string | null
  loading: boolean
  available: boolean
}

export default function AIReportSection({ analysis, loading, available }: AIReportSectionProps) {
  if (!available && !loading) return null

  return (
    <div className="p-4 border rounded-xl bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-primary/70">AI Analysis</span>
        {loading && <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />}
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse-skeleton" />
          <div className="h-3 bg-muted rounded w-full animate-pulse-skeleton" />
          <div className="h-3 bg-muted rounded w-5/6 animate-pulse-skeleton" />
        </div>
      ) : analysis ? (
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{analysis}</div>
      ) : (
        <p className="text-sm text-muted-foreground">Set OPENAI_API_KEY to enable AI-powered report analysis</p>
      )}
    </div>
  )
}
