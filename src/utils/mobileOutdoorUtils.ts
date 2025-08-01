/**
 * Mobile utilities for outdoor usage optimization
 */

export interface OutdoorSettings {
  brightnessMode: 'auto' | 'high' | 'normal';
  voiceVolume: number;
  hapticFeedback: boolean;
  screenTimeout: number;
}

export class MobileOutdoorOptimizer {
  private static instance: MobileOutdoorOptimizer;
  private settings: OutdoorSettings;

  private constructor() {
    this.settings = {
      brightnessMode: 'auto',
      voiceVolume: 1.0,
      hapticFeedback: true,
      screenTimeout: 30000 // 30 seconds
    };
  }

  public static getInstance(): MobileOutdoorOptimizer {
    if (!MobileOutdoorOptimizer.instance) {
      MobileOutdoorOptimizer.instance = new MobileOutdoorOptimizer();
    }
    return MobileOutdoorOptimizer.instance;
  }

  /**
   * Detect if user is likely outdoors based on device sensors and settings
   */
  public async detectOutdoorEnvironment(): Promise<boolean> {
    try {
      // Check ambient light if available
      if ('AmbientLightSensor' in window) {
        const sensor = new (window as any).AmbientLightSensor();
        return new Promise((resolve) => {
          sensor.onreading = () => {
            const lux = sensor.illuminance;
            resolve(lux > 1000); // Bright outdoor light is typically > 1000 lux
          };
          sensor.start();
          
          // Fallback timeout
          setTimeout(() => resolve(false), 1000);
        });
      }

      // Check screen brightness as fallback
      if ('screen' in navigator && 'getBrightness' in (navigator.screen as any)) {
        const brightness = await (navigator.screen as any).getBrightness();
        return brightness > 0.8; // High brightness suggests outdoor use
      }

      return false;
    } catch (error) {
      console.log('Outdoor detection not available:', error);
      return false;
    }
  }

  /**
   * Optimize interface for outdoor use
   */
  public applyOutdoorOptimizations(): void {
    const rootElement = document.documentElement;
    
    // Increase contrast and brightness
    rootElement.style.setProperty('--outdoor-contrast', '1.2');
    rootElement.style.setProperty('--outdoor-brightness', '1.1');
    
    // Apply high contrast theme
    rootElement.classList.add('outdoor-mode');
  }

  /**
   * Remove outdoor optimizations
   */
  public removeOutdoorOptimizations(): void {
    const rootElement = document.documentElement;
    rootElement.classList.remove('outdoor-mode');
  }

  /**
   * Provide haptic feedback for touch interactions
   */
  public hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (!this.settings.hapticFeedback) return;

    try {
      if ('vibrate' in navigator) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [50]
        };
        navigator.vibrate(patterns[type]);
      }
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  /**
   * Keep screen awake during garden sessions
   */
  public async keepScreenAwake(): Promise<void> {
    try {
      if ('wakeLock' in navigator) {
        const wakeLock = await (navigator as any).wakeLock.request('screen');
        console.log('Screen wake lock activated for garden session');
        
        return wakeLock;
      }
    } catch (error) {
      console.log('Wake lock not available:', error);
    }
  }

  /**
   * Optimize voice recognition for outdoor noise
   */
  public getOutdoorVoiceSettings() {
    return {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100, // Higher sample rate for better noise handling
      channelCount: 1
    };
  }

  /**
   * Check if device is suitable for outdoor use
   */
  public checkOutdoorCapabilities(): {
    hasVoiceInput: boolean;
    hasHaptics: boolean;
    hasWakeLock: boolean;
    hasBrightScreen: boolean;
  } {
    return {
      hasVoiceInput: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      hasHaptics: 'vibrate' in navigator,
      hasWakeLock: 'wakeLock' in navigator,
      hasBrightScreen: 'screen' in navigator
    };
  }
}

export const mobileOutdoorOptimizer = MobileOutdoorOptimizer.getInstance();