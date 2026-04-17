import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type UserRole = 'super_admin' | 'admin' | 'manager' | 'inventory_staff' | 'staff'

const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin/dashboard':            ['super_admin', 'admin', 'manager', 'inventory_staff', 'staff'],
  '/admin/order-management':     ['super_admin', 'admin', 'manager', 'staff'],
  '/admin/product-management':   ['super_admin', 'admin', 'inventory_staff'],
  '/admin/inventory-management': ['super_admin', 'admin', 'inventory_staff'],
  '/admin/sales-report':         ['super_admin', 'admin', 'manager'],
  '/admin/user-management':      ['super_admin'],
  '/admin/inquiry-management':   ['super_admin', 'admin', 'manager', 'staff'],
  '/admin/system-settings':      ['super_admin', 'admin', 'manager'],
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  const isPublicAuthPage = [
    '/admin',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/admin/register',
  ].includes(pathname)

  if (isPublicAuthPage) return response

  // Not logged in → send to login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  // Fetch role + status
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('status, role')
    .eq('id', user.id)
    .single()

  // Not active → sign out and send to login
  if (!profile || ['pending', 'inactive', 'archived'].includes(profile.status)) {
    await supabase.auth.signOut()
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  const role = profile.role as UserRole

  const allowedRoles = ROUTE_PERMISSIONS[pathname]
  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}