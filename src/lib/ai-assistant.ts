/**
 * AI Devotional Assistant
 * Uses Lovable AI via edge function for secure AI calls
 */

import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Get AI response for spiritual questions via edge function
 */
export async function getAIResponse(
  question: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const messages = conversationHistory.slice(-5).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    messages.push({ role: 'user', content: question });

    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: { messages, type: 'chat' }
    });

    if (error) {
      console.error('AI chat error:', error);
      return getFallbackResponse(question);
    }

    return data?.content || getFallbackResponse(question);
  } catch (error) {
    console.error('AI request failed:', error);
    return getFallbackResponse(question);
  }
}

/**
 * Fallback responses for common questions
 */
function getFallbackResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('mantra') || lowerQuestion.includes('prayer')) {
    if (lowerQuestion.includes('shiva')) {
      return "Om Namah Shivaya is the powerful five-syllable mantra of Lord Shiva. Chanting this mantra with devotion brings peace and removes obstacles. 🙏";
    }
    return "Om is the primordial sound of the universe. The Gayatri Mantra is powerful for daily practice. Chant with sincerity and devotion. 🙏";
  }

  if (lowerQuestion.includes('festival')) {
    return "Hindu festivals celebrate the divine in various forms. Major festivals include Diwali, Holi, Navratri, and Mahashivratri. Each has deep spiritual significance. 🪔";
  }

  return "Thank you for your spiritual question. I'm here to help with questions about Hindu spirituality, mantras, slokas, festivals, and practices. May you be blessed on your spiritual path. 🙏";
}

/**
 * Suggest mantra based on context
 */
export async function suggestMantra(
  deity: string,
  purpose: string = 'general'
): Promise<string> {
  const mantras: Record<string, Record<string, string>> = {
    shiva: { general: "Om Namah Shivaya", peace: "Om Namah Shivaya - Chant 108 times for peace." },
    krishna: { general: "Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare" },
    vishnu: { general: "Om Namo Narayanaya" },
    ganesh: { general: "Om Gam Ganapataye Namaha" },
    durga: { general: "Om Dum Durgayei Namaha" },
    lakshmi: { general: "Om Shreem Mahalakshmiyei Namaha" }
  };

  const deityMantras = mantras[deity] || mantras.shiva;
  return deityMantras[purpose] || deityMantras.general;
}
