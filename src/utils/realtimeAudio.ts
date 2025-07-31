// Audio recording utility for OpenAI Realtime API
import { getMobileAudioConstraints, createMobileAudioContext, resumeAudioContextOnMobile } from './mobileVoiceUtils';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log('🎤 Starting audio recording...');
      
      // Request microphone with mobile-optimized settings
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: getMobileAudioConstraints()
      });
      
      console.log('✅ Microphone access granted');
      
      // Create mobile-optimized audio context
      this.audioContext = createMobileAudioContext();
      
      // Resume audio context if suspended (mobile requirement)
      await resumeAudioContextOnMobile(this.audioContext);
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log('🎵 Audio pipeline established');
    } catch (error) {
      console.error('❌ Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Audio encoding for OpenAI API
export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

// WAV creation utility
export const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

// Audio queue for sequential playback
export class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    console.log(`🔊 Adding ${audioData.length} bytes to audio queue`);
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      console.log('🎵 Audio queue finished');
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      // Resume audio context if suspended (mobile requirement)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('🔊 Audio context resumed for playback');
      }
      
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
      
      console.log(`🎶 Playing audio chunk (${audioBuffer.duration.toFixed(2)}s)`);
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }

  clear() {
    this.queue = [];
    this.isPlaying = false;
  }
}

// Realtime Chat class for OpenAI Realtime API
export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;
  private isConnected = false;

  constructor(private onMessage: (message: any) => void, private onError: (error: string) => void) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
    document.body.appendChild(this.audioEl);
  }

  async init() {
    try {
      console.log('Initializing Realtime Chat...');

      // Get ephemeral token from our Supabase Edge Function
      const response = await fetch('https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/realtime_session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZHl3ZHJlZ2NyeWttYml5dHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzcyNzQsImV4cCI6MjA2OTMxMzI3NH0.6FgluqbBlAYoUCUZXkCdB1-pGU554L-6bkjjhDuqJfg'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get realtime session token');
      }

      const data = await response.json();
      console.log('Session data received:', data);
      
      if (!data.client_secret?.value) {
        throw new Error("Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;
      console.log('Ephemeral key obtained');

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio
      this.pc.ontrack = (e) => {
        console.log('Remote audio track received');
        this.audioEl.srcObject = e.streams[0];
      };

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.pc.addTrack(ms.getTracks()[0]);
      console.log('Local audio track added');

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      
      this.dc.addEventListener("open", () => {
        console.log('Data channel opened');
        this.isConnected = true;
      });
      
      this.dc.addEventListener("close", () => {
        console.log('Data channel closed');
        this.isConnected = false;
      });
      
      this.dc.addEventListener("message", (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("Received realtime event:", event.type, event);
          this.onMessage(event);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      console.log('Local description set');

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17"; // Latest realtime model
      
      console.log('Connecting to OpenAI Realtime API...');
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to connect to OpenAI: ${sdpResponse.status}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established with OpenAI");

      // Wait for data channel to open
      await new Promise((resolve) => {
        const checkConnection = () => {
          if (this.dc?.readyState === 'open') {
            resolve(true);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });

      console.log('Realtime Chat initialization complete');

    } catch (error) {
      console.error("Error initializing chat:", error);
      this.onError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private encodeAudioData(float32Array: Float32Array): string {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }

  async sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    console.log('Sending text message:', text);

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  isReady(): boolean {
    return this.isConnected && this.dc?.readyState === 'open';
  }

  disconnect() {
    console.log('Disconnecting Realtime Chat...');
    
    this.recorder?.stop();
    this.dc?.close();
    this.pc?.close();
    
    if (this.audioEl.parentNode) {
      this.audioEl.parentNode.removeChild(this.audioEl);
    }
    
    this.isConnected = false;
    console.log('Realtime Chat disconnected');
  }
}