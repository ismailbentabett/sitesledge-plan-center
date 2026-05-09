'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { ToastContainer, useToast } from '@/components/Toast'

const BoardEditor = dynamic(
  () => import('@/components/BoardEditor'),
  {
    ssr: false,
    loading: () => <SkeletonLoader />,
  }
)

function SkeletonLoader() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <nav className="border-b bg-card h-16 shrink-0 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-5 bg-muted rounded animate-pulse-skeleton" />
          <div className="w-32 h-6 bg-muted rounded animate-pulse-skeleton" />
          <div className="w-16 h-5 bg-muted rounded-full animate-pulse-skeleton" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-8 bg-muted rounded-md animate-pulse-skeleton" />
          <div className="w-9 h-9 bg-muted rounded-md animate-pulse-skeleton" />
        </div>
      </nav>
      <div className="flex-1 bg-muted/50 animate-pulse-skeleton" />
    </div>
  )
}

interface Board {
  id: string
  title: string
  stateJson: string
  isPublic: boolean
  publicId: string
}

export default function BoardPage({ params }: { params: { boardId: string } }) {
  const { status } = useSession()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { toasts, dismissToast, success, error: showError, info } = useToast()
  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [showSharePopover, setShowSharePopover] = useState(false)
  const [copied, setCopied] = useState(false)
  const sharePopoverRef = useRef<HTMLDivElement>(null)
  const saveTriggerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const fetchBoard = useCallback(async () => {
    try {
      const res = await fetch(`/api/boards/${params.boardId}`)
      if (res.ok) {
        const data = await res.json()
        setBoard(data)
        setTitleInput(data.title)
      } else {
        setError('Board not found')
      }
    } catch {
      setError('Failed to load board')
    } finally {
      setLoading(false)
    }
  }, [params.boardId])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchBoard()
    }
  }, [status, fetchBoard])

  useEffect(() => {
    if (saveStatus === 'saved' && board) {
      success('Board saved')
    } else if (saveStatus === 'error') {
      showError('Failed to save board')
    }
  }, [saveStatus, board, success, showError])

  const handleSaveTitle = async () => {
    if (!board || !titleInput.trim()) return

    try {
      const res = await fetch(`/api/boards/${board.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleInput.trim() }),
      })

      if (res.ok) {
        setBoard({ ...board, title: titleInput.trim() })
      }
    } catch {
      showError('Failed to rename board')
    } finally {
      setEditingTitle(false)
    }
  }

  const handleToggleShare = async () => {
    if (!board) return

    try {
      const res = await fetch(`/api/boards/${board.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !board.isPublic }),
      })

      if (res.ok) {
        const updated = await res.json()
        setBoard(updated)
        if (updated.isPublic) {
          info('Board is now publicly shared')
        } else {
          info('Board is now private')
          setShowSharePopover(false)
        }
      }
    } catch {
      showError('Failed to update sharing')
    }
  }

  const copyShareLink = useCallback(() => {
    if (!board) return
    const url = `${window.location.origin}/share/${board.publicId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }, [board, success])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sharePopoverRef.current && !sharePopoverRef.current.contains(e.target as Node)) {
        setShowSharePopover(false)
      }
    }
    if (showSharePopover) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSharePopover])

  const handleManualSave = useCallback(() => {
    saveTriggerRef.current?.()
  }, [])

  if (status === 'loading' || loading) {
    return <SkeletonLoader />
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-2">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-destructive font-medium">{error || 'Board not found'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const shareUrl = `${window.location.origin}/share/${board.publicId}`

  return (
    <div className="h-screen flex flex-col bg-background">
      <nav className="border-b bg-card h-16 shrink-0 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Boards</span>
          </Link>

          <div className="w-px h-6 bg-border" />

          {editingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle()
                if (e.key === 'Escape') {
                  setEditingTitle(false)
                  setTitleInput(board.title)
                }
              }}
              className="text-sm font-medium px-2 py-1 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring w-40 sm:w-56"
              autoFocus
            />
          ) : (
            <button
              className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:bg-accent px-2 py-1 rounded-md transition-colors group min-w-0"
              onClick={() => setEditingTitle(true)}
              title="Click to rename"
            >
              <span className="truncate max-w-[120px] sm:max-w-[200px]">{board.title}</span>
              <svg className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}

          <SaveStatusBadge status={saveStatus} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={sharePopoverRef}>
            <button
              onClick={() => setShowSharePopover(!showSharePopover)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                board.isPublic
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'border border-input hover:bg-accent'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden sm:inline">{board.isPublic ? 'Shared' : 'Share'}</span>
            </button>

            {showSharePopover && board.isPublic && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                <p className="text-sm font-medium text-foreground mb-2">Share this board</p>
                <p className="text-xs text-muted-foreground mb-3">Anyone with this link can view the board in read-only mode.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 h-9 px-3 text-xs border border-input rounded-md bg-background text-muted-foreground focus:outline-none"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={copyShareLink}
                    className="inline-flex items-center justify-center px-3 h-9 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shrink-0"
                  >
                    {copied ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  onClick={handleToggleShare}
                  className="mt-3 w-full text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  Disable sharing
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-input hover:bg-accent transition-colors disabled:opacity-50"
            title="Save (Ctrl+S)"
          >
            {saveStatus === 'saving' ? (
              <svg className="w-4 h-4 animate-spin-custom" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-input hover:bg-accent transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
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
        </div>
      </nav>

      <div className="flex-1 relative">
        <BoardEditor
          boardId={board.id}
          initialState={board.stateJson !== '{}' ? board.stateJson : null}
          onSaveStatus={setSaveStatus}
          onManualSave={saveTriggerRef.current ? undefined : undefined}
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function SaveStatusBadge({ status }: { status: 'saved' | 'saving' | 'unsaved' | 'error' }) {
  const config = {
    saved: {
      text: 'Saved',
      className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      icon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    saving: {
      text: 'Saving...',
      className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      icon: (
        <svg className="w-3 h-3 animate-spin-custom" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
    },
    unsaved: {
      text: 'Unsaved',
      className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      icon: <div className="w-2 h-2 rounded-full bg-current" />,
    },
    error: {
      text: 'Error',
      className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      icon: (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  }

  const current = config[status]

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${current.className}`}>
      {current.icon}
      <span className="hidden sm:inline">{current.text}</span>
    </span>
  )
}
