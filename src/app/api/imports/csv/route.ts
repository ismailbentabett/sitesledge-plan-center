import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { batchName, fileName, headers, rows } = body as {
      batchName?: string
      fileName?: string
      headers: string[]
      rows: Record<string, string>[]
    }

    if (!headers || !Array.isArray(headers) || headers.length === 0) {
      return NextResponse.json({ error: 'No headers provided' }, { status: 400 })
    }
    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
    }

    const batch = await prisma.importBatch.create({
      data: {
        name: batchName || fileName || `Import ${new Date().toLocaleDateString()}`,
        fileName: fileName || 'upload.csv',
        source: 'csv-upload',
        status: 'pending',
        recordCount: rows.length,
      },
    })

    const BATCH_SIZE = 500
    let created = 0

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE)
      await prisma.importedRecord.createMany({
        data: chunk.map((row) => ({
          importBatchId: batch.id,
          data: JSON.stringify(row),
          status: 'pending',
        })),
      })
      created += chunk.length
    }

    return NextResponse.json({
      batchId: batch.id,
      name: batch.name,
      recordCount: created,
      headers,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
