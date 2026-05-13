import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { weeklyPlanSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const plans = await prisma.weeklyPlan.findMany({ orderBy: { weekStartDate: 'desc' } })
    return NextResponse.json(plans)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = weeklyPlanSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const plan = await prisma.weeklyPlan.create({ data: validation.data })
    return NextResponse.json(plan, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
