'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PatientMetadataProps {
  patient: {
    id: string
    name: string
    age: number
    gender: string
    village: string
    phone?: string
    bloodGroup?: string
    allergies?: string
  }
  consultation: {
    id: string
    symptoms: string
    isUrgent: boolean
    createdAt: string
    vitals?: any
  }
  miRoom: {
    name: string
    village: string
  }
  incharge: {
    name: string
  }
}

export default function PatientMetadata({ patient, consultation, miRoom, incharge }: PatientMetadataProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '👤' },
    { id: 'medical', name: 'Medical History', icon: '🏥' },
    { id: 'vitals', name: 'Vital Signs', icon: '💓' },
    { id: 'notes', name: 'Notes', icon: '📝' }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Patient Information</h3>
            <p className="text-indigo-100">Complete patient metadata and history</p>
          </div>
          {consultation.isUrgent && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              🚨 URGENT CASE
            </div>
          )}
        </div>
      </div>

      {/* Patient Basic Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-16 h-16 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {patient.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-gray-900">{patient.name}</h4>
            <div className="flex items-center space-x-4 mt-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {patient.age} years
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {patient.gender}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {patient.village}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 px-6 border-b-3 font-semibold text-sm flex items-center transition-all duration-200",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Phone:</span> {patient.phone || 'Not provided'}</p>
                  <p><span className="text-gray-600">Village:</span> {patient.village}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-semibold text-gray-900 mb-3">Medical Information</h5>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Blood Group:</span> {patient.bloodGroup || 'Not recorded'}</p>
                  <p><span className="text-gray-600">Allergies:</span> {patient.allergies || 'None known'}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl">
              <h5 className="font-semibold text-yellow-800 mb-3">Current Symptoms</h5>
              <p className="text-gray-700">{consultation.symptoms}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h5 className="font-semibold text-blue-800 mb-3">MI Room Details</h5>
                <p className="text-gray-700">{miRoom.name}</p>
                <p className="text-gray-600 text-sm">{miRoom.village}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h5 className="font-semibold text-green-800 mb-3">Incharge</h5>
                <p className="text-gray-700">{incharge.name}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-xl">
              <h5 className="font-semibold text-red-800 mb-3">Previous Diagnoses</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hypertension</span>
                  <span className="text-sm text-gray-500">2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Diabetes Type 2</span>
                  <span className="text-sm text-gray-500">2022</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h5 className="font-semibold text-blue-800 mb-3">Current Medications</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Metformin 500mg</span>
                  <span className="text-sm text-gray-500">Twice daily</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Lisinopril 10mg</span>
                  <span className="text-sm text-gray-500">Once daily</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <h5 className="font-semibold text-green-800 mb-3">Recent Visits</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Routine Checkup</span>
                  <span className="text-sm text-gray-500">2 months ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Fever Consultation</span>
                  <span className="text-sm text-gray-500">6 months ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-xl">
                <h5 className="font-semibold text-red-800 mb-3">Blood Pressure</h5>
                <p className="text-2xl font-bold text-red-600">120/80 mmHg</p>
                <p className="text-sm text-gray-600">Normal</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h5 className="font-semibold text-blue-800 mb-3">Heart Rate</h5>
                <p className="text-2xl font-bold text-blue-600">85 bpm</p>
                <p className="text-sm text-gray-600">Normal</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl">
                <h5 className="font-semibold text-yellow-800 mb-3">Temperature</h5>
                <p className="text-2xl font-bold text-yellow-600">98.6°F</p>
                <p className="text-sm text-gray-600">Normal</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h5 className="font-semibold text-green-800 mb-3">Oxygen Saturation</h5>
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-sm text-gray-600">Normal</p>
              </div>
            </div>

            {consultation.vitals && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h5 className="font-semibold text-gray-800 mb-3">Current Vitals</h5>
                <pre className="text-sm text-gray-700 bg-white p-3 rounded border">
                  {JSON.stringify(consultation.vitals, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h5 className="font-semibold text-gray-800 mb-3">Consultation Notes</h5>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                placeholder="Add consultation notes..."
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h5 className="font-semibold text-blue-800 mb-3">Previous Notes</h5>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-600">2 months ago</p>
                  <p className="text-gray-700">Patient reported feeling well. Blood pressure controlled with current medication.</p>
                </div>
                <div className="bg-white p-3 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-600">6 months ago</p>
                  <p className="text-gray-700">Fever resolved with antibiotics. No complications noted.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
