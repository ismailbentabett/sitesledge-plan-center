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

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const niches = await prisma.niche.findMany({ orderBy: { createdAt: 'desc' } })
    const withScores = niches.map((n) => ({
      ...n,
      opportunityScore: calculateOpportunityScore(n),
    }))
    return NextResponse.json(withScores)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = nicheSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })

    const niche = await prisma.niche.create({ data: validation.data })
    return NextResponse.json(niche, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
