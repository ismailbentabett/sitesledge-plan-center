import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { generateCompletion, withFallback } from '@/lib/ai-utils'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await gatherMetrics()

    const systemPrompt = `You are a business analyst reviewing metrics for a local business marketing agency called SiteSledge that sells SEO websites, review automation, and missed-call text-back services to service businesses (roofers, HVAC, landscapers, etc).

Write a concise executive summary covering:
1. Overall business health (1 sentence)
2. Revenue and client situation (1-2 sentences)
3. Sales pipeline highlights (1 sentence)
4. Operational risk flags (1 sentence)
5. One recommended focus area for this week

Tone: Direct, actionable, no fluff. Write as if to a busy founder. Use bullet points for the recommended focus area only.
Keep the entire response under 200 words.`

    const userPrompt = `Current metrics:
- MRR: $${data.totalMRR.toLocaleString()}
- Active clients: ${data.activeClients} (${data.churnedClients} churned)
- Prospects in pipeline: ${data.prospectCount}
- Active outreach campaigns: ${data.activeCampaigns}
- Running experiments: ${data.runningExperiments}
- Overdue fulfillment tasks: ${data.overdueTasks}
- High churn risk clients: ${data.highChurnClients}
- VA tasks: ${data.vaTaskStats.todo} to do, ${data.vaTaskStats.done} done
- Content: ${data.whiteboardCount} whiteboards, ${data.noteCount} notes, ${data.decisionCount} decisions, ${data.sopCount} SOPs
- Active niches: ${data.activeNiches.map((n: { name: string }) => n.name).join(', ') || 'none'}
- Active offers: ${data.activeOffers.map((o: { name: string }) => o.name).join(', ') || 'none'}`

    const narrative = await withFallback(
      generateCompletion(systemPrompt, userPrompt),
      null
    )

    return NextResponse.json({ narrative, available: narrative !== null })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function gatherMetrics() {
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

  const overdueTasks = await prisma.fulfillmentTask.count({
    where: { dueDate: { lt: new Date() }, status: { not: 'done' } },
  })
  const highChurnClients = await prisma.client.count({ where: { churnRisk: 'high', status: 'active' } })
  const vaTasks = await prisma.vATask.findMany({ where: { status: { not: 'archived' } } })
  const todoTasks = vaTasks.filter((t) => t.status === 'todo').length
  const doneTasks = vaTasks.filter((t) => t.status === 'done').length
  const niches = await prisma.niche.findMany({ where: { status: 'active' }, take: 5 })
  const offers = await prisma.offer.findMany({ where: { status: 'active' }, take: 5 })

  return {
    totalMRR: totalMRR._sum.monthlyPrice || 0,
    activeClients,
    churnedClients,
    prospectCount,
    activeCampaigns: campaignCount,
    runningExperiments: experimentCount,
    overdueTasks,
    highChurnClients,
    vaTaskStats: { todo: todoTasks, done: doneTasks, total: vaTasks.length },
    whiteboardCount,
    noteCount,
    decisionCount,
    sopCount,
    activeNiches: niches,
    activeOffers: offers,
  }
}
