'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

interface Board {
  id: string
  title: string
  isPublic: boolean
  publicId: string
  createdAt: string
  updatedAt: string
}

export default function WhiteboardsPage() {
  const router = useRouter()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { fetchBoards() }, [])

  const fetchBoards = async () => {
    try {
      const res = await fetch('/api/boards')
      if (res.ok) setBoards(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Board' }),
      })
      if (res.ok) {
        const saved = await res.json()
        router.push(`/boards/${saved.id}`)
      }
    } catch { /* ignore */ } finally { setCreating(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this whiteboard? This cannot be undone.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/boards/${id}`, { method: 'DELETE' })
      if (res.ok) setBoards(boards.filter((b) => b.id !== id))
    } catch { /* ignore */ } finally { setDeletingId(null) }
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-6xl">
      <PageHeader
        title="Whiteboards"
        description="Visual planning canvases"
        action={
          <button onClick={handleCreate} disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {creating ? 'Creating...' : 'New Whiteboard'}
          </button>
        }
      />

      {boards.length === 0 ? (
        <EmptyState
          title="No whiteboards yet"
          description="Create your first whiteboard to start visual planning"
          action={{ label: 'New Whiteboard', onClick: handleCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div key={board.id} className="p-4 border rounded-xl bg-card hover:border-primary/30 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <Link href={`/boards/${board.id}`} className="text-sm font-semibold hover:text-primary truncate flex-1">
                  {board.title}
                </Link>
                {board.isPublic && (
                  <span className="text-xs text-green-600 shrink-0 ml-2">Public</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(board.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/boards/${board.id}`}
                    className="text-xs text-primary hover:text-primary/80">Open</Link>
                  <button onClick={() => handleDelete(board.id)} disabled={deletingId === board.id}
                    className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
