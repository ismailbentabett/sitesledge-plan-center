'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ModulePage from '@/components/ui/ModulePage'
import { ConfirmDialog } from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

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
  const { toasts, dismissToast, success, error } = useToast()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Board | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchBoards = useCallback(async () => {
    try {
      const res = await fetch('/api/boards')
      if (res.ok) setBoards(await res.json())
    } catch {
      error('Failed to load whiteboards')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchBoards() }, [fetchBoards])

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
    } catch {
      error('Failed to create whiteboard')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/boards/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setBoards((prev) => prev.filter((b) => b.id !== deleteTarget.id))
        success('Whiteboard deleted')
      } else {
        error('Failed to delete whiteboard')
      }
    } catch {
      error('Failed to delete whiteboard')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  return (
    <>
      <ModulePage
        title="Whiteboards"
        description="Visual planning canvases"
        action={<Button onClick={handleCreate} loading={creating}>New Whiteboard</Button>}
        loading={loading && boards.length === 0}
      >
        {boards.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No whiteboards yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first whiteboard to start visual planning</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div key={board.id} className="p-4 border rounded-xl bg-card card-hover group">
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
                    Updated {formatRelativeDate(board.updatedAt)}
                  </p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/boards/${board.id}`} className="text-xs text-primary hover:text-primary/80">Open</Link>
                    <button onClick={() => setDeleteTarget(board)} className="text-xs text-destructive hover:text-destructive/80">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Whiteboard"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
