import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { integrationConnectionSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const connections = await prisma.integrationConnection.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(connections)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = integrationConnectionSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const connection = await prisma.integrationConnection.create({ data: validation.data })
    return NextResponse.json(connection, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
