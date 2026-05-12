import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'weekly'

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

      return NextResponse.json({
        type: 'weekly_review',
        generatedAt: new Date().toISOString(),
        weeklyPlan,
        financialSummary: {
          totalMRR,
          activeClients: activeClients.length,
          financialRecords,
        },
        salesSummary: {
          prospects: prospectCount,
          activeCampaigns: activeCampaigns.length,
          campaigns: activeCampaigns,
        },
        experiments: runningExperiments,
        decisions: recentDecisions,
        pinnedNotes: notes,
        fulfillmentBacklog: fulfillmentTasks,
      })
    }

    if (type === 'clients') {
      const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
      const totalMRR = clients.filter((c) => c.status === 'active').reduce((sum, c) => sum + c.monthlyPrice, 0)
      const byStatus: Record<string, number> = {}
      clients.forEach((c) => { byStatus[c.status] = (byStatus[c.status] || 0) + 1 })
      const byChurnRisk: Record<string, number> = {}
      clients.forEach((c) => { byChurnRisk[c.churnRisk] = (byChurnRisk[c.churnRisk] || 0) + 1 })

      return NextResponse.json({
        type: 'client_report',
        generatedAt: new Date().toISOString(),
        totalClients: clients.length,
        totalMRR,
        byStatus,
        byChurnRisk,
        clients,
      })
    }

    if (type === 'outreach') {
      const campaigns = await prisma.outreachCampaign.findMany({ orderBy: { createdAt: 'desc' } })
      const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0)
      const totalReplies = campaigns.reduce((sum, c) => sum + c.replyCount, 0)
      const totalBooked = campaigns.reduce((sum, c) => sum + c.bookedCallCount, 0)
      const totalClosed = campaigns.reduce((sum, c) => sum + c.closedWonCount, 0)

      return NextResponse.json({
        type: 'outreach_report',
        generatedAt: new Date().toISOString(),
        totalCampaigns: campaigns.length,
        totalSent,
        totalReplies,
        totalBooked,
        totalClosed,
        replyRate: totalSent > 0 ? ((totalReplies / totalSent) * 100).toFixed(1) : '0',
        bookedRate: totalSent > 0 ? ((totalBooked / totalSent) * 100).toFixed(1) : '0',
        campaigns,
      })
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
