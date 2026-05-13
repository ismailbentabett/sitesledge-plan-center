interface MetricCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    positive: boolean
  }
  icon?: React.ReactNode
}

export default function MetricCard({ label, value, change, icon }: MetricCardProps) {
  return (
    <div className="p-4 border rounded-xl bg-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
          {change.positive ? '+' : ''}{change.value.toFixed(1)}% from last period
        </p>
      )}
    </div>
  )
}
