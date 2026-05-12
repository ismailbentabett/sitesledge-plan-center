import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
        } ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
export default Input
