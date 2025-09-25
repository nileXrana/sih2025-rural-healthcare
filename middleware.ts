import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/mi-room/login', '/doctor/login', '/api/auth/login']
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const decoded = verifyToken(token)
    
    // Role-based route protection
    if (pathname.startsWith('/mi-room') && decoded.role !== 'MI_ROOM_INCHARGE') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (pathname.startsWith('/doctor') && decoded.role !== 'HOSPITAL_DOCTOR') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
    '/mi-room/:path*',
    '/doctor/:path*',
    '/api/patients/:path*',
    '/api/consultations/:path*'
  ]
}