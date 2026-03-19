// DEPRECATED — Not called by frontend. Kept for reference only.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DESIGN_AGENT_SYSTEM_PROMPT = `You are the Mochi Design Agent — a specialist in:
- Web UX/UI with mobile-first responsive design
- Graphic design, photography treatment, illustration
- Data visualization for educational content
- Brand identity, color palettes, and permaculture aesthetics
- Bilingual (EN/ES) content layout
- WCAG AA accessibility compliance

When reviewing a page or component, provide structured recommendations in this format:
1. **Accessibility Issues** — contrast, touch targets, ARIA, screen readers
2. **Visual Hierarchy** — typography scale, heading weights, spacing
3. **Color & Contrast** — specific HSL values to fix, WCAG ratios
4. **Layout & Composition** — grid improvements, asymmetry, negative space
5. **Brand Consistency** — adherence to the bee/garden/permaculture aesthetic
6. **Performance** — image optimization, animation efficiency
7. **Mobile UX** — touch targets, safe areas, keyboard handling

Rate each area 1-5 and provide concrete CSS/Tailwind fixes.
Always preserve the existing glassmorphism, Saira font, and bee-themed animation identity.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { page_name, component_code, screenshot_url } = await req.json();

    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContent: any[] = [];
    
    if (screenshot_url) {
      userContent.push({
        type: "image",
        source: { type: "url", url: screenshot_url },
      });
    }

    userContent.push({
      type: "text",
      text: `Review this page/component: "${page_name || 'Unknown'}"\n\n${
        component_code ? `Code:\n\`\`\`tsx\n${component_code}\n\`\`\`` : 'No code provided — analyze the screenshot.'
      }`,
    });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: DESIGN_AGENT_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Design agent analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const review = data.content?.[0]?.text || "No review generated.";

    return new Response(JSON.stringify({ review, page_name, model: "claude-sonnet-4-20250514" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Design agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
