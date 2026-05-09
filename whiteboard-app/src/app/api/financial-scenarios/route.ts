import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { financialScenarioSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const scenarios = await prisma.financialScenario.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(scenarios)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = financialScenarioSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const scenario = await prisma.financialScenario.create({ data: validation.data })
    return NextResponse.json(scenario, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
