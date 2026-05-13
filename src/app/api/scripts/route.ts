import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scriptSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const scripts = await prisma.script.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(scripts)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = scriptSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const script = await prisma.script.create({ data: validation.data })
    return NextResponse.json(script, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
