/**
 * AI Devotional Assistant
 * Answers spiritual questions, explains slokas, suggests mantras
 */

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Get AI response for spiritual questions
 */
export async function getAIResponse(
  question: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  if (apiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are a wise and compassionate spiritual assistant for DharmaHub, a Hindu devotional app. Your role is to:
- Answer questions about Hindu spirituality, deities, rituals, and traditions with accuracy and reverence
- Explain Sanskrit slokas, mantras, and their meanings in simple, accessible language
- Suggest appropriate mantras, prayers, or practices based on context
- Provide guidance on festivals, rituals, and spiritual practices
- Be respectful, inclusive, and acknowledge the diversity within Hinduism
- Keep responses concise (under 200 words) unless specifically asked for detailed explanations
- Always end with a blessing or positive spiritual message`
        },
        ...conversationHistory.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: question
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 300,
          temperature: 0.7
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (error) {
      console.warn('OpenAI API error, using fallback:', error);
    }
  }

  // Fallback responses
  return getFallbackResponse(question);
}

/**
 * Fallback responses for common questions
 */
function getFallbackResponse(question: string): string {
  const lowerQuestion = question.toLowerCase();

  // Mantra suggestions
  if (lowerQuestion.includes('mantra') || lowerQuestion.includes('prayer')) {
    if (lowerQuestion.includes('shiva')) {
      return "Om Namah Shivaya is the powerful five-syllable mantra of Lord Shiva. Chanting this mantra with devotion brings peace, removes obstacles, and connects you with divine consciousness. Repeat it 108 times daily during meditation. May Lord Shiva's blessings be with you. 🙏";
    }
    if (lowerQuestion.includes('krishna') || lowerQuestion.includes('vishnu')) {
      return "Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare is the Mahamantra that purifies consciousness and brings divine love. The Gayatri Mantra (Om Bhur Bhuva Swaha...) is also excellent for spiritual growth. Chant with devotion and pure intention. Radhe Krishna! 🕉️";
    }
    return "Om is the primordial sound of the universe. The Gayatri Mantra is powerful for daily practice: 'Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat.' Chant with sincerity and devotion. 🙏";
  }

  // Sloka explanations
  if (lowerQuestion.includes('sloka') || lowerQuestion.includes('meaning') || lowerQuestion.includes('explain')) {
    return "Slokas are sacred verses from Hindu scriptures like the Bhagavad Gita, Vedas, and Puranas. Each sloka carries deep spiritual wisdom. To explain a specific sloka, please share the Sanskrit text or the verse you're curious about. I'll help you understand its meaning and significance. 📿";
  }

  // Festival questions
  if (lowerQuestion.includes('festival') || lowerQuestion.includes('celebration')) {
    return "Hindu festivals celebrate the divine in various forms. Major festivals include Diwali (festival of lights), Holi (festival of colors), Navratri (nine nights of the Goddess), and Mahashivratri (night of Shiva). Each festival has deep spiritual significance and brings devotees together in devotion. May these celebrations fill your life with joy and spiritual growth. 🪔";
  }

  // General spiritual guidance
  if (lowerQuestion.includes('pray') || lowerQuestion.includes('meditate') || lowerQuestion.includes('practice')) {
    return "Daily spiritual practice (sadhana) is essential for growth. Start your day with prayers, light a lamp, chant mantras, and offer gratitude. Regular meditation brings inner peace. Remember, devotion (bhakti) is about sincere intention, not perfection. The divine accepts your efforts with love. May your spiritual journey be blessed. 🪷";
  }

  // Default response
  return "Thank you for your spiritual question. I'm here to help with questions about Hindu spirituality, mantras, slokas, festivals, and practices. Could you please rephrase your question or be more specific? I'd be happy to provide guidance. May you be blessed on your spiritual path. 🙏";
}

/**
 * Suggest mantra based on context
 */
export async function suggestMantra(
  deity: string,
  purpose: string = 'general'
): Promise<string> {
  const mantras: Record<string, Record<string, string>> = {
    shiva: {
      general: "Om Namah Shivaya - The five-syllable mantra of Lord Shiva, bestows peace and removes obstacles.",
      peace: "Om Namah Shivaya - Chant 108 times for inner peace and clarity.",
      protection: "Tryapaakambhagambheem, Sahasraaksham Trilochanam - Shiva's protective mantra."
    },
    krishna: {
      general: "Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare - The Mahamantra for divine love.",
      peace: "Om Namo Bhagavate Vasudevaya - Salutations to Lord Krishna, brings peace.",
      protection: "Krishnaya Vasudevaya Haraye Paramatmane - For Krishna's protection."
    },
    vishnu: {
      general: "Om Namo Narayanaya - Sacred mantra of Lord Vishnu, the preserver.",
      peace: "Om Vishnave Namah - Simple and powerful Vishnu mantra.",
      protection: "Om Namo Bhagavate Vasudevaya - For Vishnu's divine protection."
    },
    ganesh: {
      general: "Om Gam Ganapataye Namaha - Remove obstacles and bring wisdom.",
      success: "Om Ganeshaya Namah - For success in new beginnings.",
      wisdom: "Om Vakratunda Mahakaya - Ganesha's wisdom mantra."
    },
    durga: {
      general: "Om Dum Durgayei Namaha - Powerful protection and strength.",
      protection: "Sarva Mangala Mangalye - Durga's protective mantra.",
      strength: "Ya Devi Sarva Bhuteshu - Invoke the Goddess in all forms."
    },
    lakshmi: {
      general: "Om Shreem Mahalakshmiyei Namaha - Invoke abundance and prosperity.",
      wealth: "Om Hreem Shreem Kleem Mahalakshmi Namaha - For material and spiritual wealth.",
      prosperity: "Om Shreem Lakshmi Namah - Simple Lakshmi mantra."
    }
  };

  const deityMantras = mantras[deity] || mantras.shiva;
  return deityMantras[purpose] || deityMantras.general;
}
