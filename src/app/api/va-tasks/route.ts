import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createVATaskSchema, updateVATaskSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const tasks = await prisma.vATask.findMany({
      orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
      include: { client: { select: { id: true, businessName: true } } },
    })

    return NextResponse.json(tasks)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const validation = createVATaskSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const task = await prisma.vATask.create({
      data: {
        title: validation.data.title,
        description: validation.data.description ?? '',
        assignedTo: validation.data.assignedTo ?? '',
        status: validation.data.status ?? 'todo',
        priority: validation.data.priority ?? 'medium',
        dueDate: validation.data.dueDate ? new Date(validation.data.dueDate) : null,
        clientId: validation.data.clientId ?? null,
        assignedVAName: validation.data.assignedVAName ?? '',
        checklist: validation.data.checklist ?? '[]',
        files: validation.data.files ?? '[]',
        qaStatus: validation.data.qaStatus ?? 'not_reviewed',
      },
      include: { client: { select: { id: true, businessName: true } } },
    })

    return NextResponse.json(task, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
