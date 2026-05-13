import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { headers } from 'next/headers'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/login')
  }

  const headersList = headers()
  const pathname = headersList.get('x-invoke-path') || '/'

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar pathname={pathname} />

      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
