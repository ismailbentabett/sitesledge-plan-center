import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

export default async function DashboardPage() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [
    activeClients, totalClients, churnedClients, pausedClients, prospectClients,
    currentFinancial, lastFinancial, openTasks, urgentTasks,
    activeNiche, activeOffer, latestWeeklyPlan, pinnedNotes, recentDecisions, boardCount,
  ] = await Promise.all([
    prisma.client.count({ where: { status: 'active' } }),
    prisma.client.count(),
    prisma.client.count({ where: { status: 'churned' } }),
    prisma.client.count({ where: { status: 'paused' } }),
    prisma.client.count({ where: { status: 'prospect' } }),
    prisma.financialRecord.findUnique({ where: { year_month: { year: currentYear, month: currentMonth } } }),
    prisma.financialRecord.findFirst({ where: { OR: [{ year: { lt: currentYear } }, { year: currentYear, month: { lt: currentMonth } }] }, orderBy: [{ year: 'desc' }, { month: 'desc' }] }),
    prisma.vATask.count({ where: { status: { in: ['todo', 'in_progress'] } } }),
    prisma.vATask.count({ where: { priority: 'urgent', status: { not: 'done' } } }),
    prisma.niche.findFirst({ where: { status: 'active' }, orderBy: { updatedAt: 'desc' } }),
    prisma.offer.findFirst({ where: { status: 'active' }, orderBy: { updatedAt: 'desc' } }),
    prisma.weeklyPlan.findFirst({ orderBy: { weekStartDate: 'desc' } }),
    prisma.note.findMany({ where: { pinned: true }, orderBy: { updatedAt: 'desc' }, take: 3 }),
    prisma.decision.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.board.count(),
  ])

  const currentMrr = currentFinancial?.mrr ?? 0
  const prevMrr = lastFinancial?.mrr ?? 0
  const mrrChange = prevMrr > 0 ? ((currentMrr - prevMrr) / prevMrr) * 100 : 0
  const targetMrr = currentFinancial?.targetMrr ?? 10000
  const targetProgress = targetMrr > 0 ? (currentMrr / targetMrr) * 100 : 0

  const activePillars = await prisma.pillar.count({ where: { status: 'active' } })
  const inProgressPillars = await prisma.pillar.count({ where: { status: 'in_progress' } })
  const notStartedPillars = await prisma.pillar.count({ where: { status: 'not_started' } })

  const recentClients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, businessName: true, status: true, monthlyPrice: true, createdAt: true } })

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Business overview for {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(currentMrr)}</p>
          {prevMrr > 0 && (
            <p className={`text-xs mt-1 ${mrrChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mrrChange >= 0 ? '+' : ''}{mrrChange.toFixed(1)}% from last month
            </p>
          )}
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Target Progress</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(currentMrr)} / {formatCurrency(targetMrr)}</p>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(targetProgress, 100)}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{targetProgress.toFixed(0)}% of target</p>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="text-2xl font-bold mt-1">{activeClients}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalClients} total &middot; {churnedClients} churned</p>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Open Tasks</p>
          <p className="text-2xl font-bold mt-1">{openTasks}</p>
          {urgentTasks > 0 && (
            <p className="text-xs text-red-600 mt-1">{urgentTasks} urgent</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Active Niche</p>
          <p className="text-lg font-bold mt-1">{activeNiche?.name || 'Not set'}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Active Offer</p>
          <p className="text-lg font-bold mt-1">{activeOffer?.name || 'Not set'}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">This Week</p>
          <p className="text-lg font-bold mt-1 truncate">{latestWeeklyPlan?.weeklyGoal || 'Not set'}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card">
          <p className="text-sm text-muted-foreground">Whiteboards</p>
          <p className="text-2xl font-bold mt-1">{boardCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <h3 className="text-sm font-semibold mb-3">Pillar Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Active</span><span className="text-sm font-medium">{activePillars}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">In Progress</span><span className="text-sm font-medium">{inProgressPillars}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Not Started</span><span className="text-sm font-medium">{notStartedPillars}</span></div>
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <h3 className="text-sm font-semibold mb-3">Client Pipeline</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Active</span><span className="text-sm font-medium">{activeClients}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Prospects</span><span className="text-sm font-medium">{prospectClients}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Paused</span><span className="text-sm font-medium">{pausedClients}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Churned</span><span className="text-sm font-medium">{churnedClients}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <h3 className="text-sm font-semibold mb-3">Pinned Notes</h3>
          {pinnedNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pinned notes</p>
          ) : (
            <div className="space-y-2">
              {pinnedNotes.map((note) => (
                <div key={note.id} className="flex items-start justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{note.title}</p>
                    {note.body && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{note.body}</p>}
                  </div>
                  <Link href="/notes" className="text-xs text-primary hover:text-primary/80 shrink-0">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <h3 className="text-sm font-semibold mb-3">Recent Decisions</h3>
          {recentDecisions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No decisions yet</p>
          ) : (
            <div className="space-y-2">
              {recentDecisions.map((d) => (
                <div key={d.id} className="flex items-start justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{d.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.status}</p>
                  </div>
                  <Link href="/decisions" className="text-xs text-primary hover:text-primary/80 shrink-0">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <h3 className="text-sm font-semibold mb-3">Recent Clients</h3>
        {recentClients.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clients yet. Add your first client.</p>
        ) : (
          <div className="space-y-2">
            {recentClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{client.businessName}</p>
                  <p className="text-xs text-muted-foreground">{client.status}</p>
                </div>
                <p className="text-sm font-medium">{formatCurrency(client.monthlyPrice)}/mo</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
