import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const [activeClients, currentMRR, prevMRR, churnRate, avgClientValue, newThisMonth, churnedThisMonth] = await Promise.all([
      prisma.client.count({ where: { status: 'active' } }),
      prisma.client.aggregate({ where: { status: 'active' }, _sum: { monthlyPrice: true } }),
      (async () => {
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear
        const prevClients = await prisma.client.findMany({ where: { status: 'active', startDate: { lte: new Date(lastMonthYear, lastMonth - 1, 1) } } })
        return prevClients.reduce((sum, c) => sum + c.monthlyPrice, 0)
      })(),
      (async () => {
        const totalEver = await prisma.client.count()
        const churned = await prisma.client.count({ where: { status: 'churned' } })
        return totalEver > 0 ? (churned / totalEver) * 100 : 0
      })(),
      (async () => {
        const active = await prisma.client.findMany({ where: { status: 'active' } })
        return active.length > 0 ? active.reduce((sum, c) => sum + c.monthlyPrice, 0) / active.length : 0
      })(),
      prisma.client.count({ where: { status: 'active', startDate: { gte: new Date(currentYear, currentMonth - 1, 1) } } }),
      prisma.client.count({ where: { status: 'churned', churnDate: { gte: new Date(currentYear, currentMonth - 1, 1) } } }),
    ])

    return Response.json({
      activeClients,
      currentMRR: currentMRR._sum.monthlyPrice ?? 0,
      prevMRR,
      churnRate,
      avgClientValue: Math.round(avgClientValue),
      newThisMonth,
      churnedThisMonth,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
