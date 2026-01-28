// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isDashboard = request.nextUrl.pathname === '/'

  // 0. Handle Supabase Auth Exchange (Code from Email Link)
  // If the user arrives at / with a ?code= param, we must redirect them to /auth/callback
  // so the code can be exchanged for a session cookie.
  if (request.nextUrl.searchParams.has('code')) {
     const nextUrl = new URL('/auth/callback', request.url)
     nextUrl.searchParams.set('code', request.nextUrl.searchParams.get('code')!)
     nextUrl.searchParams.set('next', request.nextUrl.pathname)
     return NextResponse.redirect(nextUrl)
  }

  // 1. If no user and trying to access dashboard, redirect to login
  if (!user && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If user exists but email doesn't match ALLOWED_USER, sign them out (Optional strict check)
  // You can set NEXT_PUBLIC_EDITOR_EMAIL in .env.local to enforce this
  if (user && process.env.NEXT_PUBLIC_EDITOR_EMAIL && user.email !== process.env.NEXT_PUBLIC_EDITOR_EMAIL) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. If user is logged in and visits login page, redirect to dashboard
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (auth callback route if used)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}
