import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    console.log('API /auth/me - Token received:', token ? token.substring(0, 50) + '...' : 'No token')

    if (!token) {
      console.log('API /auth/me - No token provided')
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    console.log('API /auth/me - Verifying token...')
    const decoded = verifyToken(token)
    console.log('API /auth/me - Token verified successfully:', decoded)
    
    return NextResponse.json({
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        miRoomId: decoded.miRoomId
      }
    })
  } catch (error) {
    console.log('API /auth/me - Token verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}