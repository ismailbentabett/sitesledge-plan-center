import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateVATaskSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.vATask.findUnique({ where: { id: params.taskId } })
    if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const body = await request.json()
    const validation = updateVATaskSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const data: Record<string, unknown> = {}
    if (validation.data.title !== undefined) data.title = validation.data.title
    if (validation.data.description !== undefined) data.description = validation.data.description
    if (validation.data.assignedTo !== undefined) data.assignedTo = validation.data.assignedTo
    if (validation.data.status !== undefined) data.status = validation.data.status
    if (validation.data.priority !== undefined) data.priority = validation.data.priority
    if (validation.data.dueDate !== undefined) data.dueDate = validation.data.dueDate ? new Date(validation.data.dueDate) : null
    if (validation.data.clientId !== undefined) data.clientId = validation.data.clientId

    const updated = await prisma.vATask.update({ where: { id: params.taskId }, data, include: { client: { select: { id: true, businessName: true } } } })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.vATask.findUnique({ where: { id: params.taskId } })
    if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    await prisma.vATask.delete({ where: { id: params.taskId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
