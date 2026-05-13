'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ModulePage from '@/components/ui/ModulePage'
import DataTable, { Column } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatCurrency, formatRelativeDate } from '@/lib/formatters'

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
  const { toasts, dismissToast, success, error } = useToast()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Offer | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch('/api/offers')
      if (res.ok) setOffers(await res.json())
    } catch {
      error('Failed to load offers')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchOffers() }, [fetchOffers])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/offers/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setOffers((prev) => prev.filter((o) => o.id !== deleteTarget.id))
        success('Offer deleted')
      } else {
        error('Failed to delete offer')
      }
    } catch {
      error('Failed to delete offer')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const columns: Column<Offer>[] = [
    { key: 'name', label: 'Offer', sortable: true, render: (o) => <span className="font-medium">{o.name}</span> },
    { key: 'priceMonthly', label: 'Price/mo', sortable: true, render: (o) => <span className="font-medium">{formatCurrency(o.priceMonthly)}</span> },
    { key: 'status', label: 'Status', render: (o) => <StatusBadge label={o.status} variant={statusColors[o.status] || 'default'} /> },
    { key: 'updatedAt', label: 'Updated', sortable: true, render: (o) => <span className="text-xs text-muted-foreground">{formatRelativeDate(o.updatedAt)}</span> },
  ]

  return (
    <>
      <ModulePage
        title="Offer Builder"
        description="Build and track offer positioning"
        action={<Button onClick={() => router.push('/offers/new')}>Add Offer</Button>}
        loading={loading && offers.length === 0}
      >
        <DataTable
          columns={columns}
          data={offers}
          idKey="id"
          loading={loading}
          emptyMessage="No offers yet"
          actions={(offer) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/offers/${offer.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(offer), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Offer"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
