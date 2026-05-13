import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createBoardSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const boards = await prisma.board.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, isPublic: true, publicId: true, createdAt: true, updatedAt: true },
    })

    return NextResponse.json(boards)
  } catch (error) {
    console.error('Get boards error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createBoardSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const board = await prisma.board.create({
      data: { title: validation.data.title || 'Untitled Board' },
    })

    return NextResponse.json(board, { status: 201 })
  } catch (error) {
    console.error('Create board error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
