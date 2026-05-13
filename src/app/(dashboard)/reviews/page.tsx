'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ModulePage from '@/components/ui/ModulePage'
import DataTable, { Column } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

interface ReviewTracker {
  id: string
  clientId: string
  currentGoogleRating: number
  currentReviewCount: number
  targetReviewCount: number
  newReviewsThisMonth: number
  responseNeeded: boolean
  createdAt: string
  updatedAt: string
}

export default function ReviewsPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()
  const [trackers, setTrackers] = useState<ReviewTracker[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<ReviewTracker | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTrackers = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews')
      if (res.ok) setTrackers(await res.json())
    } catch {
      error('Failed to load review trackers')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchTrackers() }, [fetchTrackers])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/reviews/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setTrackers((prev) => prev.filter((t) => t.id !== deleteTarget.id))
        success('Tracker deleted')
      } else {
        error('Failed to delete tracker')
      }
    } catch {
      error('Failed to delete tracker')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const columns: Column<ReviewTracker>[] = [
    { key: 'clientId', label: 'Client ID', sortable: true, render: (t) => <span className="font-medium truncate block max-w-xs">{t.clientId}</span> },
    {
      key: 'currentGoogleRating',
      label: 'Rating',
      sortable: true,
      render: (t) => (
        <span className={`font-semibold ${t.currentGoogleRating >= 4.5 ? 'text-green-600' : t.currentGoogleRating >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
          {t.currentGoogleRating.toFixed(1)} ★
        </span>
      ),
    },
    { key: 'currentReviewCount', label: 'Reviews', sortable: true, render: (t) => <span>{t.currentReviewCount}</span> },
    { key: 'targetReviewCount', label: 'Target', render: (t) => <span>{t.targetReviewCount}</span> },
    { key: 'newReviewsThisMonth', label: 'This Month', sortable: true, render: (t) => <span>{t.newReviewsThisMonth}</span> },
    {
      key: 'responseNeeded',
      label: 'Action Needed',
      render: (t) => (
        t.responseNeeded ? (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">Yes</span>
        ) : (
          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">No</span>
        )
      ),
    },
  ]

  return (
    <>
      <ModulePage
        title="Review System"
        description="Track Google review progress per client"
        action={<Button onClick={() => router.push('/reviews/new')}>Add Tracker</Button>}
        loading={loading && trackers.length === 0}
      >
        <DataTable
          columns={columns}
          data={trackers}
          idKey="id"
          loading={loading}
          emptyMessage="No review trackers yet"
          actions={(tracker) => [
            { label: 'Edit', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>, onClick: () => router.push(`/reviews/${tracker.id}`) },
            { label: 'Delete', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>, onClick: () => setDeleteTarget(tracker), variant: 'danger' },
          ]}
        />
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Tracker"
        description={`Are you sure you want to delete this tracker? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
