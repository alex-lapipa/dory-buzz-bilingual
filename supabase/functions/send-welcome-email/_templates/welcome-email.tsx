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

/**
 * Welcome Email · v2 (editorial honey palette)
 * ──────────────────────────────────────────────────────────────
 * Bilingual welcome dispatched on signup. Same React-Email structure,
 * same WelcomeEmailProps interface (email / language / age) — only
 * the visual layer is refreshed to match the site's editorial honey
 * design system (Fraunces serif fallback, honey-drip top accent,
 * warm cream canvas, honey-gradient CTA, Caveat handwritten subtitle).
 *
 * Email-safe: all styles inline, no web-font dependency (Fraunces /
 * Caveat fall back to Georgia / Brush Script in Outlook & older
 * clients while still rendering the editorial register on modern
 * mail apps that support those fonts via system / fallback chain).
 */

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
          ? '¡Bienvenid@ a Mochi de los Huertos!'
          : 'Welcome to Mochi de los Huertos!'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Honey-drip top accent (mirrors the site's HoneyCard) */}
          <div style={dripAccent} />

          <Section style={header}>
            <div style={beeIcon}>🐝</div>
            <Heading style={h1}>
              {isSpanish ? '¡Bienvenid@!' : 'Welcome!'}
            </Heading>
            <Text style={subtitleHand}>
              {isSpanish
                ? '· al huerto de Mochi · to the garden ·'
                : "· to Mochi's garden · al huerto ·"}
            </Text>
          </Section>

          <Section style={content}>
            <Text style={text}>
              {isSpanish
                ? `¡Hola y bienvenid@ al huerto de Mochi! Empezamos.`
                : `Hello and welcome to Mochi's garden. Let's get started.`}
            </Text>

            <Text style={text}>
              {isSpanish
                ? `Estamos encantad@s de tenerte aquí. Soy Mochi, tu abeja del huerto, y estoy aquí para acompañarte con:`
                : `We're delighted to have you here. I'm Mochi, your garden bee, and I'm here to walk alongside you with:`}
            </Text>

            <ul style={list}>
              <li style={listItem}>
                <span style={listMarker}>·</span>
                🌱{' '}
                {isSpanish
                  ? 'Consejos de jardinería y cuidado de plantas'
                  : 'Plant care & gardening tips'}
              </li>
              <li style={listItem}>
                <span style={listMarker}>·</span>
                🌸{' '}
                {isSpanish
                  ? 'Identificación de la naturaleza'
                  : 'Nature identification'}
              </li>
              <li style={listItem}>
                <span style={listMarker}>·</span>
                🎨{' '}
                {isSpanish
                  ? 'Crear hermosas imágenes del huerto'
                  : 'Creating beautiful garden images'}
              </li>
              <li style={listItem}>
                <span style={listMarker}>·</span>
                🗣️{' '}
                {isSpanish
                  ? 'Practicar español o inglés mientras aprendes'
                  : 'Practising Spanish or English as you learn'}
              </li>
            </ul>

            <Text style={textCaveat}>
              {isSpanish
                ? `¡Pregúntame lo que quieras, o di «crea una imagen de…» para empezar!`
                : `Just ask me anything, or say "create an image of…" to get started!`}
            </Text>

            <Section style={buttonContainer}>
              <Link
                href={`${Deno.env.get('SUPABASE_URL') || 'https://www.mochinillo.com'}`}
                style={button}
              >
                {isSpanish
                  ? '🌻 Comenzar mi aventura en el huerto'
                  : '🌻 Start my garden adventure'}
              </Link>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerHand}>
              {isSpanish
                ? '· gracias por unirte ·'
                : '· thank you for joining ·'}
            </Text>
            <Text style={footerText}>
              {isSpanish
                ? 'Esperamos que tengas un día buzztástico en compañía del huerto.'
                : 'We hope you have a buzztastic day with the garden alongside you.'}
            </Text>
            <Text style={footerWordmark}>
              🐝 Mochi de los Huertos
            </Text>
            <Text style={footerSub}>
              {isSpanish
                ? 'parte de LA PIPA IS LA PIPA'
                : 'part of LA PIPA IS LA PIPA'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

/* ── Editorial honey palette · email-safe inline styles ── */

const main = {
  backgroundColor: '#fcf8ec', // cream canvas
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  margin: 0,
  padding: '24px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0 0 48px',
  marginBottom: '32px',
  maxWidth: '600px',
  borderRadius: '20px',
  boxShadow: '0 12px 32px -12px rgba(43,29,11,0.16)',
  overflow: 'hidden',
  border: '1px solid rgba(245,158,11,0.16)',
}

const dripAccent = {
  height: '4px',
  background:
    'linear-gradient(90deg,#f59e0b 0%,#f4a012 30%,#fbbf24 50%,#f4a012 70%,#d97706 100%)',
  width: '100%',
}

const header = {
  textAlign: 'center' as const,
  padding: '36px 24px 12px',
}

const beeIcon = {
  fontSize: '52px',
  marginBottom: '8px',
  lineHeight: 1,
}

const h1 = {
  color: '#2b1d0b',
  fontSize: '34px',
  fontWeight: 600,
  margin: '12px 0 6px',
  padding: '0',
  textAlign: 'center' as const,
  fontFamily: '"Fraunces",Georgia,"Times New Roman",serif',
  letterSpacing: '-0.01em',
}

const subtitleHand = {
  color: '#5b4525',
  fontSize: '20px',
  margin: '0 0 8px',
  textAlign: 'center' as const,
  fontFamily: '"Caveat","Brush Script MT",cursive',
  fontStyle: 'italic',
}

const content = {
  padding: '8px 48px 0',
}

const text = {
  color: '#3a2810',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const textCaveat = {
  color: '#5b4525',
  fontSize: '18px',
  lineHeight: '26px',
  margin: '20px 0 8px',
  fontFamily: '"Caveat","Brush Script MT",cursive',
  fontStyle: 'italic',
}

const list = {
  color: '#3a2810',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '12px 0 16px',
  paddingLeft: '4px',
  listStyle: 'none' as const,
}

const listItem = {
  margin: '6px 0',
}

const listMarker = {
  color: '#d97706',
  fontWeight: 700,
  marginRight: '10px',
  fontSize: '18px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0 8px',
}

const button = {
  background: 'linear-gradient(95deg,#f4a012 0%,#d97706 100%)',
  backgroundColor: '#d97706', // fallback for non-gradient clients
  borderRadius: '999px',
  color: '#2b1d0b',
  fontSize: '16px',
  fontWeight: 700,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  fontFamily: '"Fraunces",Georgia,"Times New Roman",serif',
  letterSpacing: '-0.005em',
  boxShadow: '0 8px 18px -8px rgba(217,119,6,0.55)',
}

const footer = {
  textAlign: 'center' as const,
  padding: '32px 48px 8px',
  borderTop: '1px solid rgba(217,119,6,0.18)',
  marginTop: '32px',
}

const footerHand = {
  color: '#5b4525',
  fontSize: '20px',
  lineHeight: '24px',
  margin: '0 0 12px',
  fontFamily: '"Caveat","Brush Script MT",cursive',
  fontStyle: 'italic',
}

const footerText = {
  color: '#6b5232',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
}

const footerWordmark = {
  color: '#2b1d0b',
  fontSize: '16px',
  fontWeight: 600,
  margin: '12px 0 4px',
  fontFamily: '"Fraunces",Georgia,"Times New Roman",serif',
  letterSpacing: '0.01em',
}

const footerSub = {
  color: '#8a6f4a',
  fontSize: '11px',
  lineHeight: '16px',
  margin: '4px 0 0',
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
}
