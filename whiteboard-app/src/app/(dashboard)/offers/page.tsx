'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import StatusBadge from '@/components/ui/StatusBadge'

interface Offer {
  id: string
  name: string
  status: string
  priceMonthly: number
  targetNicheId: string | null
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  draft: 'default',
  testing: 'warning',
  active: 'success',
  paused: 'default',
  retired: 'danger',
}

export default function OffersPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchOffers() }, [])

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers')
      if (res.ok) {
        const data = await res.json()
        setOffers(data)
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' })
      if (res.ok) setOffers(offers.filter((o) => o.id !== id))
    } catch {
      alert('Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Offer Builder"
        description="Build and track offer positioning"
        action={
          <button onClick={() => router.push('/offers/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Offer
          </button>
        }
      />

      {offers.length === 0 ? (
        <EmptyState
          title="No offers yet"
          description="Create your first offer to define pricing and positioning"
          action={{ label: 'Add Offer', onClick: () => router.push('/offers/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Offer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price/mo</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Updated</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{offer.name}</td>
                  <td className="px-4 py-3">${offer.priceMonthly}/mo</td>
                  <td className="px-4 py-3"><StatusBadge label={offer.status} variant={statusColors[offer.status] || 'default'} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(offer.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/offers/${offer.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(offer.id)} disabled={deletingId === offer.id}
                        className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
