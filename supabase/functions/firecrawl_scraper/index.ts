import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/* ── Chunking helpers ── */

function chunkMarkdown(markdown: string, maxChunkSize = 1200): string[] {
  const sections = markdown.split(/\n#{1,3}\s/);
  const chunks: string[] = [];

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed || trimmed.length < 40) continue;

    if (trimmed.length <= maxChunkSize) {
      chunks.push(trimmed);
    } else {
      // Split large sections by double newline, then combine
      const paragraphs = trimmed.split(/\n\n+/);
      let current = '';
      for (const para of paragraphs) {
        if ((current + '\n\n' + para).length > maxChunkSize && current.length > 0) {
          chunks.push(current.trim());
          current = para;
        } else {
          current = current ? current + '\n\n' + para : para;
        }
      }
      if (current.trim().length > 40) chunks.push(current.trim());
    }
  }
  return chunks;
}

function extractTitle(chunk: string): string {
  const firstLine = chunk.split('\n')[0].replace(/^#+\s*/, '').trim();
  return firstLine.length > 120 ? firstLine.substring(0, 117) + '...' : firstLine || 'Untitled Section';
}

function inferCategory(domain: string, content: string): string {
  const lower = content.toLowerCase();
  if (domain === 'permaculture' || domain === 'garden') {
    if (lower.includes('seed')) return 'seeds';
    if (lower.includes('compost')) return 'permaculture';
    if (lower.includes('soil')) return 'permaculture';
    return 'garden_basics';
  }
  if (lower.includes('pollination') || lower.includes('pollen')) return 'bee_biology';
  if (lower.includes('honey') || lower.includes('hive')) return 'bee_culture';
  if (lower.includes('queen') || lower.includes('worker') || lower.includes('drone')) return 'bee_biology';
  return domain === 'bee_biology' ? 'bee_biology' : 'general';
}

function extractTags(content: string): string[] {
  const tagWords = [
    'pollination', 'honey', 'beeswax', 'queen', 'worker', 'drone', 'colony',
    'hive', 'nectar', 'pollen', 'flower', 'garden', 'compost', 'soil',
    'permaculture', 'seed', 'organic', 'biodiversity', 'ecosystem', 'habitat',
    'endangered', 'conservation', 'pesticide', 'native', 'wildflower',
  ];
  const lower = content.toLowerCase();
  return tagWords.filter(w => lower.includes(w)).slice(0, 8);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const {
      url,
      domain = 'bee_biology',
      action = 'scrape',
      options = {},
      category_override,
      source_label,
    } = await req.json();

    if (!url) throw new Error('URL is required');

    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) throw new Error('Firecrawl API key not configured');

    const startTime = Date.now();

    // 1. Create crawl_jobs record
    const { data: jobRow } = await supabase.from('crawl_jobs').insert({
      url,
      domain,
      status: 'scraping',
      started_at: new Date().toISOString(),
    }).select('id').single();

    const jobId = jobRow?.id;
    console.log(`[${jobId}] Starting ${action} for ${url}`);

    // 2. Call Firecrawl
    const endpoint = action === 'crawl'
      ? 'https://api.firecrawl.dev/v1/crawl'
      : 'https://api.firecrawl.dev/v1/scrape';

    const requestBody: any = { url };
    if (action === 'scrape') {
      requestBody.formats = ['markdown'];
      requestBody.onlyMainContent = true;
    } else {
      requestBody.limit = options.limit || 10;
      requestBody.scrapeOptions = { formats: ['markdown'], onlyMainContent: true };
      if (options.includePaths) requestBody.includePaths = options.includePaths;
      if (options.excludePaths) requestBody.excludePaths = options.excludePaths;
    }

    const firecrawlRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!firecrawlRes.ok) {
      const errText = await firecrawlRes.text();
      throw new Error(`Firecrawl ${firecrawlRes.status}: ${errText}`);
    }

    const result = await firecrawlRes.json();

    // 3. Extract markdown content
    let markdownPages: { markdown: string; sourceUrl: string }[] = [];

    if (action === 'scrape') {
      const md = result.data?.markdown || result.markdown || '';
      if (md) markdownPages.push({ markdown: md, sourceUrl: url });
    } else if (action === 'crawl' && result.data) {
      for (const page of result.data) {
        if (page.markdown) {
          markdownPages.push({ markdown: page.markdown, sourceUrl: page.metadata?.sourceURL || url });
        }
      }
    }

    if (markdownPages.length === 0) {
      // If crawl returns an id (async), update job and return
      if (result.id) {
        await supabase.from('crawl_jobs').update({
          status: 'pending',
          firecrawl_id: result.id,
        }).eq('id', jobId);

        return new Response(JSON.stringify({
          success: true,
          jobId,
          firecrawlId: result.id,
          status: 'pending',
          message: 'Async crawl started. Check back later.',
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      throw new Error('No markdown content extracted from page');
    }

    // 4. Chunk all pages
    const allChunks: { title: string; content: string; category: string; tags: string[]; source: string }[] = [];

    for (const page of markdownPages) {
      const chunks = chunkMarkdown(page.markdown);
      for (const chunk of chunks) {
        allChunks.push({
          title: extractTitle(chunk),
          content: chunk,
          category: category_override || inferCategory(domain, chunk),
          tags: extractTags(chunk),
          source: source_label || new URL(page.sourceUrl).hostname,
        });
      }
    }

    console.log(`[${jobId}] Chunked into ${allChunks.length} pieces`);

    // 5. Insert into mochi_knowledge_base
    let inserted = 0;
    const batchSize = 20;
    for (let i = 0; i < allChunks.length; i += batchSize) {
      const batch = allChunks.slice(i, i + batchSize).map(c => ({
        title: c.title,
        content: c.content,
        category: c.category,
        domain,
        source: c.source,
        tags: c.tags,
        language: 'en',
        age_level: 'all',
      }));

      const { error: insertErr, data: insertData } = await supabase
        .from('mochi_knowledge_base')
        .insert(batch)
        .select('id');

      if (insertErr) {
        console.error(`[${jobId}] Insert error batch ${i}:`, insertErr.message);
      } else {
        inserted += insertData?.length || 0;
      }
    }

    // 6. Trigger mochi_embed to generate embeddings for the new rows
    let embedResult = { embedded: 0, errors: [] };
    try {
      const embedRes = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/functions/v1/mochi_embed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      );
      if (embedRes.ok) {
        embedResult = await embedRes.json();
      }
    } catch (embedErr) {
      console.error(`[${jobId}] Embed trigger error:`, embedErr);
    }

    const responseTime = Date.now() - startTime;

    // 7. Update crawl_jobs
    await supabase.from('crawl_jobs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      chunks_created: inserted,
      nodes_created: embedResult.embedded || 0,
    }).eq('id', jobId);

    // 8. Log integration
    await supabase.from('mochi_integrations').insert({
      platform: 'firecrawl',
      model: action,
      message_length: url.length,
      response_time_ms: responseTime,
      success: true,
      options: { url, domain, chunks: inserted, embedded: embedResult.embedded },
    });

    console.log(`[${jobId}] Done: ${inserted} chunks, ${embedResult.embedded} embedded in ${responseTime}ms`);

    return new Response(JSON.stringify({
      success: true,
      jobId,
      url,
      domain,
      chunks_created: inserted,
      embedded: embedResult.embedded,
      responseTime,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('firecrawl_scraper error:', error);

    await supabase.from('mochi_integrations').insert({
      platform: 'firecrawl',
      model: 'scraper',
      message_length: 0,
      response_time_ms: 0,
      success: false,
      error_message: error.message,
    });

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
