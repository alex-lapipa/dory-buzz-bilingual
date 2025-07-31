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
    appTitle: "BeeCrazy Garden World",
    appSubtitle: "Your friendly family garden companion",
    buzztastic: "Buzztastic!",
    welcome: "Welcome! 🐝",
    guestModeMessage: "Running in guest mode. Your chats won't be saved, but everything else works perfectly!",
    
    // Navigation & Actions
    chat: "Chat",
    voice: "Voice", 
    generate: "Create",
    about: "About",
    follow: "Follow",
    mochiName: "Mochi",
    share: "Share",
    home: "Home",
    contact: "Contact",
    send: "Send",
    loading: "Loading...",
    error: "Error",
    success: "Success!",
    
    // Language Selection
    language: "Language",
    chooseLanguage: "Choose your language",
    english: "English",
    spanish: "Español",
    
    // Chat Interface
    mochiTitle: "MochiBee 🌻",
    mochiSubtitle: "A Buzztastic Garden Bee!",
    chatPlaceholder: "Ask Mochi... / Pregúntale a Mochi...",
    messageToMochi: "Type your message to Mochi in English or Spanish",
    mochiThinking: "Mochi is thinking...",
    sendMessage: "Send message",
    generateImage: "Generate garden image",
    voiceInput: "Voice input",
    textChat: "Text Chat with Mochi",
    voiceChat: "Voice Chat with Mochi",
    imageGenerator: "AI Image & Video Generator",
    enterFullscreen: "Enter fullscreen mode",
    exitFullscreen: "Exit fullscreen mode",
    
    // Welcome Message
    welcomeMessage: "🐝 Hello! I'm Mochi, your friendly garden companion! I'm here to help you with:\n\n🌱 Plant care & gardening tips\n🌸 Nature identification\n🎨 Creating beautiful garden images\n🗣️ Practicing Spanish or English\n\nJust ask me anything or say \"create an image of...\" to get started! ¿Qué te gustaría saber sobre jardines?",
    
    // Voice Chat
    voiceChatTitle: "Voice Chat with Mochi",
    voiceChatSubtitle: "Have a conversation about gardens, bees, and nature!",
    connected: "Connected",
    disconnected: "Disconnected", 
    recording: "Recording...",
    mochiSpeaking: "Mochi Speaking...",
    startVoiceChat: "Start Voice Chat",
    connecting: "Connecting...",
    stopRecording: "Stop Recording",
    holdToTalk: "Hold to Talk",
    disconnect: "Disconnect",
    startSpeaking: "Start speaking to begin your conversation with Mochi!",
    clickToTalkBee: "Click to talk Bee Bee! 🐝",
    
    // Follow Modal
    followModalTitle: "Follow Mochi! 🐝✨",
    followModalDesc: "Join BeeCrazy Garden World for fun family garden updates!",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    age: "Age (optional)",
    agePlaceholder: "How old are you?",
    underThirteen: "I am under 13 years old",
    parentEmail: "Parent Email (required for under 13)",
    parentEmailPlaceholder: "parent@email.com",
    parentConsent: "Parent agrees to receive updates for their child",
    agreeUpdates: "I agree to receive fun garden updates from Mochi",
    joinGarden: "🌻 Join the Garden Family!",
    whatYoullGet: "What you'll get:",
    maybeLater: "Maybe Later",
    joining: "Joining...",
    
    // Success/Error Messages
    followSuccess: "Buzztastic! 🐝✨",
    followSuccessMessage: "Welcome to BeeCrazy Garden World! You'll receive fun garden updates for the whole family.",
    missingInfo: "Missing Information",
    missingInfoMessage: "Please fill in your name and email address.",
    consentRequired: "Consent Required", 
    consentRequiredMessage: "Please agree to receive updates from Mochi.",
    parentConsentRequired: "Parent Consent Required",
    parentConsentRequiredMessage: "For children under 13, we need a parent's email and consent.",
    followError: "Oops! 🐝",
    followErrorMessage: "Something went wrong. Please try again later.",
    imageError: "Failed to generate image. Please try again.",
    messageError: "Failed to send message. Please try again.",
    audioError: "Failed to process audio. Please try again.",
    microphoneError: "Could not access microphone. Please check permissions.",
    playError: "Failed to play audio. Please try again.",
    
    // Image Generator
    imageGeneratorTitle: "🎨 Garden Image Creator",
    imagePromptPlaceholder: "Try: 'A magical garden with rainbow flowers and happy bees flying around'",
    videoPromptPlaceholder: "Try: 'A time-lapse of flowers blooming in a magical garden'",
    generateImageButton: "🌻 Create Garden Image",
    generateVideoButton: "🎬 Create Garden Video",
    imageGeneratedSuccess: "Image generated successfully!",
    videoGeneratedSuccess: "Video generated successfully!",
    enterPrompt: "Please enter a prompt",
    
    // Share Buttons
    shareTwitter: "Share on Twitter",
    shareReddit: "Share on Reddit", 
    shareLinkedIn: "Share on LinkedIn",
    shareWhatsApp: "Share on WhatsApp",
    copyLink: "Copy Link",
    shareTitle: "Share BeeCrazy Garden World!",
    shareOnSocial: "Share on Social Media",
    directLink: "Direct Link",
    embedCode: "Embed Code (Discord, Twitch, Websites)",
    copyEmbedCode: "Copy Embed Code",
    shareTextPreview: "Share text preview:",
    shareText: "Meet Mochi the Garden Bee! Chat with our friendly garden companion from BeeCrazy Garden World - perfect for families learning about nature!",
    
    // Onboarding
    onboardingTitle: "Welcome to Mochi's Garden! 🐝🌻",
    onboardingMessage: "I'm here to help you explore the wonderful world of gardens, bees, and nature! Try asking me about plants, creating images, or just chat in English or Spanish.",
    gotIt: "Got it!",
    
    // Toast Messages
    copied: "Copied!",
    linkCopied: "Link copied to clipboard",
    embedCopied: "Embed code copied to clipboard",
    welcomeMessageToast: "Welcome to BeeCrazy Garden World",
    
    // Garden Content
    aboutBees: "About Bees",
    aboutGardening: "About Gardening", 
    aboutNature: "About Nature",
    beeswax: "Beeswax",
    honey: "Honey",
    pollinators: "Pollinators",
    flowers: "Flowers",
    plants: "Plants",
    vegetables: "Vegetables",
    fruits: "Fruits",
    herbs: "Herbs"
  },
  es: {
    // App Title & Header  
    appTitle: "BeeCrazy Garden World",
    appSubtitle: "",
    buzztastic: "¡Buzztástico!",
    welcome: "¡Bienvenido! 🐝",
    guestModeMessage: "Funcionando en modo invitado. Tus chats no se guardarán, ¡pero todo lo demás funciona perfectamente!",
    
    // Navigation & Actions
    chat: "Chat",
    voice: "Voz",
    generate: "Crear",
    about: "Acerca de",
    follow: "Seguir",
    mochiName: "Mochi",
    share: "Compartir",
    home: "Inicio",
    contact: "Contacto",
    send: "Enviar",
    loading: "Cargando...",
    error: "Error",
    success: "¡Éxito!",
    
    // Language Selection
    language: "Idioma",
    chooseLanguage: "Elige tu idioma",
    english: "English",
    spanish: "Español",
    
    // Chat Interface
    mochiTitle: "MochiBee 🌻",
    mochiSubtitle: "Una Abeja de Jardin Buzztástica!",
    chatPlaceholder: "Pregúntale a Mochi... / Ask Mochi...",
    messageToMochi: "Escribe tu mensaje a Mochi en inglés o español",
    mochiThinking: "Mochi está pensando...",
    sendMessage: "Enviar mensaje",
    generateImage: "Generar imagen de jardín",
    voiceInput: "Entrada de voz",
    textChat: "Chat de Texto con Mochi",
    voiceChat: "Chat de Voz con Mochi",
    imageGenerator: "Generador de Imágenes y Videos IA",
    enterFullscreen: "Entrar en modo pantalla completa",
    exitFullscreen: "Salir del modo pantalla completa",
    
    // Welcome Message
    welcomeMessage: "🐝 ¡Hola! Soy Mochi, tu amigable compañera de jardín. Estoy aquí para ayudarte con:\n\n🌱 Cuidado de plantas y consejos de jardinería\n🌸 Identificación de la naturaleza\n🎨 Crear hermosas imágenes de jardín\n🗣️ Practicar español o inglés\n\n¡Solo pregúntame cualquier cosa o di \"crear una imagen de...\" para empezar! What would you like to know about gardens?",
    
    // Voice Chat
    voiceChatTitle: "Chat de Voz con Mochi",
    voiceChatSubtitle: "¡Ten una conversación sobre jardines, abejas y naturaleza!",
    connected: "Conectado",
    disconnected: "Desconectado",
    recording: "Grabando...",
    mochiSpeaking: "Mochi Hablando...",
    startVoiceChat: "Iniciar Chat de Voz",
    connecting: "Conectando...",
    stopRecording: "Detener Grabación",
    holdToTalk: "Mantén para Hablar",
    disconnect: "Desconectar",
    startSpeaking: "¡Comienza a hablar para conversar con Mochi!",
    clickToTalkBee: "¡Haz clic para hablar Bee Bee! 🐝",
    
    // Follow Modal
    followModalTitle: "¡Sigue a Mochi! 🐝✨",
    followModalDesc: "¡Únete a BeeCrazy Garden World para recibir actualizaciones divertidas del jardín familiar!",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Email",
    emailPlaceholder: "tu@email.com",
    age: "Edad (opcional)",
    agePlaceholder: "¿Cuántos años tienes?",
    underThirteen: "Tengo menos de 13 años",
    parentEmail: "Email de Padre/Madre (requerido para menores de 13)",
    parentEmailPlaceholder: "padre@email.com",
    parentConsent: "El padre/madre acepta recibir actualizaciones para su hijo/a",
    agreeUpdates: "Acepto recibir actualizaciones divertidas del jardín de Mochi",
    joinGarden: "🌻 ¡Únete a la Familia del Jardín!",
    whatYoullGet: "Lo que recibirás:",
    maybeLater: "Tal vez Después",
    joining: "Uniéndose...",
    
    // Success/Error Messages
    followSuccess: "¡Buzztástico! 🐝✨",
    followSuccessMessage: "¡Bienvenido a BeeCrazy Garden World! Recibirás actualizaciones divertidas del jardín para toda la familia.",
    missingInfo: "Información Faltante",
    missingInfoMessage: "Por favor completa tu nombre y dirección de email.",
    consentRequired: "Consentimiento Requerido",
    consentRequiredMessage: "Por favor acepta recibir actualizaciones de Mochi.",
    parentConsentRequired: "Consentimiento de Padre/Madre Requerido",
    parentConsentRequiredMessage: "Para niños menores de 13 años, necesitamos el email y consentimiento de un padre/madre.",
    followError: "¡Ups! 🐝",
    followErrorMessage: "Algo salió mal. Por favor intenta de nuevo más tarde.",
    imageError: "Error al generar imagen. Por favor intenta de nuevo.",
    messageError: "Error al enviar mensaje. Por favor intenta de nuevo.",
    audioError: "Error al procesar audio. Por favor intenta de nuevo.",
    microphoneError: "No se pudo acceder al micrófono. Por favor verifica los permisos.",
    playError: "Error al reproducir audio. Por favor intenta de nuevo.",
    
    // Image Generator
    imageGeneratorTitle: "🎨 Creador de Imágenes de Jardín",
    imagePromptPlaceholder: "Prueba: 'Un jardín mágico con flores de arcoíris y abejas felices volando alrededor'",
    videoPromptPlaceholder: "Prueba: 'Un time-lapse de flores floreciendo en un jardín mágico'",
    generateImageButton: "🌻 Crear Imagen de Jardín",
    generateVideoButton: "🎬 Crear Video de Jardín",
    imageGeneratedSuccess: "¡Imagen generada exitosamente!",
    videoGeneratedSuccess: "¡Video generado exitosamente!",
    enterPrompt: "Por favor ingresa una descripción",
    
    // Share Buttons
    shareTwitter: "Compartir en Twitter",
    shareReddit: "Compartir en Reddit",
    shareLinkedIn: "Compartir en LinkedIn",
    shareWhatsApp: "Compartir en WhatsApp",
    copyLink: "Copiar Enlace",
    shareTitle: "¡Comparte BeeCrazy Garden World!",
    shareOnSocial: "Compartir en Redes Sociales",
    directLink: "Enlace Directo", 
    embedCode: "Código de Inserción (Discord, Twitch, Sitios Web)",
    copyEmbedCode: "Copiar Código de Inserción",
    shareTextPreview: "Vista previa del texto para compartir:",
    shareText: "¡Conoce a Mochi la Abeja del Jardín! Chatea con nuestra compañera amigable de jardín de BeeCrazy Garden World - ¡perfecto para familias que aprenden sobre la naturaleza!",
    
    // Onboarding
    onboardingTitle: "¡Bienvenido al Jardín de Mochi! 🐝🌻",
    onboardingMessage: "¡Estoy aquí para ayudarte a explorar el maravilloso mundo de jardines, abejas y naturaleza! Intenta preguntarme sobre plantas, crear imágenes, o simplemente charla en inglés o español.",
    gotIt: "¡Entendido!",
    
    // Toast Messages
    copied: "¡Copiado!",
    linkCopied: "Enlace copiado al portapapeles",
    embedCopied: "Código de inserción copiado al portapapeles",
    welcomeMessageToast: "Bienvenido a BeeCrazy Garden World",
    
    // Garden Content
    aboutBees: "Acerca de las Abejas",
    aboutGardening: "Acerca de la Jardinería",
    aboutNature: "Acerca de la Naturaleza",
    beeswax: "Cera de Abeja",
    honey: "Miel",
    pollinators: "Polinizadores",
    flowers: "Flores",
    plants: "Plantas",
    vegetables: "Vegetales",
    fruits: "Frutas",
    herbs: "Hierbas"
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