import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { websiteTemplateSchema } from '@/lib/validations'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const templates = await prisma.websiteTemplate.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(templates)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const validation = websiteTemplateSchema.safeParse(body)
    if (!validation.success) return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 })
    const template = await prisma.websiteTemplate.create({ data: validation.data })
    return NextResponse.json(template, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
