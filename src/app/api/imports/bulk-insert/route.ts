import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

const ALLOWED_TARGETS = ['client', 'prospect'] as const

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { batchId, targetModel, mapping, rows } = body as {
      batchId: string
      targetModel: string
      mapping: Record<string, string>
      rows: Record<string, string>[]
    }

    if (!batchId) {
      return NextResponse.json({ error: 'batchId is required' }, { status: 400 })
    }
    if (!targetModel || !ALLOWED_TARGETS.includes(targetModel as typeof ALLOWED_TARGETS[number])) {
      return NextResponse.json({ error: `targetModel must be one of: ${ALLOWED_TARGETS.join(', ')}` }, { status: 400 })
    }
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
    }

    const mappedRows = rows.map((row) => {
      const mapped: Record<string, string> = {}
      for (const [csvHeader, dbField] of Object.entries(mapping || {})) {
        if (dbField && dbField !== 'null') {
          mapped[dbField] = row[csvHeader] || ''
        }
      }
      return mapped
    })

    let inserted = 0
    const skipped = 0
    const errors: string[] = []

    if (targetModel === 'client') {
      for (const row of mappedRows) {
        try {
          await prisma.client.create({
            data: {
              businessName: row.businessName || 'Unknown Business',
              contactName: row.ownerName || row.contactName || '',
              phone: row.phone || '',
              email: row.email || '',
              websiteUrl: row.website || '',
              businessType: row.niche || '',
              monthlyPrice: parseInt(row.monthlyPrice, 10) || 0,
              status: (['prospect', 'active', 'onboarding', 'at_risk', 'paused', 'churned'].includes(row.status || '') ? row.status : 'prospect') as string,
              notes: row.notes || '',
              packageName: row.packageName || '',
            },
          })
          inserted++
        } catch (err) {
          errors.push(`Row ${inserted + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          if (errors.length >= 10) break
        }
      }
    } else if (targetModel === 'prospect') {
      for (const row of mappedRows) {
        try {
          await prisma.prospect.create({
            data: {
              businessName: row.businessName || 'Unknown Business',
              ownerName: row.ownerName || '',
              phone: row.phone || '',
              email: row.email || '',
              website: row.website || '',
              googleRating: parseFloat(row.googleRating) || null,
              reviewCount: parseInt(row.reviewCount, 10) || null,
              status: (['new', 'lead', 'contacted', 'replied', 'interested', 'booked_call', 'no_show', 'proposal_sent', 'closed_won', 'closed_lost', 'follow_up_later'].includes(row.status || '') ? row.status : 'new') as string,
              notes: row.notes || '',
              expectedMonthlyValue: parseInt(row.monthlyPrice, 10) || 0,
            },
          })
          inserted++
        } catch (err) {
          errors.push(`Row ${inserted + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          if (errors.length >= 10) break
        }
      }
    }

    await prisma.importBatch.update({
      where: { id: batchId },
      data: { status: 'completed', recordCount: inserted },
    })

    return NextResponse.json({ inserted, skipped, errors })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
