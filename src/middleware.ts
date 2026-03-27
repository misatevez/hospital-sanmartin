import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  let response = NextResponse.next({ request: req })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (user && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  } catch {
    // En caso de error con Supabase, dejar pasar sin redirigir
    return response
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
