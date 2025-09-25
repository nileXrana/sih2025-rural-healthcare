import LoginForm from '@/components/LoginForm'

export default function MIRoomLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <LoginForm
        title="MI Room Incharge Login"
        role="MI_ROOM_INCHARGE"
        redirectPath="/mi-room/dashboard"
      />
    </div>
  )
}