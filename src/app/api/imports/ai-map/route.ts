import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { generateJSON, withFallback } from '@/lib/ai-utils'

const TARGET_FIELDS = [
  { field: 'businessName', label: 'Business Name' },
  { field: 'ownerName', label: 'Owner Name' },
  { field: 'phone', label: 'Phone' },
  { field: 'email', label: 'Email' },
  { field: 'website', label: 'Website' },
  { field: 'niche', label: 'Niche / Industry' },
  { field: 'monthlyPrice', label: 'Monthly Price' },
  { field: 'setupFee', label: 'Setup Fee' },
  { field: 'status', label: 'Status' },
  { field: 'notes', label: 'Notes' },
  { field: 'googleRating', label: 'Google Rating' },
  { field: 'reviewCount', label: 'Review Count' },
  { field: 'packageName', label: 'Package Name' },
]

interface AIMappingResponse {
  mapping: Record<string, string>
  unmapped: string[]
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { headers } = body as { headers: string[] }

    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json({ error: 'No headers provided' }, { status: 400 })
    }

    const systemPrompt = `You are mapping CSV column headers to database fields for a business management app.

Available target fields:
${TARGET_FIELDS.map((f) => `- ${f.field}: ${f.label}`).join('\n')}

For each CSV header, determine the best matching field or return null if no match exists.
Consider common variations (e.g., "Company Name" → businessName, "Contact Person" → ownerName, "Phone Number" → phone, "Monthly Fee" → monthlyPrice).

Return ONLY a JSON object with:
- "mapping": an object mapping each CSV header to its matched field (or null)
- "unmapped": an array of CSV headers that have no match`

    const userPrompt = `CSV Headers: ${JSON.stringify(headers)}`

    const result = await withFallback(
      generateJSON<AIMappingResponse>(systemPrompt, userPrompt),
      {
        success: true,
        data: {
          mapping: Object.fromEntries(headers.map((h) => [h, ''])),
          unmapped: headers,
        },
      }
    )

    if (!result || !result.success) {
      return NextResponse.json({
        mapping: Object.fromEntries(headers.map((h) => [h, ''])),
        unmapped: headers,
        aiFallback: true,
        availableFields: TARGET_FIELDS,
      })
    }

    return NextResponse.json({
      mapping: result.data.mapping,
      unmapped: result.data.unmapped,
      aiFallback: false,
      availableFields: TARGET_FIELDS,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
