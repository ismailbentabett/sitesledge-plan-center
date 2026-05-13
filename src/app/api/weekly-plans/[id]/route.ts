import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { weeklyPlanSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.weeklyPlan.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()
    const validation = weeklyPlanSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const updated = await prisma.weeklyPlan.update({ where: { id: params.id }, data: validation.data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.weeklyPlan.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.weeklyPlan.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
