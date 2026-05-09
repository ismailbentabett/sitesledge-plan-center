'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'

interface Board {
  id: string
  title: string
  isPublic: boolean
  publicId: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchBoards = async () => {
    try {
      const res = await fetch('/api/boards')
      if (res.ok) {
        const data = await res.json()
        setBoards(data)
      }
    } catch (error) {
      console.error('Failed to fetch boards:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  const createBoard = async () => {
    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Board' }),
      })

      if (res.ok) {
        const board = await res.json()
        router.push(`/boards/${board.id}`)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create board')
      }
    } catch {
      setError('An error occurred')
    } finally {
      setCreating(false)
    }
  }

  const deleteBoard = async (boardId: string) => {
    if (!confirm('Are you sure you want to delete this board? This cannot be undone.')) return

    setDeletingId(boardId)
    try {
      const res = await fetch(`/api/boards/${boardId}`, { method: 'DELETE' })
      if (res.ok) {
        setBoards(boards.filter((b) => b.id !== boardId))
      }
    } catch (error) {
      console.error('Failed to delete board:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const startRename = (board: Board) => {
    setRenamingId(board.id)
    setRenameTitle(board.title)
  }

  const saveRename = async (boardId: string) => {
    if (!renameTitle.trim()) return

    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renameTitle.trim() }),
      })

      if (res.ok) {
        setBoards(boards.map((b) => b.id === boardId ? { ...b, title: renameTitle.trim() } : b))
      }
    } catch (error) {
      console.error('Failed to rename board:', error)
    } finally {
      setRenamingId(null)
      setRenameTitle('')
    }
  }

  const cancelRename = () => {
    setRenamingId(null)
    setRenameTitle('')
  }

  const togglePublic = async (board: Board) => {
    try {
      const res = await fetch(`/api/boards/${board.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !board.isPublic }),
      })

      if (res.ok) {
        setBoards(boards.map((b) => b.id === board.id ? { ...b, isPublic: !b.isPublic } : b))
      }
    } catch (error) {
      console.error('Failed to toggle sharing:', error)
    }
  }

  const copyShareLink = (publicId: string) => {
    const url = `${window.location.origin}/share/${publicId}`
    navigator.clipboard.writeText(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Command Center</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-input hover:bg-accent transition-colors"
                title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}>
                {resolvedTheme === 'dark' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <form action={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                router.push('/login')
                router.refresh()
              }}>
                <button type="submit"
                  className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-foreground border border-input rounded-md hover:bg-accent transition-colors">
                  Lock
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Whiteboards</h1>
            <p className="text-sm text-muted-foreground mt-1">{boards.length} {boards.length === 1 ? 'board' : 'boards'}</p>
          </div>
          <button onClick={createBoard} disabled={creating}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {creating ? 'Creating...' : 'New Board'}
          </button>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        {boards.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No boards yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first board to get started</p>
            <button onClick={createBoard}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">
              Create board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div key={board.id} className="group relative border rounded-xl bg-card hover:shadow-md transition-all">
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    {renamingId === board.id ? (
                      <div className="flex-1">
                        <input type="text" value={renameTitle} onChange={(e) => setRenameTitle(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveRename(board.id); if (e.key === 'Escape') cancelRename() }}
                          className="w-full px-2 py-1 text-sm font-semibold border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" autoFocus />
                      </div>
                    ) : (
                      <h3 className="text-sm font-semibold text-foreground truncate flex-1">{board.title}</h3>
                    )}
                    {renamingId === board.id ? (
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => saveRename(board.id)} className="p-1 rounded hover:bg-accent text-green-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button onClick={cancelRename} className="p-1 rounded hover:bg-accent text-muted-foreground">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startRename(board)} className="p-1 rounded hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Updated {new Date(board.updatedAt).toLocaleDateString()}</span>
                    <span>&middot;</span>
                    <span>Created {new Date(board.createdAt).toLocaleDateString()}</span>
                  </div>

                  {board.isPublic && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Shared</span>
                      <button onClick={() => copyShareLink(board.publicId)} className="text-xs text-primary hover:text-primary/80" title="Copy share link">Copy link</button>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Link href={`/boards/${board.id}`} className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">Open</Link>
                    <button onClick={() => togglePublic(board)} className="inline-flex items-center justify-center px-3 py-2 text-sm border border-input rounded-md hover:bg-accent transition-colors">
                      {board.isPublic ? 'Unshare' : 'Share'}
                    </button>
                    <button onClick={() => deleteBoard(board.id)} disabled={deletingId === board.id}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10 transition-colors disabled:opacity-50">
                      {deletingId === board.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
