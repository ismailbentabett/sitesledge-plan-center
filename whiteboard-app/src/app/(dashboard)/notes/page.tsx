'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

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
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  useEffect(() => { fetchNotes() }, [])

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      if (res.ok) setNotes(await res.json())
    } catch { /* ignore */ } finally { setLoading(false) }
  }

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
      }
    } catch { /* ignore */ }
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
        setNotes(notes.map((n) => n.id === id ? updated : n))
        setEditingId(null)
      }
    } catch { /* ignore */ }
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
        setNotes(notes.map((n) => n.id === note.id ? updated : n))
      }
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (res.ok) setNotes(notes.filter((n) => n.id !== id))
    } catch { /* ignore */ } finally { setDeletingId(null) }
  }

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.body.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader title="Notes" description="Quick notes with pinning and search" />

      <div className="flex gap-3 mb-4">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..."
          className="flex-1 h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      <div className="p-4 border rounded-xl bg-card space-y-3 mb-6">
        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Note title..."
          className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium" />
        <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Write your note..." rows={3}
          className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        <button onClick={handleCreate} disabled={!newTitle.trim()}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors">
          Add Note
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No notes yet" description="Create your first note above" />
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => (
            <div key={note.id} className={`p-4 border rounded-xl bg-card ${note.pinned ? 'border-primary/30' : ''}`}>
              {editingId === note.id ? (
                <div className="space-y-3">
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium" />
                  <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={4}
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(note.id)} className="text-xs text-green-600 hover:text-green-700">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {note.pinned && <span className="text-xs text-primary">📌</span>}
                      <h4 className="text-sm font-semibold">{note.title}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(note.id); setEditTitle(note.title); setEditBody(note.body) }}
                        className="text-xs text-primary hover:text-primary/80">Edit</button>
                      <button onClick={() => handlePin(note)}
                        className="text-xs text-muted-foreground hover:text-foreground">{note.pinned ? 'Unpin' : 'Pin'}</button>
                      <button onClick={() => handleDelete(note.id)} disabled={deletingId === note.id}
                        className="text-xs text-destructive hover:text-destructive/80 disabled:opacity-50">Delete</button>
                    </div>
                  </div>
                  {note.body && <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{note.body}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
