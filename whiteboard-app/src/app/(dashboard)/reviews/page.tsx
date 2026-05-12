'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

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
  const [trackers, setTrackers] = useState<ReviewTracker[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchTrackers() }, [])

  const fetchTrackers = async () => {
    try {
      const res = await fetch('/api/reviews')
      if (res.ok) setTrackers(await res.json())
    } catch (error) {
      console.error('Failed to fetch trackers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tracker?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) setTrackers(trackers.filter((t) => t.id !== id))
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
        title="Review System"
        description="Track Google review progress per client"
        action={
          <button onClick={() => router.push('/reviews/new')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Tracker
          </button>
        }
      />

      {trackers.length === 0 ? (
        <EmptyState
          title="No review trackers"
          description="Track review goals and progress for each client"
          action={{ label: 'Add Tracker', onClick: () => router.push('/reviews/new') }}
        />
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reviews</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Target</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">This Month</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action Needed</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trackers.map((tracker) => (
                <tr key={tracker.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium truncate max-w-xs">{tracker.clientId}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${tracker.currentGoogleRating >= 4.5 ? 'text-green-600' : tracker.currentGoogleRating >= 4 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {tracker.currentGoogleRating.toFixed(1)} ★
                    </span>
                  </td>
                  <td className="px-4 py-3">{tracker.currentReviewCount}</td>
                  <td className="px-4 py-3">{tracker.targetReviewCount}</td>
                  <td className="px-4 py-3">{tracker.newReviewsThisMonth}</td>
                  <td className="px-4 py-3">
                    {tracker.responseNeeded ? (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">Yes</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => router.push(`/reviews/${tracker.id}`)}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handleDelete(tracker.id)} disabled={deletingId === tracker.id}
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
