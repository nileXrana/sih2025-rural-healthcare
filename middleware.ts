import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication (prototype mode)
  const publicRoutes = [
    '/', 
    '/mi-room/login', 
    '/mi-room/dashboard',  // Allow direct access to dashboard in prototype mode
    '/doctor/login', 
    '/api/auth/login'
  ]
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    // Redirect to appropriate login page based on the route
    if (pathname.startsWith('/doctor')) {
      return NextResponse.redirect(new URL('/doctor/login', request.url))
    } else if (pathname.startsWith('/mi-room')) {
      return NextResponse.redirect(new URL('/mi-room/login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    console.log('Verifying token:', token.substring(0, 50) + '...', 'for path:', pathname)
    const decoded = verifyToken(token)
    console.log('Token verified successfully for role:', decoded.role, 'path:', pathname)
    
    // Role-based route protection
    if (pathname.startsWith('/mi-room') && decoded.role !== 'MI_ROOM_INCHARGE') {
      console.log('Redirecting MI room access - wrong role:', decoded.role)
      return NextResponse.redirect(new URL('/mi-room/login', request.url))
    }
    
    if (pathname.startsWith('/doctor') && decoded.role !== 'HOSPITAL_DOCTOR') {
      console.log('Redirecting doctor access - wrong role:', decoded.role)
      return NextResponse.redirect(new URL('/doctor/login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.log('Token verification failed:', error instanceof Error ? error.message : 'Unknown error')
    // Redirect to appropriate login page based on the route
    if (pathname.startsWith('/doctor')) {
      return NextResponse.redirect(new URL('/doctor/login', request.url))
    } else if (pathname.startsWith('/mi-room')) {
      return NextResponse.redirect(new URL('/mi-room/login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
    '/mi-room/:path*',
    // '/doctor/:path*', // Temporarily disabled for testing
    '/api/patients/:path*',
    '/api/consultations/:path*'
  ]
}