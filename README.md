# Healthcare Hub-and-Spoke System

A comprehensive healthcare solution connecting rural MI (Medical Incharge) Rooms with Nabha Civil Hospital through a secure web platform. This system implements a decentralized primary healthcare model to reduce doctor workload and improve healthcare accessibility in rural areas.

## 🌟 Features

### Two-Portal System

#### 1. MI Room Incharge Portal
- **Patient Registration**: Create and manage patient profiles with complete demographic and medical information
- **Vital Signs Recording**: Log blood pressure, temperature, oxygen saturation, and other vital signs
- **Virtual Doctor Consultations**: Connect with hospital doctors for medical guidance
- **Appointment Scheduling**: Book confirmed appointments for patients requiring in-person hospital visits
- **Treatment Protocols**: Access digital library for treating minor ailments

#### 2. Hospital Doctor Portal
- **Real-time Consultation Queue**: View pending consultation requests from various MI Rooms
- **Patient History Access**: Complete medical history, past visits, and prescriptions
- **Virtual Consultations**: Conduct secure video/audio calls with MI Room staff and patients
- **E-Prescription Management**: Generate and send digital prescriptions
- **Referral Management**: Approve and manage hospital referrals

## 🏗️ System Architecture

### Technology Stack
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT-based with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (via SVG)

### Database Schema
- **Users**: MI Room Incharges and Hospital Doctors
- **MI Rooms**: Healthcare facilities in villages
- **Patients**: Registered individuals with medical history
- **Consultations**: Virtual consultation sessions
- **Prescriptions**: Digital prescriptions and treatment plans
- **Appointments**: Scheduled hospital visits

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sih2025
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
JWT_SECRET="your-jwt-secret-change-this-in-production"
```

4. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

5. **Seed the database with sample data**
```bash
npx tsx prisma/seed.ts
```

6. **Start the development server**
```bash
npm run dev
```

7. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 Sample Login Credentials

### MI Room Incharges
- **Email**: `incharge1@miroom.com` | **Password**: `password123`
- **Email**: `incharge2@miroom.com` | **Password**: `password123`

### Hospital Doctors
- **Email**: `doctor1@hospital.com` | **Password**: `password123`
- **Email**: `doctor2@hospital.com` | **Password**: `password123`

## 📊 Expected Impact

### Healthcare Improvement
- **60-70% Reduction** in non-critical cases reaching doctors
- **Improved Triage**: Smart differentiation between minor and critical cases
- **Reduced Travel Time**: Healthcare services available in villages
- **Economic Benefits**: Reduced income loss for daily-wage earners

### System Benefits
- **Efficient Resource Allocation**: Doctors can focus on patients requiring expertise
- **Better Documentation**: Complete digital patient records
- **Faster Response Times**: Immediate access to medical guidance
- **Scalable Solution**: Can be expanded to more villages and hospitals

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patients
- `GET /api/patients` - Get patients for MI Room
- `POST /api/patients` - Register new patient

### Consultations
- `GET /api/consultations` - Get consultations
- `POST /api/consultations` - Create new consultation
- `POST /api/consultations/[id]/accept` - Accept consultation (doctors only)

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate permissions for different user types
- **HTTP-only Cookies**: Secure token storage
- **Route Protection**: Middleware-based route authentication
- **Data Validation**: Input validation and sanitization

## 🎯 Patient Journey

1. **Patient visits local MI Room** instead of traveling to hospital
2. **MI Room Incharge registers** patient and performs basic check-up
3. **Triage Decision**:
   - Minor ailment → Treated locally using approved protocols
   - Requires doctor opinion → Virtual consultation initiated
4. **Doctor Review**: Hospital doctor reviews patient data and provides consultation
5. **Treatment Outcome**:
   - Advice and e-prescription provided
   - OR confirmed hospital appointment scheduled

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── doctor/           # Doctor portal pages
│   ├── mi-room/          # MI Room portal pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable components
├── lib/                  # Utility functions
├── prisma/              # Database schema and seed
└── public/              # Static assets
```

## 🤝 Contributing

This project was developed as part of Smart India Hackathon 2025 to address healthcare challenges in rural Punjab, specifically around Nabha Civil Hospital.

## 📞 Support

For any issues or questions regarding the healthcare system implementation, please refer to the project documentation or contact the development team.

---

**Healthcare Hub-and-Spoke System** - Connecting Rural Health with Expert Care 🏥✊
