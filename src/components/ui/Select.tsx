import { forwardRef, SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`h-9 px-3 text-sm border rounded-md bg-background transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:16px] ${className}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
export default Select
