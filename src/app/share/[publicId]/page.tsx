'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const BoardEditor = dynamic(
  () => import('@/components/BoardEditor'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-background text-muted-foreground">Loading board...</div> }
)

interface SharedBoard {
  id: string
  title: string
  stateJson: string
  publicId: string
}

export default function SharePage({ params }: { params: { publicId: string } }) {
  const { resolvedTheme } = useTheme()
  const router = useRouter()
  const [board, setBoard] = useState<SharedBoard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fetchBoard = useCallback(async () => {
    try {
      const res = await fetch(`/api/share/${params.publicId}`)
      if (res.ok) {
        const data = await res.json()
        setBoard(data)
      } else {
        const data = await res.json()
        setError(data.error || 'Shared board not found')
      }
    } catch {
      setError('Failed to load shared board')
    } finally {
      setLoading(false)
    }
  }, [params.publicId])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }

  const handleCreateOwn = () => {
    router.push('/register')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading board...</p>
        </div>
      </div>
    )
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Board not available</h2>
          <p className="text-sm text-muted-foreground">{error || 'This board may be private or no longer available.'}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Go home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-background border-b border-border px-4 py-2.5 flex items-center justify-between z-10 h-12 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{board.title}</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
            Read-only
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2.5 gap-1.5"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy link
              </>
            )}
          </button>

          <button
            onClick={handleCreateOwn}
            className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-7 px-2.5"
          >
            Create your own
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <BoardEditor
          boardId={board.id}
          initialState={board.stateJson !== '{}' ? board.stateJson : null}
          readOnly
          theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        />
      </div>
    </div>
  )
}
