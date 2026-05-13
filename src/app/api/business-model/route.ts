import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { businessModelSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const model = await prisma.businessModel.findFirst({ orderBy: { updatedAt: 'desc' } })
    return NextResponse.json(model)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = businessModelSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const existing = await prisma.businessModel.findFirst()
    if (existing) return NextResponse.json({ error: 'Business model already exists. Use PATCH to update.' }, { status: 409 })

    const model = await prisma.businessModel.create({ data: validation.data })
    return NextResponse.json(model, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
