export interface FinancialProjection {
  month: number
  clients: number
  mrr: number
  arr: number
  churnedClients: number
  netNewClients: number
  monthlyProfit: number
  cumulativeProfit: number
}

export function calculateProjections(params: {
  averageMonthlyPrice: number
  currentClients: number
  newClientsPerMonth: number
  monthlyChurnRate: number
  monthlyFixedCosts: number
  softwareCostPerClient: number
  monthsToProject: number
}): FinancialProjection[] {
  const { averageMonthlyPrice, currentClients, newClientsPerMonth, monthlyChurnRate, monthlyFixedCosts, softwareCostPerClient, monthsToProject } = params
  const projections: FinancialProjection[] = []
  let clients = currentClients
  let cumulativeProfit = 0

  for (let month = 1; month <= monthsToProject; month++) {
    const churnedClients = Math.round(clients * monthlyChurnRate)
    const netNewClients = newClientsPerMonth - churnedClients
    clients = Math.max(0, clients + netNewClients)
    const mrr = clients * averageMonthlyPrice
    const arr = mrr * 12
    const costs = monthlyFixedCosts + (clients * softwareCostPerClient)
    const monthlyProfit = mrr - costs
    cumulativeProfit += monthlyProfit

    projections.push({
      month,
      clients,
      mrr,
      arr,
      churnedClients: Math.max(0, churnedClients),
      netNewClients,
      monthlyProfit,
      cumulativeProfit,
    })
  }

  return projections
}

export function calculateBreakEven(params: {
  averageMonthlyPrice: number
  currentClients: number
  newClientsPerMonth: number
  monthlyChurnRate: number
  monthlyFixedCosts: number
  softwareCostPerClient: number
}): number | null {
  const projections = calculateProjections({ ...params, monthsToProject: 60 })
  for (const p of projections) {
    if (p.monthlyProfit > 0) return p.month
  }
  return null
}

export function calculateSummary(params: {
  averageMonthlyPrice: number
  currentClients: number
  newClientsPerMonth: number
  monthlyChurnRate: number
  monthlyFixedCosts: number
  softwareCostPerClient: number
  monthsToProject: number
}) {
  const projections = calculateProjections(params)
  const finalMonth = projections[projections.length - 1]
  const breakEvenMonth = calculateBreakEven(params)

  return {
    currentMRR: params.currentClients * params.averageMonthlyPrice,
    currentARR: params.currentClients * params.averageMonthlyPrice * 12,
    projectedMRR: finalMonth?.mrr ?? 0,
    projectedARR: finalMonth?.arr ?? 0,
    projectedClients: finalMonth?.clients ?? 0,
    projectedMonthlyProfit: finalMonth?.monthlyProfit ?? 0,
    projectedCumulativeProfit: finalMonth?.cumulativeProfit ?? 0,
    breakEvenMonth,
    totalChurned: projections.reduce((sum, p) => sum + p.churnedClients, 0),
    totalNetNew: projections.reduce((sum, p) => sum + p.netNewClients, 0),
  }
}
