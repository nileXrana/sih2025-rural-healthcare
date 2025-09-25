import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      )
    }

    // For prototype - simplified authentication
    // Just check if user exists with the specified role
    const user = await prisma.user.findFirst({
      where: {
        email,
        role,
        isActive: true
      },
      include: {
        miRoom: true
      }
    })

    if (!user) {
      // For prototype - create user on the fly if they don't exist
      let miRoomId = null
      
      if (role === 'MI_ROOM_INCHARGE') {
        // Create a default MI Room if needed
        const defaultMIRoom = await prisma.mIRoom.findFirst() || await prisma.mIRoom.create({
          data: {
            name: 'Default MI Room',
            village: 'Demo Village',
            address: 'Demo Address',
            pincode: '000000'
          }
        })
        miRoomId = defaultMIRoom.id
      }

      const newUser = await prisma.user.create({
        data: {
          email,
          password: await hashPassword('demo123'), // Default password for demo
          name: email.split('@')[0].replace(/[0-9]/g, '').replace('.', ' '),
          role: role as any,
          miRoomId,
          specialization: role === 'HOSPITAL_DOCTOR' ? 'General Medicine' : undefined,
          licenseNumber: role === 'HOSPITAL_DOCTOR' ? 'DEMO123' : undefined
        },
        include: {
          miRoom: true
        }
      })
      
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        miRoomId: newUser.miRoomId
      })

      const response = NextResponse.json({
        message: 'Login successful (Demo user created)',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          miRoom: newUser.miRoom,
          specialization: newUser.specialization,
          licenseNumber: newUser.licenseNumber
        }
      })

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 // 24 hours
      })

      return response
    }

    // For existing users - skip password verification for prototype

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      miRoomId: user.miRoomId
    })

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        miRoom: user.miRoom,
        specialization: user.specialization,
        licenseNumber: user.licenseNumber
      }
    })

    // Set token as HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}