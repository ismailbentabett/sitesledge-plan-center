import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { businessModelSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.businessModel.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()
    const validation = businessModelSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const updated = await prisma.businessModel.update({ where: { id: params.id }, data: validation.data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
