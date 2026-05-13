import Link from 'next/link'
import PageHeader from '@/components/ui/PageHeader'
import Skeleton from '@/components/ui/Skeleton'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ModulePageProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  action?: React.ReactNode
  children: React.ReactNode
  loading?: boolean
}

export default function ModulePage({
  title,
  description,
  breadcrumbs = [],
  action,
  children,
  loading = false,
}: ModulePageProps) {
  const allBreadcrumbs = [
    { label: 'Tool Hub', href: '/' },
    ...breadcrumbs,
    { label: title },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {allBreadcrumbs.map((crumb, i) => {
          const isLast = i === allBreadcrumbs.length - 1
          if (isLast) {
            return (
              <span key={i} className="text-foreground font-medium">
                {crumb.label}
              </span>
            )
          }
          return (
            <span key={i} className="flex items-center gap-1.5">
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              <svg className="w-3 h-3 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )
        })}
      </nav>

      <PageHeader
        title={title}
        description={description}
        action={action}
      />

      {children}
    </div>
  )
}
