import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { isAIEnabled } from '@/lib/openai'

export async function GET() {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ enabled: isAIEnabled() })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
