import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { noteSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const notes = await prisma.note.findMany({ orderBy: [{ pinned: 'desc' }, { updatedAt: 'desc' }] })
    return NextResponse.json(notes)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = noteSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const note = await prisma.note.create({ data: validation.data })
    return NextResponse.json(note, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
