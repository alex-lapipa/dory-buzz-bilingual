import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@^4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('📧 Processing welcome email request...');
    
    const { userEmail, displayName, language = 'en' } = await req.json();
    
    if (!userEmail) {
      throw new Error('Email is required');
    }

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    console.log(`📤 Sending welcome email to: ${userEmail}`);

    const { data, error } = await resend.emails.send({
      from: 'Mochi 🐝 <noreply@yourdomain.com>',
      to: [userEmail],
      subject: language === 'es' 
        ? '🐝 ¡Bienvenido al Mundo Jardín de Mochi!' 
        : '🐝 Welcome to Mochi\'s Beeducation World!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #fefce8 0%, #f0fdf4 100%); padding: 20px; border-radius: 16px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 64px; margin-bottom: 16px; line-height: 1;">🐝</div>
              <h1 style="color: #059669; font-size: 28px; margin: 0; font-weight: bold;">
                ${language === 'es' ? '¡Bienvenido al Mundo de Mochi!' : 'Welcome to Mochi\'s World!'}
              </h1>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">
                ${language === 'es' 
                  ? 'Tu compañero AI para jardinería sostenible y prácticas amigables con las abejas' 
                  : 'Your AI companion for sustainable gardening and bee-friendly practices'
                }
              </p>
            </div>

            <!-- Greeting -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #374151; font-size: 22px; margin-bottom: 12px;">
                ${language === 'es' 
                  ? `¡Hola ${displayName || 'Amigo Jardinero'}! 👋` 
                  : `Hi ${displayName || 'Garden Friend'}! 👋`
                }
              </h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 16px;">
                ${language === 'es'
                  ? '¡Gracias por unirte a nuestra comunidad de jardineros ecológicos! Mochi está emocionado de ayudarte a crear un jardín próspero y amigable con las abejas.'
                  : 'Thank you for joining our community of eco-conscious gardeners! Mochi is excited to help you create a thriving, bee-friendly garden.'
                }
              </p>
            </div>

            <!-- Features Grid -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #374151; margin-bottom: 20px; text-align: center; font-size: 18px;">
                ${language === 'es' ? '¿Qué puedes hacer con Mochi?' : 'What you can do with Mochi:'}
              </h3>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f9fafb; border-radius: 12px; border-left: 4px solid #10b981;">
                  <span style="font-size: 28px;">🎤</span>
                  <div>
                    <p style="font-weight: 600; margin: 0 0 4px 0; color: #374151; font-size: 16px;">
                      ${language === 'es' ? 'Chat de Voz a Voz' : 'Voice-to-Voice Chat'}
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.4;">
                      ${language === 'es'
                        ? 'Ten conversaciones naturales sobre jardinería, plantas y cuidado de abejas'
                        : 'Have natural conversations about gardening, plants, and bee care'
                      }
                    </p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f0f9ff; border-radius: 12px; border-left: 4px solid #0ea5e9;">
                  <span style="font-size: 28px;">🎮</span>
                  <div>
                    <p style="font-weight: 600; margin: 0 0 4px 0; color: #374151; font-size: 16px;">
                      ${language === 'es' ? 'Juegos Interactivos' : 'Interactive Learning Games'}
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.4;">
                      ${language === 'es'
                        ? 'Aprende a través de 10+ juegos divertidos e interactivos sobre abejas y jardines'
                        : 'Learn through 10+ fun, interactive games about bees and gardens'
                      }
                    </p>
                  </div>
                </div>
                
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #fefce8; border-radius: 12px; border-left: 4px solid #eab308;">
                  <span style="font-size: 28px;">🌱</span>
                  <div>
                    <p style="font-weight: 600; margin: 0 0 4px 0; color: #374151; font-size: 16px;">
                      ${language === 'es' ? 'Guía de Cuidado de Plantas' : 'Plant Care Guidance'}
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.4;">
                      ${language === 'es'
                        ? 'Obtén consejos personalizados para tus plantas específicas y condiciones de crecimiento'
                        : 'Get personalized advice for your specific plants and growing conditions'
                      }
                    </p>
                  </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: #f3e8ff; border-radius: 12px; border-left: 4px solid #a855f7;">
                  <span style="font-size: 28px;">🐛</span>
                  <div>
                    <p style="font-weight: 600; margin: 0 0 4px 0; color: #374151; font-size: 16px;">
                      ${language === 'es' ? 'Educación sobre Abejas' : 'Bee Education'}
                    </p>
                    <p style="font-size: 14px; color: #6b7280; margin: 0; line-height: 1.4;">
                      ${language === 'es'
                        ? 'Aprende sobre el comportamiento de las abejas, creación de hábitats y plantas polinizadoras'
                        : 'Learn about bee behavior, habitat creation, and pollinator-friendly plants'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Call to Action -->
            <div style="text-center; margin-bottom: 30px;">
              <div style="padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(16, 185, 129, 0.2);">
                <p style="font-size: 16px; margin: 0; color: #374151; font-weight: 500;">
                  📧 ${language === 'es' 
                    ? `Hemos enviado esta información de bienvenida a: <strong>${userEmail}</strong>`
                    : `We've sent this welcome information to: <strong>${userEmail}</strong>`
                  }
                </p>
              </div>
              
              <a href="https://5ee6bbaa-8330-41a6-8e21-fd736c7270d1.lovableproject.com/" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                        color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; 
                        font-weight: 700; margin: 16px 0; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                🐝 ${language === 'es' ? 'Comenzar a Chatear con Mochi' : 'Start Chatting with Mochi'}
              </a>
            </div>

            <!-- Quick Tips -->
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <h4 style="color: #374151; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                💡 ${language === 'es' ? 'Consejos Rápidos:' : 'Quick Tips:'}
              </h4>
              <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">
                  ${language === 'es' 
                    ? 'Usa comandos de voz para una experiencia más natural'
                    : 'Use voice commands for a more natural experience'
                  }
                </li>
                <li style="margin-bottom: 8px;">
                  ${language === 'es'
                    ? 'Explora la sección "🐝 Beeducation" para juegos de aprendizaje'
                    : 'Explore the "🐝 Beeducation" section for learning games'
                  }
                </li>
                <li style="margin-bottom: 0;">
                  ${language === 'es'
                    ? 'Haz preguntas específicas sobre tus plantas y jardín'
                    : 'Ask specific questions about your plants and garden'
                  }
                </li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <p style="margin: 0 0 8px 0;">
                ${language === 'es' 
                  ? '¿Preguntas? Responde a este correo o visita nuestro centro de ayuda.'
                  : 'Questions? Reply to this email or visit our help center.'
                }
              </p>
              <p style="margin: 0; font-weight: 500; color: #10b981;">
                ${language === 'es' ? '¡Feliz jardinería! 🌻🐝' : 'Happy gardening! 🌻🐝'}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log('✅ Welcome email sent successfully:', data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailId: data?.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in send-welcome-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send welcome email',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});