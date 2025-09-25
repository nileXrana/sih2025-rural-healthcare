// WebRTC utilities for consultation system
export interface WebRTCConfig {
  iceServers: RTCIceServer[]
  signalingServer?: string
}

export const defaultWebRTCConfig: WebRTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
}

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private config: WebRTCConfig

  constructor(config: WebRTCConfig = defaultWebRTCConfig) {
    this.config = config
  }

  async initializeLocalStream(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
          facingMode: 'user' // This ensures front camera for self-view
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      return this.localStream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      throw error
    }
  }

  async initializePeerConnection(): Promise<RTCPeerConnection> {
    this.peerConnection = new RTCPeerConnection(this.config)

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!)
      })
    }

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0]
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, send this to the signaling server
        console.log('ICE candidate:', event.candidate)
      }
    }

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState)
    }

    return this.peerConnection
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized')
    }

    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })

    await this.peerConnection.setLocalDescription(offer)
    return offer
  }

  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized')
    }

    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    return answer
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized')
    }

    await this.peerConnection.setRemoteDescription(description)
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized')
    }

    await this.peerConnection.addIceCandidate(candidate)
  }

  toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return videoTrack.enabled
      }
    }
    return false
  }

  toggleAudio(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return audioTrack.enabled
      }
    }
    return false
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      // Replace video track
      if (this.peerConnection && this.localStream) {
        const videoTrack = screenStream.getVideoTracks()[0]
        const sender = this.peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        )
        
        if (sender) {
          await sender.replaceTrack(videoTrack)
        }
      }

      return screenStream
    } catch (error) {
      console.error('Error sharing screen:', error)
      throw error
    }
  }

  stopScreenShare(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.stop()
      }
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream
  }

  getConnectionState(): string | undefined {
    return this.peerConnection?.connectionState
  }

  cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
    }
    if (this.peerConnection) {
      this.peerConnection.close()
    }
    this.localStream = null
    this.remoteStream = null
    this.peerConnection = null
  }
}

// Utility functions for consultation management
export const generateConsultationId = (): string => {
  return `consult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const formatConsultationDuration = (startTime: Date, endTime?: Date): string => {
  const duration = (endTime || new Date()).getTime() - startTime.getTime()
  const minutes = Math.floor(duration / 60000)
  const seconds = Math.floor((duration % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const validateConsultationData = (data: any): boolean => {
  return !!(
    data.patientId &&
    data.symptoms &&
    data.miRoomId &&
    data.inchargeId
  )
}
