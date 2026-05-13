import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric') || 'mrr'
    const months = parseInt(searchParams.get('months') || '12', 10)

    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1)

    if (metric === 'mrr' || metric === 'clients') {
      const records = await prisma.financialRecord.findMany({
        where: {
          month: { gte: startDate.getMonth() + 1 },
          year: { gte: startDate.getFullYear() },
        },
        orderBy: [{ year: 'asc' }, { month: 'asc' }],
        take: months,
      })

      const data = records.map((r) => ({
        month: `${r.year}-${String(r.month).padStart(2, '0')}`,
        label: new Date(r.year, r.month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: metric === 'mrr' ? r.mrr : r.newClients,
        churned: r.churnedClients,
      }))

      return NextResponse.json({ metric, data })
    }

    if (metric === 'pipeline') {
      const statuses = ['lead', 'contacted', 'replied', 'interested', 'booked_call', 'no_show', 'proposal_sent', 'closed_won', 'closed_lost']
      const counts = await Promise.all(
        statuses.map(async (status) => ({
          status,
          count: await prisma.prospect.count({ where: { status } }),
        }))
      )

      return NextResponse.json({
        metric: 'pipeline',
        data: counts.map((c) => ({ status: c.status, value: c.count })),
      })
    }

    if (metric === 'campaigns') {
      const campaigns = await prisma.outreachCampaign.findMany({
        where: { status: { in: ['active', 'completed'] } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          name: true,
          sentCount: true,
          replyCount: true,
          positiveReplyCount: true,
          bookedCallCount: true,
          closedWonCount: true,
        },
      })

      return NextResponse.json({
        metric: 'campaigns',
        data: campaigns.map((c) => ({
          name: c.name,
          sent: c.sentCount,
          replies: c.replyCount,
          positive: c.positiveReplyCount,
          booked: c.bookedCallCount,
          closed: c.closedWonCount,
        })),
      })
    }

    return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
