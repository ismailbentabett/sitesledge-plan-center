import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fulfillmentTaskSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const tasks = await prisma.fulfillmentTask.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(tasks)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = fulfillmentTaskSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const task = await prisma.fulfillmentTask.create({ data: validation.data })
    return NextResponse.json(task, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
