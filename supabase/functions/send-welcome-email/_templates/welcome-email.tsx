import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  email: string
  language: 'en' | 'es'
  age: number
}

export const WelcomeEmail = ({
  email,
  language,
  age,
}: WelcomeEmailProps) => {
  const isSpanish = language === 'es'
  
  return (
    <Html>
      <Head />
      <Preview>
        {isSpanish 
          ? '¡Bienvenido al Mundo Jardín BeeCrazy!' 
          : 'Welcome to BeeCrazy Garden World!'
        }
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <div style={beeIcon}>🐝</div>
            <Heading style={h1}>
              {isSpanish ? '¡Bienvenido!' : 'Welcome!'}
            </Heading>
          </Section>
          
          <Section style={content}>
            <Text style={text}>
              {isSpanish 
                ? `¡Hola y bienvenido al maravilloso mundo de BeeCrazy Garden World!`
                : `Hello and welcome to the wonderful world of BeeCrazy Garden World!`
              }
            </Text>
            
            <Text style={text}>
              {isSpanish 
                ? `Estamos emocionados de tenerte con nosotros. Soy Mochi, tu compañera abeja del jardín, y estoy aquí para ayudarte con:`
                : `We're excited to have you with us. I'm Mochi, your garden bee companion, and I'm here to help you with:`
              }
            </Text>
            
            <ul style={list}>
              <li style={listItem}>
                🌱 {isSpanish ? 'Consejos de cuidado de plantas y jardinería' : 'Plant care & gardening tips'}
              </li>
              <li style={listItem}>
                🌸 {isSpanish ? 'Identificación de la naturaleza' : 'Nature identification'}
              </li>
              <li style={listItem}>
                🎨 {isSpanish ? 'Crear hermosas imágenes de jardín' : 'Creating beautiful garden images'}
              </li>
              <li style={listItem}>
                🗣️ {isSpanish ? 'Practicar español o inglés' : 'Practicing Spanish or English'}
              </li>
            </ul>
            
            <Text style={text}>
              {isSpanish 
                ? `¡Solo pregúntame cualquier cosa o di "crea una imagen de..." para comenzar!`
                : `Just ask me anything or say "create an image of..." to get started!`
              }
            </Text>
            
            <Section style={buttonContainer}>
              <Link
                href={`${Deno.env.get('SUPABASE_URL') || 'https://your-app-url.com'}`}
                style={button}
              >
                {isSpanish ? '🌻 Comenzar mi Aventura en el Jardín' : '🌻 Start My Garden Adventure'}
              </Link>
            </Section>
          </Section>
          
          <Section style={footer}>
            <Text style={footerText}>
              {isSpanish 
                ? 'Gracias por unirte a nuestra comunidad de jardín. ¡Que tengas un día buzztástico!'
                : 'Thank you for joining our garden community. Have a buzztastic day!'
              }
            </Text>
            <Text style={footerText}>
              🐝 {isSpanish ? 'El Equipo de BeeCrazy Garden World' : 'The BeeCrazy Garden World Team'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
}

const beeIcon = {
  fontSize: '48px',
  marginBottom: '16px',
}

const h1 = {
  color: '#333',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '16px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '0 48px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  paddingLeft: '20px',
}

const listItem = {
  margin: '8px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#10b981',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px 48px',
  borderTop: '1px solid #eee',
  marginTop: '32px',
}

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}