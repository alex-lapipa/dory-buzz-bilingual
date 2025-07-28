import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FollowDoryRequest {
  name: string;
  email: string;
  parentEmail?: string;
  age?: string;
  isChild: boolean;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, parentEmail, age, isChild, timestamp }: FollowDoryRequest = await req.json();

    console.log(`New follower: ${name} (${email}), Child: ${isChild}, Timestamp: ${timestamp}`);

    // For now, just log the follower data
    // In a production app, you'd save this to a database and set up email automation
    const followerData = {
      name,
      email,
      parentEmail: parentEmail || null,
      age: age || null,
      isChild,
      timestamp,
      source: "BeeCrazy Garden World",
      status: "active"
    };

    console.log("Follower data:", JSON.stringify(followerData, null, 2));

    // TODO: In production, you would:
    // 1. Save follower data to a database
    // 2. Set up email automation for updates
    // 3. Send a welcome email
    // 4. Handle unsubscribe functionality
    // 5. Comply with GDPR/privacy regulations

    // Send a simple success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `¡Buzztastical! Welcome to BeeCrazy Garden World, ${name}! 🐝✨`,
        follower: followerData
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in follow-dory function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);