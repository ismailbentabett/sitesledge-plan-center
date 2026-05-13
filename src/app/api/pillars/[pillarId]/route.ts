import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updatePillarSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { pillarId: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.pillar.findUnique({ where: { id: params.pillarId } })
    if (!existing) return NextResponse.json({ error: 'Pillar not found' }, { status: 404 })

    const body = await request.json()
    const validation = updatePillarSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const data: Record<string, unknown> = {}
    if (validation.data.status !== undefined) data.status = validation.data.status
    if (validation.data.notes !== undefined) data.notes = validation.data.notes
    if (validation.data.setupDate !== undefined) data.setupDate = validation.data.setupDate ? new Date(validation.data.setupDate) : null
    if (validation.data.lastReview !== undefined) data.lastReview = validation.data.lastReview ? new Date(validation.data.lastReview) : null

    const updated = await prisma.pillar.update({ where: { id: params.pillarId }, data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
