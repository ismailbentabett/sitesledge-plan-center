'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void
  onChange?: (value: string) => void
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className = '', onSearch, onChange, ...props }, ref) => {
    const [value, setValue] = useState('')

    const handleChange = (v: string) => {
      setValue(v)
      onChange?.(v)
      onSearch?.(v)
    }

    return (
      <div className={`relative ${className}`}>
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 w-full pl-9 pr-8 text-sm border rounded-md bg-background transition-colors placeholder:text-muted-foreground focus-ring"
          {...props}
        />
        {value && (
          <button
            onClick={() => handleChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'
export default SearchInput
