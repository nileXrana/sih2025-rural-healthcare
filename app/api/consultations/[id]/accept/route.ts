import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    
    // Only hospital doctors can accept consultations
    if (decoded.role !== 'HOSPITAL_DOCTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const consultationId = params.id

    // Update consultation status and assign doctor
    const consultation = await prisma.consultation.update({
      where: {
        id: consultationId,
        status: 'PENDING'
      },
      data: {
        status: 'IN_PROGRESS',
        doctorId: decoded.userId,
        startedAt: new Date()
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
        },
        incharge: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Consultation accepted successfully',
      consultation 
    })
  } catch (error) {
    console.error('Accept consultation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}