import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailRequest {
  email: string
  age: number
  language: 'en' | 'es'
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { email, age, language }: WelcomeEmailRequest = await req.json()

    console.log('Sending welcome email to:', email, 'Language:', language, 'Age:', age)

    // Validate input
    if (!email || !age || !language) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, age, language' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (age < 13 || age > 120) {
      return new Response(
        JSON.stringify({ error: 'Age must be between 13 and 120' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Render the React email template
    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        email,
        language,
        age,
      })
    )

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Mochi from BeeCrazy Garden World <onboarding@resend.dev>',
      to: [email],
      subject: language === 'es' 
        ? '🐝 ¡Bienvenido al Mundo Jardín BeeCrazy!' 
        : '🐝 Welcome to BeeCrazy Garden World!',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: data?.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Error in send-welcome-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send welcome email',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})