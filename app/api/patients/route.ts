import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    // Only MI Room Incharges can view patients
    if (decoded.role !== 'MI_ROOM_INCHARGE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const patients = await prisma.patient.findMany({
      where: {
        miRoomId: decoded.miRoomId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        registeredBy: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({ patients })
  } catch (error) {
    console.error('Get patients error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    // Only MI Room Incharges can register patients
    if (decoded.role !== 'MI_ROOM_INCHARGE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const {
      name,
      age,
      gender,
      phone,
      address,
      village,
      aadharNumber,
      bloodGroup,
      allergies
    } = await request.json()

    if (!name || !age || !gender || !address || !village) {
      return NextResponse.json(
        { error: 'Name, age, gender, address, and village are required' },
        { status: 400 }
      )
    }

    // Check if Aadhar number already exists (if provided)
    if (aadharNumber) {
      const existingPatient = await prisma.patient.findUnique({
        where: { aadharNumber }
      })
      if (existingPatient) {
        return NextResponse.json(
          { error: 'Patient with this Aadhar number already exists' },
          { status: 400 }
        )
      }
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        age,
        gender,
        phone: phone || null,
        address,
        village,
        aadharNumber: aadharNumber || null,
        bloodGroup: bloodGroup || null,
        allergies: allergies || null,
        miRoomId: decoded.miRoomId,
        registeredById: decoded.userId
      }
    })

    return NextResponse.json({ 
      message: 'Patient registered successfully',
      patient 
    })
  } catch (error) {
    console.error('Register patient error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}