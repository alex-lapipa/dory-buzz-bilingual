import { useState, useEffect, useCallback } from 'react';
import { mobileOutdoorOptimizer } from '@/utils/mobileOutdoorUtils';
import { useToast } from '@/hooks/use-toast';

export function useOutdoorMode() {
  const [isOutdoorMode, setIsOutdoorMode] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [capabilities, setCapabilities] = useState(mobileOutdoorOptimizer.checkOutdoorCapabilities());
  const { toast } = useToast();

  // Auto-detect outdoor environment
  const detectOutdoor = useCallback(async () => {
    setIsDetecting(true);
    try {
      const isOutdoor = await mobileOutdoorOptimizer.detectOutdoorEnvironment();
      if (isOutdoor && !isOutdoorMode) {
        setIsOutdoorMode(true);
        toast({
          title: "🌞 Outdoor Mode",
          description: "Interface optimized for bright sunlight!",
        });
      }
    } catch (error) {
      console.log('Outdoor detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  }, [isOutdoorMode, toast]);

  // Toggle outdoor mode manually
  const toggleOutdoorMode = useCallback(() => {
    const newMode = !isOutdoorMode;
    setIsOutdoorMode(newMode);
    
    if (newMode) {
      mobileOutdoorOptimizer.applyOutdoorOptimizations();
      mobileOutdoorOptimizer.keepScreenAwake();
      toast({
        title: "🌞 Outdoor Mode Active",
        description: "High contrast & voice optimized for garden use",
      });
    } else {
      mobileOutdoorOptimizer.removeOutdoorOptimizations();
      toast({
        title: "🏠 Indoor Mode",
        description: "Interface optimized for indoor use",
      });
    }
  }, [isOutdoorMode, toast]);

  // Haptic feedback wrapper
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    mobileOutdoorOptimizer.hapticFeedback(type);
  }, []);

  // Get outdoor-optimized voice settings
  const getVoiceSettings = useCallback(() => {
    return mobileOutdoorOptimizer.getOutdoorVoiceSettings();
  }, []);

  // Auto-detect on mount
  useEffect(() => {
    // Detect outdoor environment after a short delay
    const timer = setTimeout(detectOutdoor, 1000);
    return () => clearTimeout(timer);
  }, [detectOutdoor]);

  // Apply/remove optimizations based on mode
  useEffect(() => {
    if (isOutdoorMode) {
      mobileOutdoorOptimizer.applyOutdoorOptimizations();
    } else {
      mobileOutdoorOptimizer.removeOutdoorOptimizations();
    }
  }, [isOutdoorMode]);

  return {
    isOutdoorMode,
    isDetecting,
    capabilities,
    toggleOutdoorMode,
    detectOutdoor,
    hapticFeedback,
    getVoiceSettings
  };
}