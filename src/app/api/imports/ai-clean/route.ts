import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { generateJSON, withFallback } from '@/lib/ai-utils'

interface AICleanIssue {
  rowIndex: number
  field: string
  issue: string
  suggestion: string
}

interface AICleanResponse {
  issues: AICleanIssue[]
  cleanCount: number
  warningCount: number
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { rows, mapping } = body as {
      rows: Record<string, string>[]
      mapping: Record<string, string>
    }

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ issues: [], cleanCount: 0, warningCount: 0 })
    }

    if (!mapping) {
      return NextResponse.json({ issues: [], cleanCount: 0, warningCount: 0 })
    }

    const sampleRows = rows.slice(0, 10)
    const mappedRows = sampleRows.map((row, idx) => {
      const mapped: Record<string, string> = { _index: String(idx) }
      for (const [csvHeader, dbField] of Object.entries(mapping)) {
        if (dbField && dbField !== 'null') {
          mapped[dbField] = row[csvHeader] || ''
        }
      }
      return mapped
    })

    const systemPrompt = `You are validating and cleaning imported business data.

For each row, check for these issues:
- email: Invalid format (must contain @ and .)
- phone: Too short (fewer than 10 digits), non-numeric characters
- monthlyPrice: Negative or zero, or suspiciously high (>$5000)
- setupFee: Negative or suspiciously high (>$10000)
- website: Missing http/https, invalid domain
- businessName: Empty or too short (<2 chars)
- googleRating: Outside 0-5 range
- reviewCount: Negative

Return ONLY a JSON object with:
- "issues": an array of { rowIndex: number, field: string, issue: string, suggestion: string }
- "cleanCount": number of rows with zero issues
- "warningCount": number of rows with at least one issue`

    const userPrompt = `Mapped rows: ${JSON.stringify(mappedRows)}`

    const result = await withFallback(
      generateJSON<AICleanResponse>(systemPrompt, userPrompt),
      {
        success: true,
        data: { issues: [], cleanCount: rows.length, warningCount: 0 },
      }
    )

    if (!result || !result.success) {
      return NextResponse.json({ issues: [], cleanCount: rows.length, warningCount: 0 })
    }

    return NextResponse.json(result.data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
