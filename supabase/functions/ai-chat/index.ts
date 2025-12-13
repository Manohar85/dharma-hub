import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = 'chat' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = `You are a wise and compassionate spiritual assistant for DharmaHub, a Hindu devotional app. Your role is to:
- Answer questions about Hindu spirituality, deities, rituals, and traditions with accuracy and reverence
- Explain Sanskrit slokas, mantras, and their meanings in simple, accessible language
- Suggest appropriate mantras, prayers, or practices based on context
- Provide guidance on festivals, rituals, and spiritual practices
- Be respectful, inclusive, and acknowledge the diversity within Hinduism
- Keep responses concise (under 200 words) unless specifically asked for detailed explanations
- Always end with a blessing or positive spiritual message`;

    if (type === 'spiritual-message') {
      systemPrompt = `You are a spiritual guide providing daily devotional messages. Keep responses under 150 words, inspiring and personalized. Focus on warmth, encouragement, and spiritual meaning.`;
    } else if (type === 'horoscope') {
      systemPrompt = `You are an astrologer providing weekly horoscopes. Keep responses under 200 words, positive and spiritually oriented. Focus on spiritual growth, relationships, and inner peace.`;
    } else if (type === 'quote') {
      systemPrompt = `You are providing devotional quotes. Keep responses as a single inspiring quote under 100 words. Be poetic and uplifting.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
