import LoginForm from '@/components/LoginForm'

export default function DoctorLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <LoginForm
        title="Hospital Doctor Login"
        role="HOSPITAL_DOCTOR"
        redirectPath="/doctor/dashboard"
      />
    </div>
  )
}