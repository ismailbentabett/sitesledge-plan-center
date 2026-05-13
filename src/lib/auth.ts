import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'sitesledge-auth'

export function getAdminPassword(): string {
  const pwd = process.env.ADMIN_PASSWORD
  if (!pwd) throw new Error('ADMIN_PASSWORD environment variable is not set')
  return pwd
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)
  if (!token) return false

  try {
    const payload = JSON.parse(token.value)
    if (payload.authenticated !== true) return false

    const age = Date.now() - payload.timestamp
    if (age > 7 * 24 * 60 * 60 * 1000) return false

    return true
  } catch {
    return false
  }
}

export async function setAuthCookie() {
  const cookieStore = cookies()
  const payload = JSON.stringify({
    authenticated: true,
    timestamp: Date.now(),
  })

  cookieStore.set(AUTH_COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}
