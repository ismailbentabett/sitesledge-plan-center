import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nicheSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

function calculateOpportunityScore(data: Record<string, unknown>): number {
  const scoreFields = [
    'repeatPurchasePotentialScore', 'callVolumeScore', 'reviewImportanceScore',
    'websiteQualityGapScore', 'competitionLevelScore', 'ownerSophisticationScore',
    'urgencyScore', 'easeOfFindingLeadsScore', 'easeOfFulfillmentScore',
    'retentionPotentialScore', 'affordabilityScore',
  ]
  let total = 0
  let count = 0
  for (const field of scoreFields) {
    const val = data[field]
    if (typeof val === 'number' && val >= 1 && val <= 5) {
      total += val
      count++
    }
  }
  return count > 0 ? Math.round((total / count) * 10) / 10 : 0
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const niche = await prisma.niche.findUnique({ where: { id: params.id } })
    if (!niche) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...niche, opportunityScore: calculateOpportunityScore(niche) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.niche.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()
    const validation = nicheSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const updated = await prisma.niche.update({ where: { id: params.id }, data: validation.data })
    return NextResponse.json({ ...updated, opportunityScore: calculateOpportunityScore({ ...existing, ...validation.data }) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const existing = await prisma.niche.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.niche.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
