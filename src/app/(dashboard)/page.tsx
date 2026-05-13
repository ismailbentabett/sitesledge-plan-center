import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ToolModuleCard } from './ToolModuleCard'

export const dynamic = 'force-dynamic'

interface ToolModule {
  name: string
  href: string
  icon: string
  color: string
  description: string
  comingSoon?: boolean
}

interface ToolCategory {
  label: string
  description: string
  comingSoon?: boolean
  modules: ToolModule[]
}

const toolHubCategories: ToolCategory[] = [
  {
    label: 'Planning',
    description: 'Business strategy and financial planning',
    modules: [
      { name: 'Business Model', href: '/business-model', icon: 'model', color: 'bg-cat-plan', description: 'Define your business structure' },
      { name: 'Niches', href: '/niches', icon: 'niches', color: 'bg-cat-plan/80', description: 'Target market analysis' },
      { name: 'Offers', href: '/offers', icon: 'offers', color: 'bg-cat-plan/70', description: 'Service packages and pricing' },
      { name: 'Financial Model', href: '/financial-model', icon: 'financials', color: 'bg-cat-plan/60', description: 'Revenue projections and tracking' },
      { name: 'Weekly Planning', href: '/weekly-planning', icon: 'planning', color: 'bg-cat-plan/50', description: 'Weekly goals and priorities' },
    ],
  },
  {
    label: 'Workspace',
    description: 'Creative and decision tools',
    modules: [
      { name: 'Whiteboards', href: '/whiteboards', icon: 'whiteboards', color: 'bg-cat-workspace', description: 'Visual brainstorming canvas' },
      { name: 'Notes', href: '/notes', icon: 'notes', color: 'bg-cat-workspace/80', description: 'Quick notes and references' },
      { name: 'Decision Log', href: '/decisions', icon: 'decisions', color: 'bg-cat-workspace/70', description: 'Track key business decisions' },
    ],
  },
  {
    label: 'Sales',
    description: 'Outreach, pipeline, and conversion',
    modules: [
      { name: 'Outreach', href: '/outreach', icon: 'outreach', color: 'bg-cat-sales', description: 'Prospect outreach campaigns' },
      { name: 'Scripts', href: '/scripts', icon: 'scripts', color: 'bg-cat-sales/80', description: 'Sales call scripts and templates' },
      { name: 'Pipeline', href: '/pipeline', icon: 'pipeline', color: 'bg-cat-sales/70', description: 'Deal tracking and management' },
      { name: 'Experiments', href: '/experiments', icon: 'experiments', color: 'bg-cat-sales/60', description: 'A/B tests and experiments' },
      { name: 'Funnels', href: '/funnels', icon: 'funnels', color: 'bg-cat-sales/50', description: 'Conversion funnel analysis' },
    ],
  },
  {
    label: 'Clients',
    description: 'Client management and fulfillment',
    modules: [
      { name: 'Clients', href: '/clients', icon: 'clients', color: 'bg-cat-clients', description: 'Client directory and MRR' },
      { name: 'Fulfillment', href: '/fulfillment', icon: 'fulfillment', color: 'bg-cat-clients/80', description: 'Service delivery tracking' },
      { name: 'SOPs', href: '/sops', icon: 'sops', color: 'bg-cat-clients/70', description: 'Standard operating procedures' },
      { name: 'VA Tasks', href: '/va-tasks', icon: 'tasks', color: 'bg-cat-clients/60', description: 'Virtual assistant assignments' },
    ],
  },
  {
    label: 'Systems',
    description: 'Automation and templates',
    modules: [
      { name: 'Automations', href: '/automations', icon: 'automations', color: 'bg-cat-systems', description: 'Workflow automations' },
      { name: 'Templates', href: '/website-templates', icon: 'templates', color: 'bg-cat-systems/80', description: 'Website templates library' },
      { name: 'Reviews', href: '/reviews', icon: 'reviews', color: 'bg-cat-systems/70', description: 'Review management system' },
      { name: 'Retention', href: '/retention', icon: 'retention', color: 'bg-cat-systems/60', description: 'Client retention strategies' },
    ],
  },
  {
    label: 'Coming Soon',
    description: 'In development',
    comingSoon: true,
    modules: [
      { name: 'Imports', href: '/imports', icon: 'imports', color: 'bg-muted', description: 'Bulk data import tools', comingSoon: true },
      { name: 'Metrics', href: '/metrics', icon: 'metrics', color: 'bg-muted', description: 'KPI dashboards', comingSoon: true },
      { name: 'Reports', href: '/reports', icon: 'reports', color: 'bg-muted', description: 'Automated reporting', comingSoon: true },
      { name: 'Integrations', href: '/integrations', icon: 'integrations', color: 'bg-muted', description: 'Third-party connections', comingSoon: true },
    ],
  },
]

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

export default async function ToolHubPage() {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const hour = now.getHours()

  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [activeClients, currentFinancial, openTasks, urgentTasks] = await Promise.all([
    prisma.client.count({ where: { status: 'active' } }),
    prisma.financialRecord.findUnique({ where: { year_month: { year: currentYear, month: currentMonth } } }),
    prisma.vATask.count({ where: { status: { in: ['todo', 'in_progress'] } } }),
    prisma.vATask.count({ where: { priority: 'urgent', status: { not: 'done' } } }),
  ])

  const currentMrr = currentFinancial?.mrr ?? 0

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground">Here are your tools. Pick one to get started.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(currentMrr)}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Active Clients</p>
          <p className="text-2xl font-bold mt-1">{activeClients}</p>
        </div>
        <div className="p-4 border rounded-xl bg-card shadow-sm">
          <p className="text-sm text-muted-foreground">Open Tasks</p>
          <p className="text-2xl font-bold mt-1">{openTasks}</p>
          {urgentTasks > 0 && (
            <p className="text-xs text-destructive mt-1">{urgentTasks} urgent</p>
          )}
        </div>
      </div>

      {/* Tool Categories */}
      {toolHubCategories.map((category) => (
        <div key={category.label} className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{category.label}</h2>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {category.modules.map((module) => (
              <ToolModuleCard key={module.name} module={module} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
