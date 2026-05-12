'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default function MetricsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalMrr: 0,
    totalNiches: 0,
    totalOffers: 0,
    totalProspects: 0,
    totalCampaigns: 0,
    totalSOPs: 0,
    totalAutomations: 0,
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/clients').then((r) => r.ok ? r.json() : []),
      fetch('/api/niches').then((r) => r.ok ? r.json() : []),
      fetch('/api/offers').then((r) => r.ok ? r.json() : []),
      fetch('/api/pipeline').then((r) => r.ok ? r.json() : []),
      fetch('/api/outreach').then((r) => r.ok ? r.json() : []),
      fetch('/api/sops').then((r) => r.ok ? r.json() : []),
      fetch('/api/automations').then((r) => r.ok ? r.json() : []),
    ]).then(([clients, niches, offers, prospects, campaigns, sops, automations]) => {
      const activeClients = clients.filter((c: Record<string, unknown>) => c.status === 'active')
      const totalMrr = activeClients.reduce((sum: number, c: Record<string, unknown>) => sum + (c.monthlyPrice as number || 0), 0)
      setStats({
        totalClients: clients.length,
        activeClients: activeClients.length,
        totalMrr,
        totalNiches: niches.length,
        totalOffers: offers.length,
        totalProspects: prospects.length,
        totalCampaigns: campaigns.length,
        totalSOPs: sops.length,
        totalAutomations: automations.length,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  const cards = [
    { label: 'Total Clients', value: stats.totalClients, href: '/clients' },
    { label: 'Active Clients', value: stats.activeClients, href: '/clients' },
    { label: 'Total MRR', value: `$${stats.totalMrr.toLocaleString()}`, href: '/clients' },
    { label: 'Niches', value: stats.totalNiches, href: '/niches' },
    { label: 'Offers', value: stats.totalOffers, href: '/offers' },
    { label: 'Prospects', value: stats.totalProspects, href: '/pipeline' },
    { label: 'Campaigns', value: stats.totalCampaigns, href: '/outreach' },
    { label: 'SOPs', value: stats.totalSOPs, href: '/sops' },
    { label: 'Automations', value: stats.totalAutomations, href: '/automations' },
  ]

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Metrics Dashboard"
        description="Key metrics across all modules"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <button key={card.label} onClick={() => router.push(card.href)}
            className="p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors text-left">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
