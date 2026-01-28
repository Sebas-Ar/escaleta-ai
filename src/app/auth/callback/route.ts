import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [] // Just reading to exchange code
            // Actually, we shouldn't simple read empty array if we want persistence. 
            // The method signature requires us to provide these.
            // But usually we get cookies from request in a route handler via `cookies()`
          },
          setAll(cookiesToSet) {
             // We can't set cookies on the request, but we will return a response with cookies.
             // This helper is slightly tricky in Route Handlers without `cookies()` from next/headers.
             // But let's use the standard Next.js specific pattern below.
          },
        },
      }
    )
    
    // BETTER IMPLEMENTATION for Next.js App Router Route Handler:
    const cookieStore = await import('next/headers').then(m => m.cookies())
    const supabaseServer = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
              }
            },
          },
        }
      )

    const { error } = await supabaseServer.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`)
}
