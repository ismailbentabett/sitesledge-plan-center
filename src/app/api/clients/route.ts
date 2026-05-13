import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClientSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: { pillars: true, _count: { select: { vaTasks: true } } },
    })

    return NextResponse.json(clients)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const validation = createClientSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const client = await prisma.client.create({
      data: {
        businessName: validation.data.businessName,
        contactName: validation.data.contactName,
        email: validation.data.email,
        phone: validation.data.phone,
        businessType: validation.data.businessType,
        status: validation.data.status ?? 'prospect',
        monthlyPrice: validation.data.monthlyPrice,
        startDate: validation.data.startDate ? new Date(validation.data.startDate) : null,
        notes: validation.data.notes ?? '',
        nicheId: validation.data.nicheId ?? null,
        packageName: validation.data.packageName ?? '',
        websiteUrl: validation.data.websiteUrl ?? '',
        ghlSubaccountUrl: validation.data.ghlSubaccountUrl ?? '',
        googleBusinessProfileUrl: validation.data.googleBusinessProfileUrl ?? '',
        accessNotes: validation.data.accessNotes ?? '',
        churnRisk: validation.data.churnRisk ?? 'low',
        renewalDate: validation.data.renewalDate ? new Date(validation.data.renewalDate) : null,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
