import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { generateJSON, withFallback } from '@/lib/ai-utils'

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

interface AnomaliesResponse {
  anomalies: Anomaly[]
  historicalAverages: Record<string, number>
}

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const financialRecords = await prisma.financialRecord.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      take: 12,
    })

    if (financialRecords.length < 2) {
      return NextResponse.json({ anomalies: [], historicalAverages: {} })
    }

    const current = financialRecords[0]
    const historical = financialRecords.slice(1)
    const avgMRR = historical.reduce((s, r) => s + r.mrr, 0) / historical.length
    const avgNew = historical.reduce((s, r) => s + r.newClients, 0) / historical.length
    const avgChurn = historical.reduce((s, r) => s + r.churnedClients, 0) / historical.length

    const anomalies: Anomaly[] = []
    const threshold = 0.3

    if (avgMRR > 0 && Math.abs(current.mrr - avgMRR) / avgMRR > threshold) {
      anomalies.push({
        metric: 'mrr',
        label: 'MRR',
        currentValue: current.mrr,
        average: Math.round(avgMRR),
        deviation: Math.round(((current.mrr - avgMRR) / avgMRR) * 100),
        direction: current.mrr > avgMRR ? 'up' : 'down',
        possibleCause: '',
        action: '',
      })
    }

    if (avgNew > 0 && Math.abs(current.newClients - avgNew) / Math.max(avgNew, 1) > threshold) {
      anomalies.push({
        metric: 'newClients',
        label: 'New Clients',
        currentValue: current.newClients,
        average: Math.round(avgNew),
        deviation: Math.round(((current.newClients - avgNew) / Math.max(avgNew, 1)) * 100),
        direction: current.newClients > avgNew ? 'up' : 'down',
        possibleCause: '',
        action: '',
      })
    }

    if (avgChurn > 0 && current.churnedClients > avgChurn * 1.3) {
      anomalies.push({
        metric: 'churn',
        label: 'Churned Clients',
        currentValue: current.churnedClients,
        average: Math.round(avgChurn),
        deviation: Math.round(((current.churnedClients - avgChurn) / Math.max(avgChurn, 1)) * 100),
        direction: 'up',
        possibleCause: '',
        action: '',
      })
    }

    // Use AI to suggest causes/actions if anomalies found and API key set
    if (anomalies.length > 0) {
      const systemPrompt = `You are analyzing business metric anomalies for a local service marketing agency.
For each anomaly, suggest a brief possible cause and one actionable recommendation.
Return valid JSON only.`

      const userPrompt = `Anomalies: ${JSON.stringify(anomalies.map((a) => ({
        metric: a.label,
        currentValue: a.currentValue,
        average: a.average,
        deviation: `${a.deviation}% ${a.direction}`,
      })))}`

      const aiSuggestions = await withFallback(
        generateJSON<{ suggestions: Array<{ possibleCause: string; action: string }> }>(systemPrompt, userPrompt),
        null
      )

      if (aiSuggestions?.success) {
        aiSuggestions.data.suggestions.forEach((suggestion, i) => {
          if (anomalies[i]) {
            anomalies[i].possibleCause = suggestion.possibleCause
            anomalies[i].action = suggestion.action
          }
        })
      }
    }

    return NextResponse.json({
      anomalies,
      historicalAverages: {
        mrr: Math.round(avgMRR),
        newClients: Math.round(avgNew),
        churn: Math.round(avgChurn),
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
