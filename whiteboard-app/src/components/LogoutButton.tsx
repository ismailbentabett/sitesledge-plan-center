'use client'

export default function LogoutButton() {
  return (
    <button onClick={async () => {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    }} className="flex items-center gap-2.5 px-2 py-1.5 w-full text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      Lock
    </button>
  )
}
