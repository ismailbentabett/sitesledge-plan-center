'use client'

import { useState } from 'react'
import ModulePage from '@/components/ui/ModulePage'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import StatusBadge from '@/components/ui/StatusBadge'
import AIReportSection from '@/components/ui/AIReportSection'
import { useToast, ToastContainer } from '@/components/Toast'

interface ReportData {
  type: string
  generatedAt: string
  aiAnalysis?: string | null
  aiAvailable?: boolean
  [key: string]: unknown
}

export default function ReportsPage() {
  const { toasts, dismissToast, success, error } = useToast()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState('weekly')
  const [useAi, setUseAi] = useState(true)

  const generateReport = async () => {
    setLoading(true)
    setReport(null)
    try {
      const aiParam = useAi ? '&ai=true' : ''
      const res = await fetch(`/api/reports?type=${reportType}${aiParam}`)
      if (res.ok) {
        setReport(await res.json())
        success('Report generated')
      } else {
        error('Failed to generate report')
      }
    } catch {
      error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const renderReport = () => {
    if (!report) return null

    if (report.type === 'weekly_review') {
      return (
        <div className="space-y-4">
          {report.aiAnalysis && (
            <AIReportSection analysis={report.aiAnalysis} loading={false} available={report.aiAvailable ?? false} />
          )}

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Weekly Plan</h3>
            {report.weeklyPlan ? (
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Goal:</span> {(report.weeklyPlan as { weeklyGoal: string }).weeklyGoal || 'Not set'}</p>
                <p><span className="text-muted-foreground">Priorities:</span> {(report.weeklyPlan as { topPriorities: string }).topPriorities || 'Not set'}</p>
              </div>
            ) : <p className="text-sm text-muted-foreground">No weekly plan set</p>}
          </div>

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><span className="text-muted-foreground">MRR:</span> ${(report.financialSummary as { totalMRR: number })?.totalMRR?.toLocaleString() || 0}</p>
              <p><span className="text-muted-foreground">Active Clients:</span> {(report.financialSummary as { activeClients: number })?.activeClients || 0}</p>
            </div>
          </div>

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">Sales Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><span className="text-muted-foreground">Prospects:</span> {(report.salesSummary as { prospects: number })?.prospects || 0}</p>
              <p><span className="text-muted-foreground">Active Campaigns:</span> {(report.salesSummary as { activeCampaigns: number })?.activeCampaigns || 0}</p>
            </div>
          </div>

          {(report.experiments as unknown[])?.length > 0 && (
            <div className="p-4 border rounded-xl bg-card">
              <h3 className="text-sm font-semibold mb-3">Running Experiments</h3>
              <div className="space-y-2">
                {(report.experiments as Array<{ id: string; name: string }>).map((e) => (
                  <p key={e.id} className="text-sm">{e.name}</p>
                ))}
              </div>
            </div>
          )}

          {(report.decisions as unknown[])?.length > 0 && (
            <div className="p-4 border rounded-xl bg-card">
              <h3 className="text-sm font-semibold mb-3">Recent Decisions</h3>
              <div className="space-y-2">
                {(report.decisions as Array<{ id: string; title: string; status: string }>).map((d) => (
                  <div key={d.id} className="flex items-center gap-2 text-sm">
                    <StatusBadge label={d.status} variant="default" />
                    <span>{d.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    if (report.type === 'client_report') {
      return (
        <div className="space-y-4">
          {report.aiAnalysis && (
            <AIReportSection analysis={report.aiAnalysis} loading={false} available={report.aiAvailable ?? false} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{report.totalClients as number}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">Total MRR</p>
              <p className="text-2xl font-bold">${(report.totalMRR as number)?.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">By Status</h3>
            <div className="space-y-1">
              {Object.entries(report.byStatus as Record<string, number>).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
          </div>
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-sm font-semibold mb-3">By Churn Risk</h3>
            <div className="space-y-1">
              {Object.entries(report.byChurnRisk as Record<string, number>).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-medium">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (report.type === 'outreach_report') {
      return (
        <div className="space-y-4">
          {report.aiAnalysis && (
            <AIReportSection analysis={report.aiAnalysis} loading={false} available={report.aiAvailable ?? false} />
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold">{(report.totalSent as number)?.toLocaleString()}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">Reply Rate</p>
              <p className="text-2xl font-bold">{report.replyRate as string}%</p>
            </div>
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">Booked</p>
              <p className="text-2xl font-bold">{report.totalBooked as number}</p>
            </div>
            <div className="p-4 border rounded-xl bg-card">
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="text-2xl font-bold">{report.totalClosed as number}</p>
            </div>
          </div>
          {(report.campaigns as Array<{ id: string; name: string; sentCount: number; replyCount: number }>)?.length > 0 && (
            <div className="p-4 border rounded-xl bg-card">
              <h3 className="text-sm font-semibold mb-3">Campaigns</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Sent</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Replies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(report.campaigns as Array<{ id: string; name: string; sentCount: number; replyCount: number }>).map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="py-2">{c.name}</td>
                        <td className="py-2">{c.sentCount}</td>
                        <td className="py-2">{c.replyCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <>
      <ModulePage
        title="Reports"
        description="Generate internal reports with optional AI analysis"
        loading={loading}
      >
        <div className="p-4 border rounded-xl bg-card mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="weekly">Weekly Business Review</option>
              <option value="clients">Client Report</option>
              <option value="outreach">Outreach Report</option>
            </Select>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={useAi} onChange={(e) => setUseAi(e.target.checked)} className="rounded" />
              AI Analysis
            </label>
            <Button onClick={generateReport} loading={loading}>Generate Report</Button>
            {report && <Button variant="outline" onClick={handlePrint}>Print</Button>}
          </div>
        </div>

        {report && (
          <div className="mb-4 text-xs text-muted-foreground">Generated: {new Date(report.generatedAt as string).toLocaleString()}</div>
        )}

        {renderReport()}

        {!report && !loading && (
          <div className="text-center py-12 border rounded-xl bg-card">
            <p className="text-sm text-muted-foreground">No report generated</p>
            <p className="text-xs text-muted-foreground mt-1">Select a report type and click Generate</p>
          </div>
        )}
      </ModulePage>

      {typeof window !== 'undefined' && <ToastContainer toasts={toasts} onDismiss={dismissToast} />}
    </>
  )
}
