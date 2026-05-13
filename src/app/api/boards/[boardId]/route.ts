import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateBoardSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const board = await prisma.board.findUnique({ where: { id: params.boardId } })
    if (!board) { return NextResponse.json({ error: 'Board not found' }, { status: 404 }) }

    return NextResponse.json(board)
  } catch (error) {
    console.error('Get board error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingBoard = await prisma.board.findUnique({ where: { id: params.boardId } })
    if (!existingBoard) { return NextResponse.json({ error: 'Board not found' }, { status: 404 }) }

    const body = await request.json()
    const validation = updateBoardSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    }

    const updatedBoard = await prisma.board.update({ where: { id: params.boardId }, data: validation.data })
    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error('Update board error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingBoard = await prisma.board.findUnique({ where: { id: params.boardId } })
    if (!existingBoard) { return NextResponse.json({ error: 'Board not found' }, { status: 404 }) }

    await prisma.board.delete({ where: { id: params.boardId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete board error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
