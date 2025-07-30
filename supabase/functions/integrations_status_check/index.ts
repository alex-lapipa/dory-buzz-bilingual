import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IntegrationTest {
  service: string;
  model: string;
  status: 'pass' | 'fail' | 'warning';
  response_time?: number;
  error?: string;
  version?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const results: IntegrationTest[] = [];

    // Test 1: OpenAI GPT-4.1 (Latest Flagship Model)
    const testOpenAIChat = async () => {
      const startTime = Date.now();
      try {
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 10
          })
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          return {
            service: 'OpenAI GPT-4.1 (Latest)',
            model: 'gpt-4.1-2025-04-14',
            status: 'pass' as const,
            response_time: responseTime,
            version: '2025-04-14'
          };
        } else {
          const error = await response.text();
          return {
            service: 'OpenAI GPT-4.1 (Latest)',
            model: 'gpt-4.1-2025-04-14',
            status: 'fail' as const,
            error: error,
            response_time: responseTime
          };
        }
      } catch (error) {
        return {
          service: 'OpenAI GPT-4.1 (Latest)',
          model: 'gpt-4.1-2025-04-14',
          status: 'fail' as const,
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    };

    // Test 2: OpenAI o4-mini (Fast Reasoning Model)
    const testOpenAIReasoning = async () => {
      const startTime = Date.now();
      try {
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'o4-mini-2025-04-16',
            messages: [{ role: 'user', content: 'Test reasoning' }],
            max_tokens: 10
          })
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          return {
            service: 'OpenAI o4-mini (Reasoning)',
            model: 'o4-mini-2025-04-16',
            status: 'pass' as const,
            response_time: responseTime,
            version: '2025-04-16'
          };
        } else {
          const error = await response.text();
          return {
            service: 'OpenAI o4-mini (Reasoning)',
            model: 'o4-mini-2025-04-16',
            status: 'fail' as const,
            error: error,
            response_time: responseTime
          };
        }
      } catch (error) {
        return {
          service: 'OpenAI o4-mini (Reasoning)',
          model: 'o4-mini-2025-04-16',
          status: 'fail' as const,
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    };

    // Test 3: OpenAI Images (GPT-Image-1)
    const testOpenAIImages = async () => {
      const startTime = Date.now();
      try {
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: 'test',
            n: 1,
            size: '512x512'
          })
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          return {
            service: 'OpenAI Images (GPT-Image-1)',
            model: 'gpt-image-1',
            status: 'pass' as const,
            response_time: responseTime,
            version: 'latest'
          };
        } else {
          const error = await response.text();
          return {
            service: 'OpenAI Images (GPT-Image-1)',
            model: 'gpt-image-1',
            status: 'fail' as const,
            error: error,
            response_time: responseTime
          };
        }
      } catch (error) {
        return {
          service: 'OpenAI Images (GPT-Image-1)',
          model: 'gpt-image-1',
          status: 'fail' as const,
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    };

    // Test 4: OpenAI TTS (Latest HD)
    const testOpenAITTS = async () => {
      const startTime = Date.now();
      try {
        const openaiKey = Deno.env.get('OPENAI_API_KEY');
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1-hd',
            input: 'test',
            voice: 'alloy'
          })
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          return {
            service: 'OpenAI TTS (HD)',
            model: 'tts-1-hd',
            status: 'pass' as const,
            response_time: responseTime,
            version: 'latest'
          };
        } else {
          const error = await response.text();
          return {
            service: 'OpenAI TTS (HD)',
            model: 'tts-1-hd',
            status: 'fail' as const,
            error: error,
            response_time: responseTime
          };
        }
      } catch (error) {
        return {
          service: 'OpenAI TTS (HD)',
          model: 'tts-1-hd',
          status: 'fail' as const,
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    };

    // Test 5: Anthropic Claude (Latest)
    const testAnthropic = async () => {
      const startTime = Date.now();
      try {
        const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anthropicKey}`,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Hello' }]
          })
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          return {
            service: 'Anthropic Claude (Latest)',
            model: 'claude-3-5-sonnet-20241022',
            status: 'pass' as const,
            response_time: responseTime,
            version: '2024-10-22'
          };
        } else {
          const error = await response.text();
          return {
            service: 'Anthropic Claude (Latest)',
            model: 'claude-3-5-sonnet-20241022',
            status: 'fail' as const,
            error: error,
            response_time: responseTime
          };
        }
      } catch (error) {
        return {
          service: 'Anthropic Claude (Latest)',
          model: 'claude-3-5-sonnet-20241022',
          status: 'fail' as const,
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    };

    // Test 6: ElevenLabs (Multilingual V2)
    const testElevenLabs = async () => {
      const startTime = Date.now();
      try {
        const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY');
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          method: 'GET',
          headers: {
            'xi-api-key': elevenLabsKey,
          }
        });
        
        const responseTime = Date.now() - startTime;
        
        if (response.ok) {
          return {
            service: 'ElevenLabs (Multilingual V2)',
            model: 'eleven_multilingual_v2',
            status: 'pass' as const,
            response_time: responseTime,
            version: 'v2'
          };
        } else {
          const error = await response.text();
          return {
            service: 'ElevenLabs (Multilingual V2)',
            model: 'eleven_multilingual_v2',
            status: 'fail' as const,
            error: error,
            response_time: responseTime
          };
        }
      } catch (error) {
        return {
          service: 'ElevenLabs (Multilingual V2)',
          model: 'eleven_multilingual_v2',
          status: 'fail' as const,
          error: error.message,
          response_time: Date.now() - startTime
        };
      }
    };

    // Run all tests in parallel
    const testResults = await Promise.all([
      testOpenAIChat(),
      testOpenAIReasoning(),
      testOpenAIImages(),
      testOpenAITTS(),
      testAnthropic(),
      testElevenLabs()
    ]);

    results.push(...testResults);

    // Calculate overall status
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    const overallStatus = failCount === 0 ? 'healthy' : failCount < results.length ? 'degraded' : 'critical';

    // Log summary to database
    await supabase.from('mochi_integrations').insert({
      platform: 'integration_check',
      model: 'all_latest_models',
      message_length: 0,
      response_time_ms: 0,
      success: overallStatus === 'healthy',
      options: JSON.stringify({
        total_tests: results.length,
        passed: passCount,
        failed: failCount,
        warnings: warningCount,
        overall_status: overallStatus,
        timestamp: new Date().toISOString()
      })
    });

    return new Response(
      JSON.stringify({
        overall_status: overallStatus,
        summary: {
          total_tests: results.length,
          passed: passCount,
          failed: failCount,
          warnings: warningCount
        },
        results: results,
        updated_models: {
          'OpenAI Chat': 'gpt-4.1-2025-04-14 (Latest Flagship)',
          'OpenAI Reasoning': 'o4-mini-2025-04-16 (Fast Reasoning)',
          'OpenAI Images': 'gpt-image-1 (Latest)',
          'OpenAI TTS': 'tts-1-hd (Latest)',
          'Anthropic': 'claude-3-5-sonnet-20241022 (Latest)',
          'ElevenLabs': 'eleven_multilingual_v2 (Latest)'
        },
        deprecated_removed: [
          'gpt-4 (deprecated)',
          'text-davinci (deprecated)', 
          'dall-e-2 (legacy)',
          'claude-3-haiku-20240307 (outdated)'
        ],
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in integrations_status_check:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        overall_status: 'critical',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});