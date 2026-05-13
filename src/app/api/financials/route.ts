import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createFinancialRecordSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const records = await prisma.financialRecord.findMany({ orderBy: [{ year: 'desc' }, { month: 'desc' }] })
    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const validation = createFinancialRecordSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const record = await prisma.financialRecord.upsert({
      where: { year_month: { year: validation.data.year, month: validation.data.month } },
      update: {
        mrr: validation.data.mrr,
        newClients: validation.data.newClients ?? 0,
        churnedClients: validation.data.churnedClients ?? 0,
        churnedMrr: validation.data.churnedMrr ?? 0,
        targetMrr: validation.data.targetMrr,
        notes: validation.data.notes ?? '',
      },
      create: {
        year: validation.data.year,
        month: validation.data.month,
        mrr: validation.data.mrr,
        newClients: validation.data.newClients ?? 0,
        churnedClients: validation.data.churnedClients ?? 0,
        churnedMrr: validation.data.churnedMrr ?? 0,
        targetMrr: validation.data.targetMrr,
        notes: validation.data.notes ?? '',
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
