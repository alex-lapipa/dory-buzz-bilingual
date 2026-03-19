// DEPRECATED — Not called by frontend. All chat routes through mochi_rag_v2. Kept for reference only.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  type: 'chat' | 'voice' | 'analysis';
  provider: 'openai' | 'anthropic' | 'elevenlabs' | 'auto';
  input: string;
  context?: any;
  userId?: string;
  conversationId?: string;
  settings?: any;
  generateMedia?: boolean; // For automatic media generation
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  provider: string;
  type: string;
  metadata?: any;
}

class VoiceFocusedOrchestrator {
  private openaiKey = Deno.env.get('OPENAI_API_KEY');
  private anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  private elevenlabsKey = Deno.env.get('ELEVENLABS_API_KEY');

  async processRequest(request: AIRequest): Promise<AIResponse> {
    console.log('🎯 Voice-focused processing:', request.type, 'with provider:', request.provider);

    try {
      // Voice-first auto-selection
      if (request.provider === 'auto') {
        request.provider = this.selectVoiceFirstProvider(request.type, request.input);
        console.log('🤖 Auto-selected provider:', request.provider);
      }

      // Prioritize voice interactions
      switch (request.type) {
        case 'voice':
          return await this.handleVoice(request);
        case 'chat':
          return await this.handleChat(request);
        case 'analysis':
          return await this.handleAnalysis(request);
        default:
          throw new Error(`Unsupported request type: ${request.type}`);
      }
    } catch (error) {
      console.error('❌ Error in voice-focused processing:', error);
      return {
        success: false,
        error: error.message,
        provider: request.provider,
        type: request.type
      };
    }
  }

  private selectVoiceFirstProvider(type: string, input: string): 'openai' | 'anthropic' | 'elevenlabs' {
    switch (type) {
      case 'voice':
        return 'elevenlabs'; // ElevenLabs for high-quality TTS
      case 'chat':
        return 'openai'; // OpenAI for voice-friendly chat responses
      case 'analysis':
        return 'anthropic'; // Claude only for deep analysis
      default:
        return 'openai';
    }
  }

  private async handleChat(request: AIRequest): Promise<AIResponse> {
    const { input, context, userId, conversationId } = request;

    // Create Mochi character context
    const mochiContext = `You are Mochi, a friendly garden bee from BeeCrazy Garden World. You're helpful, enthusiastic about gardening and bees, and speak with warmth and knowledge. You help users learn about gardening, bees, and plant care. Always maintain your bee personality while being educational and supportive.

Current context: The user is in ${context?.currentPage || 'the main app'}. ${context?.additionalContext || ''}`;

    let response;
    
    switch (request.provider) {
      case 'openai':
        response = await this.callOpenAI(input, mochiContext);
        break;
      case 'anthropic':
        response = await this.callAnthropic(input, mochiContext);
        break;
      default:
        throw new Error(`Unsupported chat provider: ${request.provider}`);
    }

    // Store conversation if user is logged in
    if (userId && conversationId) {
      await this.storeMessage(conversationId, 'user', input, userId);
      await this.storeMessage(conversationId, 'assistant', response.content, null);
    }

    return {
      success: true,
      data: {
        message: response.content,
        provider: request.provider,
        tokens: response.tokens || null
      },
      provider: request.provider,
      type: 'chat'
    };
  }

  private async handleVoice(request: AIRequest): Promise<AIResponse> {
    if (request.provider !== 'elevenlabs') {
      throw new Error('Voice synthesis only supported with ElevenLabs');
    }

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenlabsKey!,
      },
      body: JSON.stringify({
        text: request.input,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return {
      success: true,
      data: {
        audioContent: audioBase64,
        format: 'mp3'
      },
      provider: 'elevenlabs',
      type: 'voice'
    };
  }


  private async handleAnalysis(request: AIRequest): Promise<AIResponse> {
    // Use Anthropic Claude for deep analysis
    const response = await this.callAnthropic(
      `Provide a detailed analysis of: ${request.input}`,
      'You are an expert analyst. Provide thorough, structured analysis with clear insights and recommendations.'
    );

    return {
      success: true,
      data: {
        analysis: response.content,
        insights: this.extractInsights(response.content)
      },
      provider: 'anthropic',
      type: 'analysis'
    };
  }

  private async callOpenAI(input: string, context: string) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: input }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokens: data.usage?.total_tokens
    };
  }

  private async callAnthropic(input: string, context: string) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicKey!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `${context}\n\nUser: ${input}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text
    };
  }


  private async storeMessage(conversationId: string, type: string, content: string, userId: string | null) {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          type,
          content,
          metadata: { provider: 'master_orchestrator', timestamp: new Date().toISOString() }
        });

      if (error) {
        console.error('Error storing message:', error);
      }
    } catch (error) {
      console.error('Error in storeMessage:', error);
    }
  }

  private extractInsights(analysis: string): string[] {
    // Simple insight extraction - could be enhanced with AI
    const sentences = analysis.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 3).map(s => s.trim());
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: AIRequest = await req.json();
    const orchestrator = new VoiceFocusedOrchestrator();
    const result = await orchestrator.processRequest(requestData);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in master orchestrator:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        provider: 'unknown',
        type: 'unknown'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});