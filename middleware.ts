import { NextRequest, NextResponse } from 'next/server'

const rateLimit = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_AUTH_REQUESTS = 10 // 10 attempts per minute per IP
const MAX_REGISTER_REQUESTS = 5 // 5 registrations per minute per IP

function getIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('x-real-ip') ||
         'unknown'
}

function isRateLimited(key: string, max: number): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > max
}

// Clean up stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimit) {
      if (now > entry.resetAt) rateLimit.delete(key)
    }
  }, 5 * 60 * 1000)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getIP(request)

  // Rate limit login attempts
  if (pathname.startsWith('/api/auth') && request.method === 'POST') {
    const isRegister = pathname === '/api/auth/register'
    const key = `${ip}:${isRegister ? 'register' : 'auth'}`
    const max = isRegister ? MAX_REGISTER_REQUESTS : MAX_AUTH_REQUESTS

    if (isRateLimited(key, max)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/auth/:path*'],
}
