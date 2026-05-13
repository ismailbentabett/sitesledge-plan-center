import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateClientSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { clientId: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const client = await prisma.client.findUnique({ where: { id: params.clientId }, include: { pillars: true, vaTasks: true } })
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    return NextResponse.json(client)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { clientId: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.client.findUnique({ where: { id: params.clientId } })
    if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    const body = await request.json()
    const validation = updateClientSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const data: Record<string, unknown> = {}
    if (validation.data.businessName !== undefined) data.businessName = validation.data.businessName
    if (validation.data.contactName !== undefined) data.contactName = validation.data.contactName
    if (validation.data.email !== undefined) data.email = validation.data.email
    if (validation.data.phone !== undefined) data.phone = validation.data.phone
    if (validation.data.businessType !== undefined) data.businessType = validation.data.businessType
    if (validation.data.status !== undefined) data.status = validation.data.status
    if (validation.data.monthlyPrice !== undefined) data.monthlyPrice = validation.data.monthlyPrice
    if (validation.data.startDate !== undefined) data.startDate = validation.data.startDate ? new Date(validation.data.startDate) : null
    if (validation.data.churnDate !== undefined) data.churnDate = validation.data.churnDate ? new Date(validation.data.churnDate) : null
    if (validation.data.notes !== undefined) data.notes = validation.data.notes
    if (validation.data.nicheId !== undefined) data.nicheId = validation.data.nicheId
    if (validation.data.packageName !== undefined) data.packageName = validation.data.packageName
    if (validation.data.websiteUrl !== undefined) data.websiteUrl = validation.data.websiteUrl
    if (validation.data.ghlSubaccountUrl !== undefined) data.ghlSubaccountUrl = validation.data.ghlSubaccountUrl
    if (validation.data.googleBusinessProfileUrl !== undefined) data.googleBusinessProfileUrl = validation.data.googleBusinessProfileUrl
    if (validation.data.accessNotes !== undefined) data.accessNotes = validation.data.accessNotes
    if (validation.data.churnRisk !== undefined) data.churnRisk = validation.data.churnRisk
    if (validation.data.renewalDate !== undefined) data.renewalDate = validation.data.renewalDate ? new Date(validation.data.renewalDate) : null

    const updated = await prisma.client.update({ where: { id: params.clientId }, data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { clientId: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.client.findUnique({ where: { id: params.clientId } })
    if (!existing) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

    await prisma.client.delete({ where: { id: params.clientId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
