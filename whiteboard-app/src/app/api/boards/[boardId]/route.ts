import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateBoardSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const board = await prisma.board.findFirst({
      where: {
        id: params.boardId,
        ownerId: session.user.id,
      },
    })

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    return NextResponse.json(board)
  } catch (error) {
    console.error('Get board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingBoard = await prisma.board.findFirst({
      where: {
        id: params.boardId,
        ownerId: session.user.id,
      },
    })

    if (!existingBoard) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    const body = await request.json()
    const validation = updateBoardSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const updatedBoard = await prisma.board.update({
      where: { id: params.boardId },
      data: validation.data,
    })

    return NextResponse.json(updatedBoard)
  } catch (error) {
    console.error('Update board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { boardId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const existingBoard = await prisma.board.findFirst({
      where: {
        id: params.boardId,
        ownerId: session.user.id,
      },
    })

    if (!existingBoard) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 })
    }

    await prisma.board.delete({
      where: { id: params.boardId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
