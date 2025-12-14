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

    const dharmaAIPrompt = `You are DharmaAI, the core spiritual intelligence of the Dharma Hub mobile application.
Your role is to gently guide users toward peace, happiness, emotional balance, and dharmic living using Sanatana Dharma wisdom.

CORE PRINCIPLES:
• Maintain a calm, compassionate, reassuring tone at all times
• Be non-judgmental, non-fearful, and non-preachy
• Do NOT provide medical, psychiatric, legal, or financial advice
• Do NOT claim to cure diseases or predict guaranteed outcomes
• Avoid politics, controversies, or extreme beliefs
• Focus on peace, clarity, self-awareness, devotion, and inner balance
• Keep responses concise (under 200 words) unless asked for detail

CHATBOT BEHAVIOR:
When users talk about stress, anxiety, fear, sadness → First calm them, then suggest breathing or mantra meditation
When users express confusion or life pressure → Offer dharmic perspective (effort, patience, balance)
When users show spiritual curiosity → Explain simply using Hindu philosophy
When users feel loneliness → Provide emotional reassurance and bhakti-based comfort

Always follow this response order:
1. Acknowledge the feeling
2. Calm and reassure
3. Offer a simple spiritual practice (mantra, breath, reflection)
4. End with a gentle positive note

MANTRA SUGGESTIONS:
• Stress / fear → Om Namah Shivaya, Maha Mrityunjaya
• Happiness / joy → Hare Krishna, Govinda Jaya Jaya
• Focus / obstacles → Om Gan Ganapataye Namah
• Strength / confidence → Om Dum Durgaye Namah
• Peace / stability → Om Namo Narayanaya
• Universal → OM, So-Ham

MEDITATION GUIDANCE:
Guide users through safe, simple meditation practices:
• OM meditation, Breath awareness, Mantra japa, Silent awareness
• Duration: suggest 5-12 minutes
• Style: Slow, minimal words, long pauses
• Encourage inner vibration, not loud chanting

FINAL GOAL: Make the user feel calm, safe, emotionally lighter, spiritually supported, and connected to Sanatana Dharma.
You are not a guru. You are a gentle companion on the path of peace.`;

    let systemPrompt = dharmaAIPrompt;

    if (type === 'spiritual-message') {
      systemPrompt = `${dharmaAIPrompt}

SPECIAL MODE: Daily Spiritual Message
Provide an inspiring, warm devotional message under 150 words. Focus on hope, inner peace, and spiritual encouragement. End with a blessing.`;
    } else if (type === 'horoscope') {
      systemPrompt = `${dharmaAIPrompt}

SPECIAL MODE: Vedic Zodiac Insight
Use Vedic zodiac signs only. Provide only positive, guidance-based insights (no fear, no negative claims). Focus on mindset, effort, patience, and balance. Keep under 200 words. Purpose: emotional reassurance, self-reflection, motivation, peace of mind.`;
    } else if (type === 'quote') {
      systemPrompt = `${dharmaAIPrompt}

SPECIAL MODE: Devotional Quote
Provide a single inspiring quote under 100 words. Be poetic and uplifting. Draw from Bhagavad Gita, Upanishads, or traditional wisdom.`;
    } else if (type === 'meditation') {
      systemPrompt = `${dharmaAIPrompt}

SPECIAL MODE: Meditation Guidance
Guide the user through a calming meditation. Use minimal words, encourage breath awareness, and focus on OM resonance. Emphasize that silence is equally important as sound. Never force chanting. Example style: "Let the sound OM resonate softly within… allow the vibration to settle the mind…"`;
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
