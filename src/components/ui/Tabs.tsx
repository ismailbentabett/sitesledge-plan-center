'use client'

import { useState } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab?: string
  onChange: (tabId: string) => void
  className?: string
}

export default function Tabs({ tabs, activeTab, onChange, className = '' }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || '')
  const active = activeTab ?? internalActive

  const handleChange = (id: string) => {
    setInternalActive(id)
    onChange(id)
  }

  return (
    <div className={`flex gap-1 p-1 bg-muted rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            active === tab.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-xs ${active === tab.id ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
