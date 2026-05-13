import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { reviewTrackerSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const trackers = await prisma.reviewTracker.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(trackers)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = reviewTrackerSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const tracker = await prisma.reviewTracker.create({ data: validation.data })
    return NextResponse.json(tracker, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
