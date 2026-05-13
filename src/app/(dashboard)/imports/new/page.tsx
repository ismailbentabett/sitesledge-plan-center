'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { useToast, ToastContainer } from '@/components/Toast'

interface FieldOption {
  field: string
  label: string
}

const TARGET_MODELS = [
  { value: 'client', label: 'Clients' },
  { value: 'prospect', label: 'Prospects' },
]

const DEFAULT_FIELDS: FieldOption[] = [
  { field: 'businessName', label: 'Business Name' },
  { field: 'ownerName', label: 'Owner Name' },
  { field: 'phone', label: 'Phone' },
  { field: 'email', label: 'Email' },
  { field: 'website', label: 'Website' },
  { field: 'monthlyPrice', label: 'Monthly Price' },
  { field: 'status', label: 'Status' },
  { field: 'notes', label: 'Notes' },
]

export default function NewImportPage() {
  const router = useRouter()
  const { toasts, dismissToast, success, error } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([])

  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [availableFields, setAvailableFields] = useState<FieldOption[]>([])
  const [aiMappingLoading, setAiMappingLoading] = useState(false)
  const [aiMappingDone, setAiMappingDone] = useState(false)
  const [aiFallback, setAiFallback] = useState(false)

  const [cleaningIssues, setCleaningIssues] = useState<Array<{ rowIndex: number; field: string; issue: string; suggestion: string; accepted: boolean }>>([])
  const [aiCleanLoading, setAiCleanLoading] = useState(false)
  const [aiCleanDone, setAiCleanDone] = useState(false)

  const [targetModel, setTargetModel] = useState('client')
  const [step, setStep] = useState<'upload' | 'preview' | 'importing'>('upload')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ inserted: number; errors: string[] } | null>(null)

  const processFile = useCallback((f: File) => {
    if (!f.name.endsWith('.csv')) {
      error('Please select a .csv file')
      return
    }
    setFile(f)

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      preview: 5000,
      complete(results) {
        if (results.errors.length > 0 && results.data.length === 0) {
          error(`CSV parsing error: ${results.errors[0].message}`)
          return
        }
        const h = results.meta.fields || []
        const data = results.data as Record<string, string>[]
        setHeaders(h)
        setRows(data)
        setPreviewRows(data.slice(0, 10))
        setMapping(Object.fromEntries(h.map((k) => [k, ''])))
        setAvailableFields([])
        setAiMappingDone(false)
        setAiFallback(false)
        setCleaningIssues([])
        setAiCleanDone(false)
        setImportResult(null)
        setStep('preview')
        success(`Parsed ${data.length} rows, ${h.length} columns`)
      },
      error(err) {
        error(`Failed to read CSV: ${err.message}`)
      },
    })
  }, [error, success])

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const handleAIMapping = async () => {
    setAiMappingLoading(true)
    try {
      const res = await fetch('/api/imports/ai-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headers }),
      })
      if (!res.ok) throw new Error('Failed to get AI mapping')
      const data = await res.json()
      setMapping(data.mapping)
      setAvailableFields(data.availableFields || [])
      setAiFallback(data.aiFallback || false)
      setAiMappingDone(true)
      if (data.aiFallback) {
        success('Column mapping ready (set OPENAI_API_KEY for AI auto-mapping)')
      } else {
        success('AI column mapping complete')
      }
    } catch {
      error('AI mapping failed')
    } finally {
      setAiMappingLoading(false)
    }
  }

  const handleAIClean = async () => {
    setAiCleanLoading(true)
    try {
      const res = await fetch('/api/imports/ai-clean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows, mapping }),
      })
      if (!res.ok) throw new Error('Failed to clean data')
      const data = await res.json()
      setCleaningIssues((data.issues || []).map((i: { rowIndex: number; field: string; issue: string; suggestion: string }) => ({
        ...i,
        accepted: false,
      })))
      setAiCleanDone(true)
      if (data.issues && data.issues.length === 0) {
        success(`All ${data.cleanCount} rows look clean`)
      } else {
        success(`${data.warningCount} rows have issues — review below`)
      }
    } catch {
      error('AI cleaning failed')
    } finally {
      setAiCleanLoading(false)
    }
  }

  const toggleIssue = (idx: number) => {
    setCleaningIssues((prev) => prev.map((issue, i) =>
      i === idx ? { ...issue, accepted: !issue.accepted } : issue
    ))
  }

  const handleImport = async () => {
    setImporting(true)
    setStep('importing')
    try {
      const res = await fetch('/api/imports/bulk-insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: '__direct__',
          targetModel,
          mapping,
          rows,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Import failed')
      }
      const result = await res.json()
      setImportResult(result)
      success(`Imported ${result.inserted} ${targetModel === 'client' ? 'clients' : 'prospects'}`)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Import failed')
      setStep('preview')
    } finally {
      setImporting(false)
    }
  }

  const updateMapping = (csvHeader: string, dbField: string) => {
    setMapping((prev) => ({ ...prev, [csvHeader]: dbField }))
  }

  const mappedCount = Object.values(mapping).filter((v) => v && v !== 'null').length
  const hasMappings = mappedCount > 0
  const fieldsToShow = availableFields.length > 0 ? availableFields : DEFAULT_FIELDS

  if (step === 'upload') {
    return (
      <div className="p-6 max-w-4xl">
        <PageHeader title="Upload CSV" description="Import data from a CSV file" action={<Button variant="outline" onClick={() => router.push('/imports')}>Back</Button>} />
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => document.getElementById('csv-file-input')?.click()}
          className="mt-6 p-12 border-2 border-dashed rounded-xl bg-card text-center cursor-pointer hover:border-primary/50 hover:bg-accent/5 transition-colors"
        >
          <svg className="w-10 h-10 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium">Drop a CSV file here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">.csv files only</p>
          <input id="csv-file-input" type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f) }} />
        </div>
        {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title={file ? `Import: ${file.name}` : 'Upload CSV'}
        description={`${rows.length} rows, ${headers.length} columns`}
        action={<Button variant="outline" onClick={() => router.push('/imports')}>Back</Button>}
      />

      <div className="p-4 border rounded-xl bg-card">
        <h3 className="text-sm font-semibold mb-3">Target Model</h3>
        <div className="flex items-center gap-4">
          <select
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value)}
            className="h-10 px-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {TARGET_MODELS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <h3 className="text-sm font-semibold mb-3">CSV Preview (first 10 of {rows.length} rows)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground w-8">#</th>
                {headers.map((h) => (
                  <th key={h} className="text-left py-2 px-3 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
                  {headers.map((h) => (
                    <td key={h} className="py-2 px-3 whitespace-nowrap max-w-xs truncate">{row[h] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Column Mapping ({mappedCount}/{headers.length} mapped)</h3>
            <Button size="sm" variant="outline" onClick={handleAIMapping} loading={aiMappingLoading}>
              {aiMappingDone ? 'Re-Analyze' : 'AI Auto-Map'}
            </Button>
          </div>
          {aiFallback && (
            <p className="text-xs text-muted-foreground mb-3">Set OPENAI_API_KEY to enable AI auto-mapping</p>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {headers.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <span className="text-sm w-1/2 truncate" title={h}>{h}</span>
                <span className="text-muted-foreground text-xs">&rarr;</span>
                <select
                  value={mapping[h] || ''}
                  onChange={(e) => updateMapping(h, e.target.value)}
                  className="flex-1 h-9 px-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">— Skip —</option>
                  {fieldsToShow.map((f) => (
                    <option key={f.field} value={f.field}>{f.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Data Quality</h3>
            <Button size="sm" variant="outline" onClick={handleAIClean} loading={aiCleanLoading}>
              {aiCleanDone ? 'Re-Check' : 'AI Check'}
            </Button>
          </div>
          {cleaningIssues.length === 0 && aiCleanDone && (
            <p className="text-sm text-green-600">All rows look clean</p>
          )}
          {cleaningIssues.length === 0 && !aiCleanDone && (
            <p className="text-sm text-muted-foreground">Click &quot;AI Check&quot; to validate data quality</p>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {cleaningIssues.map((issue, idx) => (
              <div key={idx} className={`p-3 rounded-lg border text-sm ${issue.accepted ? 'opacity-50 bg-muted/30' : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'}`}>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked={issue.accepted} onChange={() => toggleIssue(idx)} className="mt-0.5" />
                  <div>
                    <p className="font-medium">Row {issue.rowIndex + 1}, {issue.field}</p>
                    <p className="text-muted-foreground">{issue.issue}</p>
                    {issue.suggestion && <p className="text-xs text-primary mt-1">Suggestion: {issue.suggestion}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {step === 'importing' && !importResult ? (
        <div className="p-8 text-center border rounded-xl bg-card">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm">Importing {rows.length} rows...</p>
        </div>
      ) : importResult ? (
        <div className="p-4 border rounded-xl bg-card">
          <h3 className="text-sm font-semibold mb-3">Import Complete</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-muted-foreground">Inserted</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">{importResult.inserted}</p>
            </div>
            <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-xs text-muted-foreground">Errors</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">{importResult.errors.length}</p>
            </div>
          </div>
          {importResult.errors.length > 0 && (
            <div className="mt-4 space-y-1">
              {importResult.errors.map((e, i) => <p key={i} className="text-xs text-destructive">{e}</p>)}
            </div>
          )}
          <div className="flex gap-3 mt-4">
            <Button onClick={() => router.push('/imports')}>View Imports</Button>
            <Button variant="outline" onClick={() => router.push(targetModel === 'client' ? '/clients' : '/pipeline')}>
              View {targetModel === 'client' ? 'Clients' : 'Pipeline'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => { setStep('upload'); setFile(null); setHeaders([]); setRows([]) }}>Cancel</Button>
          <Button onClick={handleImport} loading={importing} disabled={!hasMappings}>
            Import {rows.length} {targetModel === 'client' ? 'Clients' : 'Prospects'}
          </Button>
        </div>
      )}

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </div>
  )
}
