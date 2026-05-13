import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { outreachCampaignSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

function calcRates(c: Record<string, unknown>) {
  const sent = (c.sentCount as number) || 0
  const replies = (c.replyCount as number) || 0
  const positive = (c.positiveReplyCount as number) || 0
  const booked = (c.bookedCallCount as number) || 0
  const closed = (c.closedWonCount as number) || 0
  return {
    replyRate: sent > 0 ? Math.round((replies / sent) * 1000) / 10 : 0,
    positiveReplyRate: replies > 0 ? Math.round((positive / replies) * 1000) / 10 : 0,
    bookedCallRate: sent > 0 ? Math.round((booked / sent) * 1000) / 10 : 0,
    closeRate: booked > 0 ? Math.round((closed / booked) * 1000) / 10 : 0,
  }
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const campaign = await prisma.outreachCampaign.findUnique({ where: { id: params.id } })
    if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...campaign, ...calcRates(campaign) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.outreachCampaign.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const body = await request.json()
    const validation = outreachCampaignSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const updated = await prisma.outreachCampaign.update({ where: { id: params.id }, data: validation.data })
    return NextResponse.json({ ...updated, ...calcRates({ ...existing, ...validation.data }) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.outreachCampaign.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.outreachCampaign.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
