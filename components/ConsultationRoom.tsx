'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ConsultationRoomProps {
  consultationId: string
  patientName: string
  patientAge: number
  patientGender: string
  symptoms: string
  isUrgent: boolean
  onEndConsultation: () => void
  onPrescribe: () => void
}

export default function ConsultationRoom({
  consultationId,
  patientName,
  patientAge,
  patientGender,
  symptoms,
  isUrgent,
  onEndConsultation,
  onPrescribe
}: ConsultationRoomProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [consultationNotes, setConsultationNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [isLocalVideoMirrored, setIsLocalVideoMirrored] = useState(true)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    initializeWebRTC()
    return () => {
      cleanup()
    }
  }, [])

  const initializeWebRTC = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localStreamRef.current = stream
      }

      // Initialize peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      })

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream)
      })

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      // Handle connection state changes
      peerConnectionRef.current.onconnectionstatechange = () => {
        if (peerConnectionRef.current) {
          switch (peerConnectionRef.current.connectionState) {
            case 'connected':
              setConnectionStatus('connected')
              break
            case 'disconnected':
              setConnectionStatus('disconnected')
              break
            default:
              setConnectionStatus('connecting')
          }
        }
      }

      // Simulate connection (in real app, you'd handle signaling server)
      setTimeout(() => {
        setConnectionStatus('connected')
      }, 2000)

    } catch (error) {
      console.error('Error accessing media devices:', error)
      setConnectionStatus('disconnected')
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioOn(audioTrack.enabled)
      }
    }
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        setIsScreenSharing(true)
      } else {
        if (localStreamRef.current && localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current
        }
        setIsScreenSharing(false)
      }
    } catch (error) {
      console.error('Error sharing screen:', error)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In real app, implement actual recording functionality
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
    }
  }

  const handleEndConsultation = () => {
    cleanup()
    onEndConsultation()
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            )} />
            <span className="text-sm font-medium text-gray-700">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>
          {isUrgent && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              URGENT
            </span>
          )}
        </div>
        <div className="text-lg font-semibold text-gray-900">
          Consultation with {patientName}
        </div>
        <button
          onClick={handleEndConsultation}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          End Consultation
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Remote Video (Patient) */}
          <div className="flex-1 bg-black relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {patientName} ({patientAge} years, {patientGender})
            </div>
          </div>

          {/* Local Video (Doctor) */}
          <div className="absolute bottom-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: isLocalVideoMirrored ? 'scaleX(-1)' : 'scaleX(1)' }}
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setIsLocalVideoMirrored(!isLocalVideoMirrored)}
                className="bg-black bg-opacity-50 text-white p-1 rounded text-xs hover:bg-opacity-70"
                title="Toggle mirror"
              >
                {isLocalVideoMirrored ? '🔄' : '🔄'}
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-6 py-4 flex items-center justify-center space-x-4">
            <button
              onClick={toggleAudio}
              className={cn(
                "p-3 rounded-full transition-colors",
                isAudioOn ? "bg-gray-600 text-white" : "bg-red-600 text-white"
              )}
            >
              {isAudioOn ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={cn(
                "p-3 rounded-full transition-colors",
                isVideoOn ? "bg-gray-600 text-white" : "bg-red-600 text-white"
              )}
            >
              {isVideoOn ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>

            <button
              onClick={toggleScreenShare}
              className={cn(
                "p-3 rounded-full transition-colors",
                isScreenSharing ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
              )}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={toggleRecording}
              className={cn(
                "p-3 rounded-full transition-colors",
                isRecording ? "bg-red-600 text-white" : "bg-gray-600 text-white"
              )}
            >
              <div className={cn("w-6 h-6 rounded-full", isRecording ? "bg-white" : "border-2 border-white")} />
            </button>

            <button
              onClick={() => setIsLocalVideoMirrored(!isLocalVideoMirrored)}
              className={cn(
                "p-3 rounded-full transition-colors",
                isLocalVideoMirrored ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
              )}
              title="Toggle video mirror"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar - Patient Info & Notes */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
          {/* Patient Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">
                  {patientName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{patientName}</h3>
                <p className="text-sm text-gray-600">{patientAge} years, {patientGender}</p>
              </div>
            </div>
            
            {isUrgent && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-3 py-2 rounded-lg mb-4">
                <div className="flex items-center">
                  <span className="text-lg mr-2">🚨</span>
                  <span className="font-semibold">Urgent Case</span>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Current Symptoms</h4>
              <p className="text-gray-700 text-sm">{symptoms}</p>
            </div>
          </div>

          {/* Consultation Notes */}
          <div className="flex-1 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Notes</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter diagnosis..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter consultation notes..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter prescription details..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <button
              onClick={onPrescribe}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Prescription
            </button>
            <button
              onClick={handleEndConsultation}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Complete Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
