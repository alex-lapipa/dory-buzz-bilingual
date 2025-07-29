import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppState {
  isOnline: boolean;
  dbConnected: boolean;
  lastSync: Date | null;
  errors: Array<{ id: string; message: string; timestamp: Date; type: 'warning' | 'error' }>;
}

interface AppStatusContextType {
  state: AppState;
  checkConnectivity: () => Promise<void>;
  clearError: (id: string) => void;
  logError: (message: string, type?: 'warning' | 'error') => void;
}

const AppStatusContext = createContext<AppStatusContextType | null>(null);

export const useAppStatus = () => {
  const context = useContext(AppStatusContext);
  if (!context) {
    throw new Error('useAppStatus must be used within AppStatusProvider');
  }
  return context;
};

export const AppStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [state, setState] = useState<AppState>({
    isOnline: navigator.onLine,
    dbConnected: false,
    lastSync: null,
    errors: [],
  });

  const checkConnectivity = async () => {
    try {
      // Test database connection
      const { error } = await supabase
        .from('bee_facts')
        .select('id')
        .limit(1);
      
      setState(prev => ({
        ...prev,
        dbConnected: !error,
        lastSync: new Date(),
      }));

      if (error) {
        logError(`Database connection issue: ${error.message}`, 'warning');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        dbConnected: false,
      }));
      logError(`Network connectivity issue: ${error}`, 'error');
    }
  };

  const logError = (message: string, type: 'warning' | 'error' = 'error') => {
    const errorId = Date.now().toString();
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, {
        id: errorId,
        message,
        timestamp: new Date(),
        type,
      }].slice(-10), // Keep only last 10 errors
    }));

    if (type === 'error') {
      toast({
        title: 'System Alert',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const clearError = (id: string) => {
    setState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.id !== id),
    }));
  };

  useEffect(() => {
    // Check connectivity on mount
    checkConnectivity();

    // Set up online/offline listeners
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      checkConnectivity();
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false, dbConnected: false }));
      logError('You are currently offline. Some features may be limited.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check
    const interval = setInterval(checkConnectivity, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const value = {
    state,
    checkConnectivity,
    clearError,
    logError,
  };

  return (
    <AppStatusContext.Provider value={value}>
      {children}
    </AppStatusContext.Provider>
  );
};