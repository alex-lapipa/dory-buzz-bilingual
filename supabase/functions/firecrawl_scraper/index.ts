import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CrawlOptions {
  limit?: number;
  includePaths?: string[];
  excludePaths?: string[];
  formats?: string[];
  onlyMainContent?: boolean;
  extractorOptions?: {
    mode: 'llm-extraction';
    extractionPrompt: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      url, 
      action = 'scrape', // 'scrape', 'crawl', or 'extract'
      options = {},
      extractionPrompt 
    } = await req.json();

    if (!url) {
      throw new Error('URL is required');
    }

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    // Initialize Supabase client for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const startTime = Date.now();

    let firecrawlResponse;
    let endpoint;
    let requestBody: any = { url };

    if (action === 'scrape') {
      endpoint = 'https://api.firecrawl.dev/v1/scrape';
      requestBody.formats = options.formats || ['markdown', 'html'];
      requestBody.onlyMainContent = options.onlyMainContent ?? true;
      
      if (extractionPrompt) {
        requestBody.extract = {
          schema: {
            type: 'object',
            properties: {
              extracted_content: {
                type: 'string',
                description: extractionPrompt
              }
            }
          }
        };
      }
    } else if (action === 'crawl') {
      endpoint = 'https://api.firecrawl.dev/v1/crawl';
      requestBody.limit = options.limit || 10;
      requestBody.scrapeOptions = {
        formats: options.formats || ['markdown'],
        onlyMainContent: options.onlyMainContent ?? true
      };
      
      if (options.includePaths) requestBody.includePaths = options.includePaths;
      if (options.excludePaths) requestBody.excludePaths = options.excludePaths;
    }

    console.log(`Making ${action} request to Firecrawl API for: ${url}`);

    firecrawlResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!firecrawlResponse.ok) {
      const error = await firecrawlResponse.text();
      throw new Error(`Firecrawl API error: ${firecrawlResponse.status} - ${error}`);
    }

    const result = await firecrawlResponse.json();
    const responseTime = Date.now() - startTime;

    // Log successful integration
    await supabase.from('mochi_integrations').insert({
      platform: 'firecrawl',
      model: action,
      message_length: url.length,
      response_time_ms: responseTime,
      success: true,
      options: {
        action: action,
        url: url,
        options: options,
        has_extraction: !!extractionPrompt
      }
    });

    console.log(`Firecrawl ${action} successful for: ${url}`);

    // For crawl action, we might need to poll for results
    if (action === 'crawl' && result.id) {
      // Return the crawl job ID for polling
      return new Response(JSON.stringify({ 
        success: true,
        action: 'crawl',
        jobId: result.id,
        status: 'scraping',
        message: 'Crawl job started. Use the job ID to check status.',
        url: url
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      action: action,
      data: result.data || result,
      url: url,
      responseTime: responseTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in firecrawl_scraper function:', error);
    
    // Log failed integration
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('mochi_integrations').insert({
      platform: 'firecrawl',
      model: 'scraper',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message
    });

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});