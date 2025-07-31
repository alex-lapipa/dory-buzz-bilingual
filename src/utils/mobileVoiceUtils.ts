// Mobile-specific voice utilities for cross-platform compatibility
import { Capacitor } from '@capacitor/core';

// Detect platform and capabilities
export const isMobile = () => {
  return Capacitor.isNativePlatform() || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = () => {
  return Capacitor.getPlatform() === 'ios' || /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = () => {
  return Capacitor.getPlatform() === 'android' || /Android/.test(navigator.userAgent);
};

// Mobile-optimized WebSocket connection
export const createMobileWebSocket = (url: string): WebSocket => {
  // For mobile apps, ensure we use the proper protocol
  if (Capacitor.isNativePlatform()) {
    // Convert to wss for native apps
    const secureUrl = url.replace('ws://', 'wss://');
    return new WebSocket(secureUrl);
  }
  
  // For web, auto-detect protocol
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const protocolUrl = url.startsWith('wss://') || url.startsWith('ws://') ? url : url.replace(/^https?:/, protocol);
  return new WebSocket(protocolUrl);
};

// Request permissions for microphone on mobile
export const requestMobilePermissions = async (): Promise<boolean> => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia not supported on this browser');
      return false;
    }

    // Test microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: { ideal: 24000, min: 16000, max: 48000 },
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    });
    
    // Stop the test stream
    stream.getTracks().forEach(track => track.stop());
    
    console.log('✅ Mobile microphone permissions granted');
    return true;
  } catch (error) {
    console.error('❌ Mobile microphone permission denied:', error);
    return false;
  }
};

// Create mobile-optimized audio context
export const createMobileAudioContext = (): AudioContext => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  
  return new AudioContextClass({
    sampleRate: 24000,
    latencyHint: 'interactive',
    // iOS-specific optimizations
    ...(isIOS() && {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    })
  });
};

// Resume audio context for mobile (required user gesture)
export const resumeAudioContextOnMobile = async (audioContext: AudioContext): Promise<void> => {
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      console.log('🔊 Mobile audio context resumed');
    } catch (error) {
      console.error('❌ Failed to resume mobile audio context:', error);
      throw error;
    }
  }
};

// Mobile-specific error handling
export const handleMobileVoiceError = (error: any): string => {
  if (isIOS()) {
    if (error.name === 'NotAllowedError') {
      return 'Microphone access denied. Please enable microphone access in Settings > Safari > Camera & Microphone.';
    }
    if (error.name === 'NotFoundError') {
      return 'No microphone found. Please check your device settings.';
    }
  }
  
  if (isAndroid()) {
    if (error.name === 'NotAllowedError') {
      return 'Microphone access denied. Please enable microphone permission for this app.';
    }
    if (error.name === 'NotFoundError') {
      return 'No microphone found. Please check your device permissions.';
    }
  }
  
  // Generic mobile error
  if (isMobile()) {
    return 'Voice chat requires microphone access. Please check your device settings and permissions.';
  }
  
  return error.message || 'Voice connection failed. Please try again.';
};

// Mobile-optimized audio settings
export const getMobileAudioConstraints = () => {
  const baseConstraints = {
    sampleRate: { ideal: 24000, min: 16000, max: 48000 },
    channelCount: 1,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  };

  if (isIOS()) {
    return {
      ...baseConstraints,
      // iOS-specific optimizations
      latency: { ideal: 0.02 },
      googEchoCancellation: true,
      googNoiseSuppression: true,
      googAutoGainControl: true
    };
  }

  if (isAndroid()) {
    return {
      ...baseConstraints,
      // Android-specific optimizations
      latency: { ideal: 0.02 },
      googEchoCancellation: true,
      googNoiseSuppression: true,
      googAutoGainControl: true,
      googHighpassFilter: true
    };
  }

  return baseConstraints;
};