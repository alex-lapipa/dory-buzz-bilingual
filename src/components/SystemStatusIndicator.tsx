import React from 'react';
import { useAppStatus } from '@/contexts/AppStatusContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Wifi, WifiOff, Database } from 'lucide-react';

export const SystemStatusIndicator: React.FC = () => {
  const { state, checkConnectivity, clearError } = useAppStatus();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {/* Connection Status */}
      <Card className="shadow-lg bg-card/95 backdrop-blur">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 text-sm">
            {state.isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className={state.isOnline ? 'text-green-600' : 'text-red-600'}>
              {state.isOnline ? 'Online' : 'Offline'}
            </span>
            
            {state.dbConnected ? (
              <Database className="h-4 w-4 text-green-500 ml-2" />
            ) : (
              <Database className="h-4 w-4 text-orange-500 ml-2" />
            )}
            <span className={state.dbConnected ? 'text-green-600' : 'text-orange-600'}>
              {state.dbConnected ? 'DB Connected' : 'DB Limited'}
            </span>
          </div>
          
          {state.lastSync && (
            <p className="text-xs text-muted-foreground mt-1">
              Last sync: {state.lastSync.toLocaleTimeString()}
            </p>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnectivity}
            className="mt-2 w-full"
          >
            Check Status
          </Button>
        </CardContent>
      </Card>

      {/* Error Messages */}
      {state.errors.map((error) => (
        <Card key={error.id} className="shadow-lg bg-card/95 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {error.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                )}
                <Badge variant={error.type === 'error' ? 'destructive' : 'secondary'}>
                  {error.type.toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearError(error.id)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {error.timestamp.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};