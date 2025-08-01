export class RealtimeVoiceChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private isConnected = false;

  constructor(private onMessage: (message: any) => void) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async connect() {
    try {
      console.log("🐝 Getting OpenAI session token...");
      
      // Get ephemeral token from our Supabase Edge Function
      const response = await fetch("https://zrdywdregcrykmbiytvl.supabase.co/functions/v1/realtime_session", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get session token: ${response.status}`);
      }

      const sessionData = await response.json();
      console.log("🐝 Got session token:", sessionData.id);
      
      if (!sessionData.client_secret?.value) {
        throw new Error("No client secret in session response");
      }

      const EPHEMERAL_KEY = sessionData.client_secret.value;

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio
      this.pc.ontrack = e => {
        console.log("🐝 Audio track received");
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
      
      console.log("🐝 Adding local audio track");
      this.pc.addTrack(ms.getTracks()[0]);

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      
      this.dc.onopen = () => {
        console.log("🐝 Data channel opened");
        this.isConnected = true;
        this.onMessage({ type: 'connected' });
      };

      this.dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          console.log("🐝 Received event:", event.type);
          this.onMessage(event);
        } catch (error) {
          console.error("🐝 Error parsing message:", error);
        }
      };

      this.dc.onerror = (error) => {
        console.error("🐝 Data channel error:", error);
      };

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      console.log("🐝 Connecting to OpenAI Realtime API...");
      
      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`OpenAI SDP error: ${sdpResponse.status}`);
      }

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("🐝 WebRTC connection established successfully!");

    } catch (error) {
      console.error("🐝 Connection error:", error);
      this.onMessage({ type: 'error', message: error.message });
      throw error;
    }
  }

  sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      console.error("🐝 Data channel not ready");
      return;
    }

    console.log("🐝 Sending text message:", text);

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

  disconnect() {
    console.log("🐝 Disconnecting voice chat");
    
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    
    this.isConnected = false;
  }

  get connected() {
    return this.isConnected;
  }
}