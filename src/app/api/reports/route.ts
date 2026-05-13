import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { generateCompletion, withFallback } from '@/lib/ai-utils'

export async function GET(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'weekly'
    const useAi = searchParams.get('ai') === 'true'

    if (type === 'weekly') {
      const weeklyPlan = await prisma.weeklyPlan.findFirst({ orderBy: { weekStartDate: 'desc' } })
      const activeClients = await prisma.client.findMany({ where: { status: 'active' }, take: 20 })
      const recentDecisions = await prisma.decision.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
      const activeCampaigns = await prisma.outreachCampaign.findMany({ where: { status: 'active' } })
      const runningExperiments = await prisma.experiment.findMany({ where: { status: 'running' } })
      const financialRecords = await prisma.financialRecord.findMany({ orderBy: { month: 'desc' }, take: 6 })
      const notes = await prisma.note.findMany({ where: { pinned: true }, orderBy: { updatedAt: 'desc' }, take: 10 })

      const totalMRR = activeClients.reduce((sum, c) => sum + c.monthlyPrice, 0)
      const prospectCount = await prisma.prospect.count()
      const fulfillmentTasks = await prisma.fulfillmentTask.count({ where: { status: { not: 'done' } } })

      const report = {
        type: 'weekly_review',
        generatedAt: new Date().toISOString(),
        weeklyPlan,
        financialSummary: { totalMRR, activeClients: activeClients.length, financialRecords },
        salesSummary: { prospects: prospectCount, activeCampaigns: activeCampaigns.length, campaigns: activeCampaigns },
        experiments: runningExperiments,
        decisions: recentDecisions,
        pinnedNotes: notes,
        fulfillmentBacklog: fulfillmentTasks,
      }

      if (useAi) {
        const aiAnalysis = await generateWeeklyReviewAI(report)
        return NextResponse.json({ ...report, aiAnalysis, aiAvailable: aiAnalysis !== null })
      }

      return NextResponse.json(report)
    }

    if (type === 'clients') {
      const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
      const totalMRR = clients.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.monthlyPrice, 0)
      const byStatus: Record<string, number> = {}
      clients.forEach((c) => { byStatus[c.status] = (byStatus[c.status] || 0) + 1 })
      const byChurnRisk: Record<string, number> = {}
      clients.forEach((c) => { byChurnRisk[c.churnRisk] = (byChurnRisk[c.churnRisk] || 0) + 1 })

      const report = {
        type: 'client_report',
        generatedAt: new Date().toISOString(),
        totalClients: clients.length,
        totalMRR,
        byStatus,
        byChurnRisk,
        clients,
      }

      if (useAi) {
        const aiAnalysis = await generateClientReportAI(report)
        return NextResponse.json({ ...report, aiAnalysis, aiAvailable: aiAnalysis !== null })
      }

      return NextResponse.json(report)
    }

    if (type === 'outreach') {
      const campaigns = await prisma.outreachCampaign.findMany({ orderBy: { createdAt: 'desc' } })
      const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0)
      const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0)
      const totalBooked = campaigns.reduce((sum, c) => sum + c.bookedCallCount, 0)
      const totalClosed = campaigns.reduce((sum, c) => sum + c.closedWonCount, 0)

      const report = {
        type: 'outreach_report',
        generatedAt: new Date().toISOString(),
        totalCampaigns: campaigns.length,
        totalSent, totalReplies, totalBooked, totalClosed,
        replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : '0',
        bookedRate: totalSent > 0 ? ((totalBooked / totalSent) * 100).toFixed(1) : '0',
        campaigns,
      }

      if (useAi) {
        const aiAnalysis = await generateOutreachReportAI(report)
        return NextResponse.json({ ...report, aiAnalysis, aiAvailable: aiAnalysis !== null })
      }

      return NextResponse.json(report)
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function generateWeeklyReviewAI(report: Record<string, unknown>): Promise<string | null> {
  const systemPrompt = `You're a business coach reviewing a founder's weekly performance for a local business marketing agency.

Write concisely covering:
1. This week's summary (2 sentences)
2. What went well (bullet points from data)
3. What needs attention (bullet points from data)
4. Next week's top 3 priorities (suggest based on data)
5. One unconventional insight

Be direct. No corporate speak. Under 250 words.`

  const weeklyPlan = report.weeklyPlan as { weeklyGoal?: string; topPriorities?: string; whatWorked?: string; whatDidNotWork?: string } | null
  const fin = report.financialSummary as { totalMRR: number; activeClients: number }
  const sales = report.salesSummary as { prospects: number; activeCampaigns: number }

  const userPrompt = `Weekly Plan: ${weeklyPlan?.weeklyGoal || 'Not set'}
What worked: ${weeklyPlan?.whatWorked || 'N/A'}
What didn't: ${weeklyPlan?.whatDidNotWork || 'N/A'}
Financials: $${fin?.totalMRR || 0} MRR, ${fin?.activeClients || 0} active clients
Sales: ${sales?.prospects || 0} prospects, ${sales?.activeCampaigns || 0} active campaigns
Experiments running: ${(report.experiments as unknown[])?.length || 0}
Recent decisions: ${(report.decisions as unknown[])?.length || 0}
Fulfillment backlog: ${report.fulfillmentBacklog || 0} tasks`

  return withFallback(generateCompletion(systemPrompt, userPrompt), null)
}

async function generateClientReportAI(report: Record<string, unknown>): Promise<string | null> {
  const systemPrompt = `Analyze a client portfolio for a local business marketing agency.
Cover: 1. Portfolio health score (1-10 and why), 2. At-risk client analysis, 3. Revenue concentration risk, 4. Retention priorities.
Under 200 words, direct tone.`

  const userPrompt = `Total clients: ${report.totalClients}, MRR: $${report.totalMRR}
By status: ${JSON.stringify(report.byStatus)}
By churn risk: ${JSON.stringify(report.byChurnRisk)}`

  return withFallback(generateCompletion(systemPrompt, userPrompt), null)
}

async function generateOutreachReportAI(report: Record<string, unknown>): Promise<string | null> {
  const systemPrompt = `Analyze outreach campaign performance. Cover: top campaign and why, worst campaign and fix, channel comparison, volume recommendation.
Under 200 words, direct tone.`

  const userPrompt = `Campaigns: ${JSON.stringify(report.campaigns)}
Totals: ${report.totalSent} sent, ${report.totalReplies} replies (${report.replyRate}%), ${report.totalBooked} booked, ${report.totalClosed} closed`

  return withFallback(generateCompletion(systemPrompt, userPrompt), null)
}
