import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { importedRecordSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const records = await prisma.importedRecord.findMany({ where: { importBatchId: params.id }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(records)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = importedRecordSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const record = await prisma.importedRecord.create({ data: { ...validation.data, importBatchId: params.id } })
    return NextResponse.json(record, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
