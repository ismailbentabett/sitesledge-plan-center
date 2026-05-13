'use client'

import { useState, useEffect, useCallback } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import Button from '@/components/ui/Button'
import SearchInput from '@/components/ui/SearchInput'
import { ConfirmDialog } from '@/components/ui/Dialog'
import { useToast, ToastContainer } from '@/components/Toast'
import { formatRelativeDate } from '@/lib/formatters'

interface Note {
  id: string
  title: string
  body: string
  tags: string
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export default function NotesPage() {
  const { toasts, dismissToast, success, error } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/api/notes')
      if (res.ok) setNotes(await res.json())
    } catch {
      error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [error])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), body: newBody }),
      })
      if (res.ok) {
        const saved = await res.json()
        setNotes([saved, ...notes])
        setNewTitle('')
        setNewBody('')
        success('Note created')
      }
    } catch {
      error('Failed to create note')
    }
  }

  const handleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, body: editBody }),
      })
      if (res.ok) {
        const updated = await res.json()
        setNotes(notes.map((n) => (n.id === id ? updated : n)))
        setEditingId(null)
        success('Note updated')
      }
    } catch {
      error('Failed to save note')
    }
  }

  const handlePin = async (note: Note) => {
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !note.pinned }),
      })
      if (res.ok) {
        const updated = await res.json()
        setNotes(notes.map((n) => (n.id === note.id ? updated : n)))
      }
    } catch {
      error('Failed to update note')
    }
  }

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/notes/${deleteTarget.id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== deleteTarget.id))
        success('Note deleted')
      } else {
        error('Failed to delete note')
      }
    } catch {
      error('Failed to delete note')
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, success, error])

  const filtered = notes
    .filter((n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-4xl mx-auto animate-fade-in">
        <div className="space-y-2"><div className="h-8 w-32 bg-muted rounded animate-pulse-skeleton" /><div className="h-4 w-64 bg-muted rounded animate-pulse-skeleton" /></div>
        <div className="h-10 bg-muted rounded-xl animate-pulse-skeleton" />
        <div className="h-32 bg-muted rounded-xl animate-pulse-skeleton" />
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse-skeleton" />)}</div>
      </div>
    )
  }

  return (
    <>
      <ModulePage
        title="Notes"
        description="Quick notes with pinning and search"
        action={
          <Button onClick={() => document.getElementById('new-note-title')?.focus()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Note
          </Button>
        }
      >
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search notes..." />

        {/* New Note */}
        <div className="p-4 border rounded-xl bg-card space-y-3">
          <input
            id="new-note-title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
          />
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Write your note..."
            rows={3}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={handleCreate} disabled={!newTitle.trim()}>Add Note</Button>
        </div>

        {/* Notes List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No notes found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((note) => (
              <div key={note.id} className={`p-4 border rounded-xl bg-card transition-all duration-150 card-hover ${note.pinned ? 'border-primary/30 shadow-sm' : ''}`}>
                {editingId === note.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
                    />
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => handleSave(note.id)}>Save</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {note.pinned && (
                          <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                          </svg>
                        )}
                        <h4 className="text-sm font-semibold">{note.title}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePin(note)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          aria-label={note.pinned ? 'Unpin' : 'Pin'}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H12M7.5 3.75h4.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => { setEditingId(note.id); setEditTitle(note.title); setEditBody(note.body) }}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          aria-label="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(note)}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          aria-label="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {note.body && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{note.body}</p>}
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{formatRelativeDate(note.updatedAt)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ModulePage>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Note"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
