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
    
    let consultations: any[] = []

    if (decoded.role === 'HOSPITAL_DOCTOR') {
      // Doctors see all consultations
      consultations = await prisma.consultation.findMany({
        orderBy: [
          { isUrgent: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              age: true,
              gender: true,
              village: true
            }
          },
          miRoom: {
            select: {
              name: true,
              village: true
            }
          },
          incharge: {
            select: {
              name: true
            }
          },
          doctor: {
            select: {
              name: true
            }
          }
        }
      })
    } else if (decoded.role === 'MI_ROOM_INCHARGE') {
      // MI Room Incharges see only their consultations
      consultations = await prisma.consultation.findMany({
        where: {
          miRoomId: decoded.miRoomId
        },
        orderBy: [
          { isUrgent: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              age: true,
              gender: true,
              village: true
            }
          },
          miRoom: {
            select: {
              name: true,
              village: true
            }
          },
          incharge: {
            select: {
              name: true
            }
          },
          doctor: {
            select: {
              name: true
            }
          }
        }
      })
    }

    return NextResponse.json({ consultations })
  } catch (error) {
    console.error('Get consultations error:', error)
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
    
    // Only MI Room Incharges can create consultations
    if (decoded.role !== 'MI_ROOM_INCHARGE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const {
      patientId,
      symptoms,
      vitals,
      isUrgent = false
    } = await request.json()

    if (!patientId || !symptoms) {
      return NextResponse.json(
        { error: 'Patient ID and symptoms are required' },
        { status: 400 }
      )
    }

    // Verify the patient belongs to this MI Room
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        miRoomId: decoded.miRoomId
      }
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found or not accessible' },
        { status: 404 }
      )
    }

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        symptoms,
        vitals: vitals || null,
        isUrgent,
        miRoomId: decoded.miRoomId,
        inchargeId: decoded.userId,
        status: 'PENDING'
      },
      include: {
        patient: {
          select: {
            name: true,
            age: true,
            gender: true,
            village: true
          }
        },
        miRoom: {
          select: {
            name: true,
            village: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Consultation created successfully',
      consultation 
    })
  } catch (error) {
    console.error('Create consultation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}