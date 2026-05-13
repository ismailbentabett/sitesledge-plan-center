interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseClass = 'border rounded-xl bg-card transition-all duration-150'
  const hoverClass = hover ? 'card-hover cursor-pointer hover:border-primary/20' : ''
  const clickableClass = onClick ? 'cursor-pointer' : ''

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`${baseClass} ${hoverClass} ${clickableClass} text-left w-full ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className={`${baseClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  )
}
