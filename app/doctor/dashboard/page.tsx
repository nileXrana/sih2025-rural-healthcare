'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  specialization?: string
  licenseNumber?: string
}

interface Consultation {
  id: string
  status: string
  symptoms: string
  isUrgent: boolean
  createdAt: string
  patient: {
    id: string
    name: string
    age: number
    gender: string
    village: string
  }
  miRoom: {
    name: string
    village: string
  }
  incharge: {
    name: string
  }
}

export default function DoctorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [activeTab, setActiveTab] = useState('queue')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchConsultations()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        router.push('/doctor/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/doctor/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations')
      if (response.ok) {
        const data = await response.json()
        setConsultations(data.consultations || [])
      }
    } catch (error) {
      console.error('Failed to fetch consultations:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const acceptConsultation = async (consultationId: string) => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/accept`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchConsultations()
      }
    } catch (error) {
      console.error('Failed to accept consultation:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const pendingConsultations = consultations.filter(c => c.status === 'PENDING')
  const activeConsultations = consultations.filter(c => c.status === 'IN_PROGRESS')
  const completedConsultations = consultations.filter(c => c.status === 'COMPLETED')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
                <p className="text-gray-600">Dr. {user?.name} • {user?.specialization || 'General Medicine'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { 
                id: 'queue', 
                name: 'Consultation Queue', 
                icon: '🩺',
                count: pendingConsultations.length 
              },
              { 
                id: 'active', 
                name: 'Active Consultations', 
                icon: '💬',
                count: activeConsultations.length 
              },
              { 
                id: 'completed', 
                name: 'Completed', 
                icon: '✅',
                count: completedConsultations.length 
              },
              { 
                id: 'analytics', 
                name: 'Analytics', 
                icon: '📊' 
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {tab.count !== undefined && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'queue' && (
            <div className="space-y-6">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Pending Consultation Requests
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    New consultation requests from MI Rooms waiting for your review.
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  {pendingConsultations.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending consultations</h3>
                      <p className="mt-1 text-sm text-gray-500">All consultation requests have been addressed.</p>
                    </div>
                  ) : (
                    <ul role="list" className="divide-y divide-gray-200">
                      {pendingConsultations.map((consultation) => (
                        <li key={consultation.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              {consultation.isUrgent && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Urgent
                                </span>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {consultation.patient.name}
                                  </h4>
                                  <span className="text-sm text-gray-500">
                                    {new Date(consultation.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {consultation.patient.age} years • {consultation.patient.gender} • {consultation.patient.village}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                  <strong>Symptoms:</strong> {consultation.symptoms}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  <strong>MI Room:</strong> {consultation.miRoom.name}, {consultation.miRoom.village}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Incharge:</strong> {consultation.incharge.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => acceptConsultation(consultation.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                              >
                                Accept & Start Consultation
                              </button>
                              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors">
                                View Patient History
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Active Consultations
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Consultations currently in progress.
                </p>
              </div>
              <div className="border-t border-gray-200">
                {activeConsultations.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active consultations</h3>
                    <p className="mt-1 text-sm text-gray-500">Start a consultation from the queue to see it here.</p>
                  </div>
                ) : (
                  <ul role="list" className="divide-y divide-gray-200">
                    {activeConsultations.map((consultation) => (
                      <li key={consultation.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {consultation.patient.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              In consultation • {consultation.miRoom.name}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                              Continue Consultation
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors">
                              Complete Consultation
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 p-3 rounded-md">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Today's Consultations
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {consultations.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-green-100 p-3 rounded-md">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Completed Today
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {completedConsultations.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-yellow-100 p-3 rounded-md">
                        <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Avg. Response Time
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          2.5 min
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}