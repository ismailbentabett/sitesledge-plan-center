import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [clientCount, activeClients, churnedClients, totalMRR, prospectCount, noteCount, decisionCount, whiteboardCount, sopCount, experimentCount, campaignCount] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { status: 'active' } }),
      prisma.client.count({ where: { status: 'churned' } }),
      prisma.client.aggregate({ where: { status: 'active' }, _sum: { monthlyPrice: true } }),
      prisma.prospect.count(),
      prisma.note.count(),
      prisma.decision.count(),
      prisma.board.count(),
      prisma.sOP.count(),
      prisma.experiment.count({ where: { status: 'running' } }),
      prisma.outreachCampaign.count({ where: { status: 'active' } }),
    ])

    const financialRecords = await prisma.financialRecord.findMany({ orderBy: { month: 'desc' }, take: 12 })
    const niches = await prisma.niche.findMany({ where: { status: 'active' }, take: 5 })
    const offers = await prisma.offer.findMany({ where: { status: 'active' }, take: 5 })
    const overdueTasks = await prisma.fulfillmentTask.count({
      where: { dueDate: { lt: new Date() }, status: { not: 'done' } },
    })
    const highChurnClients = await prisma.client.count({ where: { churnRisk: 'high', status: 'active' } })
    const pinnedNotes = await prisma.note.findMany({ where: { pinned: true }, take: 5, orderBy: { updatedAt: 'desc' } })
    const recentDecisions = await prisma.decision.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
    const weeklyPlan = await prisma.weeklyPlan.findFirst({ orderBy: { weekStartDate: 'desc' } })
    const vaTasks = await prisma.vATask.findMany({ where: { status: { not: 'archived' } } })
    const todoTasks = vaTasks.filter((t) => t.status === 'todo').length
    const doneTasks = vaTasks.filter((t) => t.status === 'done').length

    return NextResponse.json({
      clientCount,
      activeClients,
      churnedClients,
      totalMRR: totalMRR._sum.monthlyPrice || 0,
      prospectCount,
      noteCount,
      decisionCount,
      whiteboardCount,
      sopCount,
      runningExperiments: experimentCount,
      activeCampaigns: campaignCount,
      financialRecords,
      activeNiches: niches,
      activeOffers: offers,
      overdueTasks,
      highChurnClients,
      pinnedNotes,
      recentDecisions,
      weeklyPlan,
      vaTaskStats: { todo: todoTasks, done: doneTasks, total: vaTasks.length },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
