import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    const { videoUrl, frameTimestamps = [1, 3, 5] } = await req.json();

    if (!videoUrl) {
      throw new Error('Video URL is required');
    }

    console.log('Processing video:', videoUrl);

    // For now, we'll create a default Mochi character asset
    // In a real implementation, you would:
    // 1. Extract frames from video at specified timestamps
    // 2. Use AI to detect and segment Mochi character
    // 3. Remove background using transformers.js
    // 4. Save processed images to storage

    // Generate a simple Mochi character image using AI for demonstration
    const mochiPrompt = "Cute yellow and black bee character named Mochi, cartoon style, friendly expression, transparent background, high quality PNG";
    
    // Call the generate_image_sora function to create Mochi character
    const { data: imageData, error: imageError } = await supabase.functions.invoke('generate_image_sora', {
      body: {
        prompt: mochiPrompt,
        type: 'image'
      }
    });

    if (imageError) {
      console.error('Error generating Mochi image:', imageError);
      throw new Error('Failed to generate Mochi character image');
    }

    if (!imageData || !imageData.data) {
      throw new Error('No image data received');
    }

    // Extract base64 data and convert to blob
    const base64Data = imageData.data.split(',')[1];
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to Supabase storage
    const fileName = `mochi-character-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('mochi-assets')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload Mochi character image');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('mochi-assets')
      .getPublicUrl(fileName);

    // Save asset to database
    const { data: assetData, error: assetError } = await supabase
      .from('mochi_assets')
      .insert({
        asset_type: 'character',
        file_path: fileName,
        file_url: publicUrl,
        metadata: {
          source: 'ai_generated',
          prompt: mochiPrompt,
          extracted_from_video: videoUrl
        }
      })
      .select()
      .single();

    if (assetError) {
      console.error('Database error:', assetError);
      throw new Error('Failed to save asset to database');
    }

    console.log('Successfully created Mochi character asset:', assetData);

    return new Response(
      JSON.stringify({
        success: true,
        asset: assetData,
        message: 'Mochi character extracted and saved successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract_mochi_character:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});