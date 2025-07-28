import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App Title & Header
    appTitle: "Dory the Garden Bee",
    appSubtitle: "Your friendly family garden companion from BeeCrazy Garden World!",
    buzztastic: "Buzztastic!",
    
    // Navigation
    chat: "Chat",
    voice: "Voice", 
    about: "About",
    
    // Buttons
    followDory: "Follow Dory!",
    share: "Share",
    
    // Badges
    gardenGuide: "Garden Guide",
    funActivities: "Fun Activities", 
    voiceChat: "Voice Chat",
    familyFun: "Family Fun",
    
    // Chat Interface
    chatPlaceholder: "Ask Dory about gardens and nature...",
    doryThinking: "Dory is thinking...",
    sendMessage: "Send message",
    generateImage: "Generate garden image",
    voiceInput: "Voice input",
    
    // Voice Chat
    voiceChatTitle: "Voice Chat with Dory",
    voiceChatSubtitle: "Have a conversation about gardens, bees, and nature!",
    connected: "Connected",
    disconnected: "Disconnected", 
    recording: "Recording...",
    dorysSpeaking: "Dory Speaking...",
    startVoiceChat: "Start Voice Chat",
    connecting: "Connecting...",
    stopRecording: "Stop Recording",
    holdToTalk: "Hold to Talk",
    disconnect: "Disconnect",
    startSpeaking: "Start speaking to begin your conversation with Dory!",
    
    // About Section
    meetDory: "Meet Dory",
    meetDoryDesc: "Your friendly bee from BeeCrazy Garden World!",
    englishFeatures: "English Features",
    spanishFeatures: "Spanish Features", 
    whatCanDoryHelp: "What can Dory help with?",
    
    // Follow Modal
    followModalTitle: "Follow BeeCrazy Garden World!",
    followModalDesc: "Join our family garden adventure and get fun updates!",
    name: "Name",
    email: "Email",
    age: "Age (optional)",
    underThirteen: "I am under 13 years old",
    parentEmail: "Parent/Guardian Email",
    parentConsent: "My parent/guardian agrees to receive updates about BeeCrazy Garden World!",
    agreeUpdates: "I agree to receive updates about Dory's garden adventures and family activities",
    whatYoullGet: "What you'll get:",
    maybeLater: "Maybe Later",
    joining: "Joining...",
    
    // Share Modal
    shareTitle: "Share BeeCrazy Garden World!",
    shareOnSocial: "Share on Social Media", 
    directLink: "Direct Link",
    embedCode: "Embed Code (Discord, Twitch, Websites)",
    copyEmbedCode: "Copy Embed Code",
    shareTextPreview: "Share text preview:",
    shareText: "Meet Dory the Garden Bee! Chat with our friendly garden companion from BeeCrazy Garden World - perfect for families learning about nature!",
    
    // Footer
    footerText: "BeeCrazy Garden World! • Built with ❤️ for families everywhere",
    
    // Toast Messages
    copied: "Copied!",
    linkCopied: "Link copied to clipboard",
    embedCopied: "Embed code copied to clipboard",
    welcomeMessage: "Welcome to BeeCrazy Garden World",
    
    // Language Toggle
    language: "Language",
    english: "English",
    spanish: "Spanish"
  },
  es: {
    // App Title & Header  
    appTitle: "Dory de los Huertos",
    appSubtitle: "¡Tu compañera amigable de jardín familiar de BeeCrazy Garden World!",
    buzztastic: "¡Buzztástico!",
    
    // Navigation
    chat: "Chat",
    voice: "Voz",
    about: "Acerca de",
    
    // Buttons
    followDory: "¡Sigue a Dory!",
    share: "Compartir",
    
    // Badges
    gardenGuide: "Guía de Jardín",
    funActivities: "Actividades Divertidas",
    voiceChat: "Chat de Voz", 
    familyFun: "Diversión Familiar",
    
    // Chat Interface
    chatPlaceholder: "Pregúntale a Dory sobre jardines y naturaleza...",
    doryThinking: "Dory está pensando...",
    sendMessage: "Enviar mensaje",
    generateImage: "Generar imagen de jardín",
    voiceInput: "Entrada de voz",
    
    // Voice Chat
    voiceChatTitle: "Chat de Voz con Dory",
    voiceChatSubtitle: "¡Ten una conversación sobre jardines, abejas y naturaleza!",
    connected: "Conectado",
    disconnected: "Desconectado",
    recording: "Grabando...",
    dorysSpeaking: "Dory Hablando...",
    startVoiceChat: "Iniciar Chat de Voz",
    connecting: "Conectando...",
    stopRecording: "Detener Grabación",
    holdToTalk: "Mantén para Hablar",
    disconnect: "Desconectar",
    startSpeaking: "¡Comienza a hablar para conversar con Dory!",
    
    // About Section
    meetDory: "Conoce a Dory",
    meetDoryDesc: "¡Tu abeja bilingüe amigable de BeeCrazy Garden World!",
    englishFeatures: "Características en Inglés",
    spanishFeatures: "Características en Español",
    whatCanDoryHelp: "¿Con qué puede ayudar Dory?",
    
    // Follow Modal
    followModalTitle: "¡Sigue BeeCrazy Garden World!",
    followModalDesc: "¡Únete a nuestra aventura de jardín familiar y recibe actualizaciones divertidas!",
    name: "Nombre",
    email: "Correo",
    age: "Edad (opcional)",
    underThirteen: "Tengo menos de 13 años",
    parentEmail: "Correo del Padre/Tutor",
    parentConsent: "¡Mi padre/tutor acepta recibir actualizaciones sobre BeeCrazy Garden World!",
    agreeUpdates: "Acepto recibir actualizaciones sobre las aventuras de jardín de Dory y actividades familiares",
    whatYoullGet: "Lo que recibirás:",
    maybeLater: "Tal vez Después",
    joining: "Uniéndose...",
    
    // Share Modal
    shareTitle: "¡Comparte BeeCrazy Garden World!",
    shareOnSocial: "Compartir en Redes Sociales",
    directLink: "Enlace Directo", 
    embedCode: "Código de Inserción (Discord, Twitch, Sitios Web)",
    copyEmbedCode: "Copiar Código de Inserción",
    shareTextPreview: "Vista previa del texto para compartir:",
    shareText: "¡Conoce a Dory la Abeja del Jardín! Chatea con nuestra compañera amigable de jardín de BeeCrazy Garden World - ¡perfecto para familias que aprenden sobre la naturaleza!",
    
    // Footer
    footerText: "¡BeeCrazy Garden World! • Hecho con ❤️ para familias en todas partes",
    
    // Toast Messages
    copied: "¡Copiado!",
    linkCopied: "Enlace copiado al portapapeles",
    embedCopied: "Código de inserción copiado al portapapeles",
    welcomeMessage: "Bienvenido a BeeCrazy Garden World",
    
    // Language Toggle
    language: "Idioma",
    english: "Inglés", 
    spanish: "Español"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('beecrazyLanguage') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('beecrazyLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};