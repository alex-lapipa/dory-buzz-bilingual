import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5ee6bbaa833041a68e21fd736c7270d1',
  appName: 'dorybee-isavela',
  webDir: 'dist',
  server: {
    url: 'https://5ee6bbaa-8330-41a6-8e21-fd736c7270d1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#fef3c7",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: false,
    }
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#fef3c7',
    scheme: 'dorybee'
  },
  android: {
    backgroundColor: '#fef3c7',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;