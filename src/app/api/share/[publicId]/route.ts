import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const board = await prisma.board.findFirst({
      where: {
        publicId: params.publicId,
        isPublic: true,
      },
      select: {
        id: true,
        title: true,
        stateJson: true,
        publicId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!board) {
      return NextResponse.json(
        { error: 'Shared board not found or is private' },
        { status: 404 }
      )
    }

    return NextResponse.json(board)
  } catch (error) {
    console.error('Get shared board error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
