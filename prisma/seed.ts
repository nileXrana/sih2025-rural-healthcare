import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create MI Rooms
  const miRoom1 = await prisma.mIRoom.create({
    data: {
      name: 'Nabha Primary Health Center',
      village: 'Nabha',
      address: 'Main Road, Nabha, Punjab',
      pincode: '147201'
    }
  })

  const miRoom2 = await prisma.mIRoom.create({
    data: {
      name: 'Village Health Center - Rajpura',
      village: 'Rajpura',
      address: 'Village Road, Rajpura, Punjab',
      pincode: '147202'
    }
  })

  // Create MI Room Incharge users
  const incharge1 = await prisma.user.create({
    data: {
      email: 'incharge1@miroom.com',
      password: await hashPassword('password123'),
      name: 'Priya Sharma',
      role: 'MI_ROOM_INCHARGE',
      miRoomId: miRoom1.id
    }
  })

  const incharge2 = await prisma.user.create({
    data: {
      email: 'incharge2@miroom.com',
      password: await hashPassword('password123'),
      name: 'Rajesh Kumar',
      role: 'MI_ROOM_INCHARGE',
      miRoomId: miRoom2.id
    }
  })

  // Create Hospital Doctor users
  await prisma.user.create({
    data: {
      email: 'doctor1@hospital.com',
      password: await hashPassword('password123'),
      name: 'Dr. Amit Singh',
      role: 'HOSPITAL_DOCTOR',
      specialization: 'General Medicine',
      licenseNumber: 'PB12345'
    }
  })

  await prisma.user.create({
    data: {
      email: 'doctor2@hospital.com',
      password: await hashPassword('password123'),
      name: 'Dr. Sunita Kaur',
      role: 'HOSPITAL_DOCTOR',
      specialization: 'Pediatrics',
      licenseNumber: 'PB12346'
    }
  })

  // Create sample patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'Gurpreet Singh',
      age: 45,
      gender: 'Male',
      phone: '+91-9876543210',
      address: 'House No. 123, Gali No. 4, Nabha',
      village: 'Nabha',
      aadharNumber: '123456789011',
      bloodGroup: 'B+',
      miRoomId: miRoom1.id,
      registeredById: incharge1.id
    }
  })

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Manjit Kaur',
      age: 32,
      gender: 'Female',
      phone: '+91-9876543211',
      address: 'House No. 456, Village Road, Rajpura',
      village: 'Rajpura',
      aadharNumber: '123456789012',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      miRoomId: miRoom2.id,
      registeredById: incharge2.id
    }
  })

  const patient3 = await prisma.patient.create({
    data: {
      name: 'Balwinder Singh',
      age: 28,
      gender: 'Male',
      phone: '+91-9876543212',
      address: 'Near Gurudwara, Nabha',
      village: 'Nabha',
      miRoomId: miRoom1.id,
      registeredById: incharge1.id
    }
  })

  // Create sample consultations
  await prisma.consultation.create({
    data: {
      symptoms: 'Fever, headache, and body aches for 2 days',
      vitals: {
        temperature: '101.2°F',
        bloodPressure: '120/80 mmHg',
        heartRate: '85 bpm',
        oxygenSaturation: '98%'
      },
      isUrgent: false,
      status: 'PENDING',
      patientId: patient1.id,
      miRoomId: miRoom1.id,
      inchargeId: incharge1.id
    }
  })

  await prisma.consultation.create({
    data: {
      symptoms: 'Severe stomach pain and vomiting',
      vitals: {
        temperature: '99.8°F',
        bloodPressure: '110/70 mmHg',
        heartRate: '95 bpm',
        oxygenSaturation: '97%'
      },
      isUrgent: true,
      status: 'PENDING',
      patientId: patient2.id,
      miRoomId: miRoom2.id,
      inchargeId: incharge2.id
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('\nMI Room Incharge 1:')
  console.log('Email: incharge1@miroom.com')
  console.log('Password: password123')
  console.log('\nMI Room Incharge 2:')
  console.log('Email: incharge2@miroom.com')
  console.log('Password: password123')
  console.log('\nDoctor 1:')
  console.log('Email: doctor1@hospital.com')
  console.log('Password: password123')
  console.log('\nDoctor 2:')
  console.log('Email: doctor2@hospital.com')
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })