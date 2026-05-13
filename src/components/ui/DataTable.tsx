'use client'

import { useState } from 'react'
import DropdownMenu from '@/components/ui/DropdownMenu'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  idKey: keyof T
  actions?: (item: T) => {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'danger'
    disabled?: boolean
  }[]
  loading?: boolean
  emptyMessage?: string
}

export default function DataTable<T>({
  columns,
  data,
  idKey,
  actions,
  loading = false,
  emptyMessage = 'No items found',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = (a as Record<string, unknown>)[sortKey]
    const bVal = (b as Record<string, unknown>)[sortKey]
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return sortDir === 'asc' ? -1 : 1
    if (bVal == null) return sortDir === 'asc' ? 1 : -1
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return (
        <svg className="w-3 h-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      )
    }
    return sortDir === 'asc' ? (
      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="border-b bg-muted/50">
          <div className="flex gap-4 px-4 py-3">
            {columns.map((col) => (
              <div key={col.key} className="h-4 bg-muted rounded animate-pulse-skeleton" style={{ width: `${100 / columns.length}%` }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b last:border-0">
            {columns.map((col) => (
              <div key={col.key} className="h-4 bg-muted rounded animate-pulse-skeleton" style={{ width: `${100 / columns.length}%` }} />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="border rounded-xl bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 font-medium text-muted-foreground ${col.sortable ? 'cursor-pointer select-none hover:text-foreground transition-colors' : ''} ${col.className || ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={String(item[idKey])} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                    {col.render ? col.render(item) : <span>{String((item as Record<string, unknown>)[col.key] ?? '')}</span>}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu
                      align="right"
                      trigger={
                        <button className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-accent transition-colors" aria-label="Actions">
                          <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                          </svg>
                        </button>
                      }
                      items={actions(item)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
