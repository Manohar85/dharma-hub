/**
 * AI Service for generating personalized spiritual content
 * Uses OpenAI API with fallback to curated content
 */

interface AIResponse {
  content: string;
  timestamp: number;
}

// Cache storage key prefixes
const CACHE_PREFIX = 'dharma-ai-cache';
const DAILY_CACHE_PREFIX = 'dharma-daily';
const WEEKLY_CACHE_PREFIX = 'dharma-weekly';

/**
 * Get or generate daily spiritual message
 */
export async function getDailySpiritualMessage(deity: string): Promise<string> {
  const cacheKey = `${DAILY_CACHE_PREFIX}-message-${deity}`;
  const today = new Date().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const data: AIResponse = JSON.parse(cached);
    if (new Date(data.timestamp).toDateString() === today) {
      return data.content;
    }
  }

  // Generate new message
  const message = await generateSpiritualMessage(deity);
  
  // Cache for today
  localStorage.setItem(cacheKey, JSON.stringify({
    content: message,
    timestamp: Date.now()
  }));

  return message;
}

/**
 * Get or generate weekly zodiac horoscope
 */
export async function getWeeklyHoroscope(zodiacSign: string): Promise<string> {
  const cacheKey = `${WEEKLY_CACHE_PREFIX}-horoscope-${zodiacSign}`;
  const weekStart = getWeekStart().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const data: AIResponse = JSON.parse(cached);
    if (new Date(data.timestamp).toDateString() === weekStart) {
      return data.content;
    }
  }

  // Generate new horoscope
  const horoscope = await generateHoroscope(zodiacSign);
  
  // Cache for the week
  localStorage.setItem(cacheKey, JSON.stringify({
    content: horoscope,
    timestamp: getWeekStart().getTime()
  }));

  return horoscope;
}

/**
 * Get or generate devotional quote
 */
export async function getDevotionalQuote(deity: string): Promise<string> {
  const cacheKey = `${DAILY_CACHE_PREFIX}-quote-${deity}`;
  const today = new Date().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const data: AIResponse = JSON.parse(cached);
    if (new Date(data.timestamp).toDateString() === today) {
      return data.content;
    }
  }

  // Generate new quote
  const quote = await generateQuote(deity);
  
  // Cache for today
  localStorage.setItem(cacheKey, JSON.stringify({
    content: quote,
    timestamp: Date.now()
  }));

  return quote;
}

/**
 * Generate spiritual message using AI or curated content
 */
async function generateSpiritualMessage(deity: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a spiritual guide providing daily devotional messages. Keep responses under 150 words, inspiring and personalized for devotees of ${deity}.`
            },
            {
              role: 'user',
              content: `Generate a brief, uplifting spiritual message for today that connects with ${deity} devotion. Make it warm, encouraging, and meaningful.`
            }
          ],
          max_tokens: 200,
          temperature: 0.8
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

  // Fallback to curated messages
  return getCuratedSpiritualMessage(deity);
}

/**
 * Generate horoscope using AI or curated content
 */
async function generateHoroscope(zodiacSign: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an astrologer providing weekly horoscopes. Keep responses under 200 words, positive and spiritual.`
            },
            {
              role: 'user',
              content: `Generate a weekly horoscope for ${zodiacSign} that is uplifting, spiritually oriented, and provides guidance for the week ahead. Focus on spiritual growth, relationships, and inner peace.`
            }
          ],
          max_tokens: 250,
          temperature: 0.8
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

  // Fallback to curated horoscopes
  return getCuratedHoroscope(zodiacSign);
}

/**
 * Generate quote using AI or curated content
 */
async function generateQuote(deity: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are providing devotional quotes. Keep responses as a single inspiring quote under 100 words related to ${deity}.`
            },
            {
              role: 'user',
              content: `Generate a beautiful, inspiring devotional quote related to ${deity} that can uplift someone's day.`
            }
          ],
          max_tokens: 120,
          temperature: 0.8
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

  // Fallback to curated quotes
  return getCuratedQuote(deity);
}

/**
 * Curated spiritual messages fallback
 */
function getCuratedSpiritualMessage(deity: string): string {
  const messages: Record<string, string[]> = {
    shiva: [
      "Om Namah Shivaya. Today, let Lord Shiva's infinite compassion guide you. Embrace transformation and let go of what no longer serves your highest good. His divine consciousness flows through you, bringing peace and clarity.",
      "On this blessed day, remember that Shiva is both the destroyer of ignorance and the protector of devotees. Meditate on his grace and find strength in your spiritual practice.",
      "As the lord of meditation, Shiva teaches us the power of stillness. Take a moment today to connect with your inner self and feel his divine presence within."
    ],
    krishna: [
      "Radhe Krishna! Today, let Lord Krishna's playful wisdom inspire you. He teaches us that devotion, love, and joy are the paths to the divine. Dance through your day with a light heart.",
      "Krishna's flute calls you to embrace life's melody. Today, find beauty in small moments and let love guide your actions. His divine presence is always with you.",
      "Remember Krishna's teachings: perform your duties without attachment, and trust in the divine plan. Today, let go of worry and embrace faith."
    ],
    vishnu: [
      "Om Namo Bhagavate Vasudevaya. Lord Vishnu, the preserver, protects all who seek him. Today, feel his divine protection and move forward with confidence in your spiritual journey.",
      "Vishnu's cosmic form reminds us of the infinite nature of the divine. On this day, expand your consciousness and see the sacred in all things.",
      "As the protector of dharma, Vishnu guides us toward righteousness. Let your actions today reflect truth, compassion, and divine wisdom."
    ],
    ganesh: [
      "Ganapati Bappa Morya! Lord Ganesha, remover of obstacles, blesses your path today. Approach challenges with wisdom and trust that all barriers will dissolve.",
      "Ganesha's elephant head symbolizes wisdom and strength. Today, use your intelligence to overcome difficulties and his divine grace to find solutions.",
      "The remover of obstacles watches over you. Today, trust in Ganesha's blessings and move forward fearlessly. Every challenge is an opportunity for growth."
    ],
    durga: [
      "Jai Mata Di! Goddess Durga's fierce compassion protects you today. Channel her strength to overcome inner and outer challenges with grace and determination.",
      "As the divine mother, Durga nurtures and protects. Today, feel her loving embrace and draw strength from her infinite power to face any adversity.",
      "Durga teaches us that true power comes from within. Today, connect with your inner strength and let her divine energy flow through you."
    ],
    lakshmi: [
      "Om Shreem Mahalakshmiyei Namaha. Goddess Lakshmi brings abundance in all forms today. Open your heart to receive her blessings of prosperity, wisdom, and inner wealth.",
      "Lakshmi's grace flows where there is gratitude. Today, count your blessings and let her divine abundance manifest in your life through positive actions.",
      "The goddess of wealth and prosperity reminds us that true abundance comes from within. Today, nurture your inner richness and share your blessings with others."
    ],
    other: [
      "On this sacred day, the divine light within you shines brightly. Trust in the cosmic plan and move forward with faith, love, and devotion.",
      "The universe conspires to support your highest good. Today, align with your purpose and let divine grace guide every step you take.",
      "In the silence of your heart, the divine speaks. Take a moment today to listen, to feel, and to connect with the infinite love that surrounds you."
    ]
  };

  const deityMessages = messages[deity] || messages.other;
  return deityMessages[Math.floor(Math.random() * deityMessages.length)];
}

/**
 * Curated horoscope fallback
 */
function getCuratedHoroscope(zodiacSign: string): string {
  const horoscopes: Record<string, string[]> = {
    leo: [
      "This week, your natural leadership shines brightly. The cosmic energies align to bring opportunities for creative expression and spiritual growth. Trust your intuition and take bold steps toward your goals. Your radiant energy will inspire those around you.",
      "The lion's courage guides you this week. Expect positive changes in your relationships and career. Focus on balancing your passionate nature with patience. Spiritual practices will bring deep inner peace.",
      "Leo, this week favors self-expression and personal growth. Your confidence attracts opportunities. Stay grounded while reaching for the stars. Meditation and devotion will enhance your natural magnetism."
    ],
    aries: [
      "This week brings fresh energy and new beginnings. Your pioneering spirit leads you to exciting opportunities. Channel your dynamic energy into spiritual practices for maximum benefit.",
      "Aries, this week is about taking initiative. The stars support your bold moves. Balance action with reflection, and your path will become clear. Trust your instincts."
    ],
    taurus: [
      "This week focuses on stability and grounding. Your steady nature serves you well. Be open to subtle changes that bring long-term happiness. Patience rewards you now."
    ],
    gemini: [
      "This week brings communication and learning opportunities. Your curious mind discovers new spiritual insights. Balance multiple interests while staying focused on your highest goals."
    ],
    cancer: [
      "This week emphasizes emotional depth and intuition. Your nurturing nature serves others and yourself. Protect your energy while sharing your compassionate heart with the world."
    ],
    virgo: [
      "This week supports organization and service. Your attention to detail helps manifest your spiritual goals. Balance perfectionism with acceptance, and find peace in the present moment."
    ],
    libra: [
      "This week focuses on harmony and relationships. Your diplomatic nature brings peace to challenging situations. Find balance between giving and receiving, and honor your own needs."
    ],
    scorpio: [
      "This week brings transformation and deep insights. Your intensity serves your spiritual growth. Embrace change and let go of what no longer serves your highest purpose."
    ],
    sagittarius: [
      "This week expands your horizons through learning and travel. Your adventurous spirit leads to spiritual discoveries. Stay optimistic while remaining grounded in practical matters."
    ],
    capricorn: [
      "This week supports your ambitions and long-term goals. Your disciplined approach brings success. Balance work with spiritual practice for optimal fulfillment and inner peace."
    ],
    aquarius: [
      "This week emphasizes innovation and humanitarian causes. Your unique perspective brings fresh solutions. Connect with like-minded souls and let your visionary spirit shine."
    ],
    pisces: [
      "This week enhances your intuition and creativity. Your compassionate nature serves others beautifully. Balance dreaminess with action, and trust your spiritual insights."
    ]
  };

  const signHoroscopes = horoscopes[zodiacSign] || horoscopes.leo;
  return signHoroscopes[Math.floor(Math.random() * signHoroscopes.length)];
}

/**
 * Curated quotes fallback
 */
function getCuratedQuote(deity: string): string {
  const quotes: Record<string, string[]> = {
    shiva: [
      "Om Namah Shivaya - In Shiva's consciousness, we find the dissolution of all limitations and the embrace of infinite possibility.",
      "Shiva teaches us: 'Let go of attachment, and you will discover the freedom of the soul.'",
      "In meditation, Shiva reveals the truth that all separation is illusion - we are one with the divine."
    ],
    krishna: [
      "Krishna says: 'Do your work without attachment, and you will find true peace.'",
      "In the Bhagavad Gita, Krishna teaches: 'You have the right to work, but never to the fruit of work.'",
      "Radhe Krishna! Love is the highest form of devotion, and Krishna's love knows no bounds."
    ],
    vishnu: [
      "Vishnu protects those who walk the path of dharma with faith and devotion.",
      "In Vishnu's cosmic vision, all beings are connected in the web of divine love.",
      "Vishnu reminds us: 'Preserve truth, protect the righteous, and serve with compassion.'"
    ],
    ganesh: [
      "Ganapati Bappa Morya! Ganesha removes all obstacles when we approach with wisdom and humility.",
      "Ganesha teaches: 'Every challenge is a blessing in disguise, leading to greater understanding.'",
      "With Ganesha's grace, no obstacle is too great, no path too difficult to traverse."
    ],
    durga: [
      "Jai Mata Di! Durga's strength lies not in destruction, but in the protection of all that is sacred.",
      "Durga teaches: 'True power comes from within, from the divine source that never wavers.'",
      "As the divine mother, Durga nurtures, protects, and empowers all her children."
    ],
    lakshmi: [
      "Lakshmi blesses those who live with gratitude, generosity, and devotion to truth.",
      "True wealth flows from inner abundance, and Lakshmi's grace multiplies our blessings.",
      "Lakshmi teaches: 'Prosperity follows those who serve others with a pure heart.'"
    ],
    other: [
      "The divine dwells within each of us - recognize it, honor it, and let it shine.",
      "In devotion, we find the bridge between the finite and the infinite.",
      "Every moment is an opportunity to connect with the divine presence that surrounds and fills us."
    ]
  };

  const deityQuotes = quotes[deity] || quotes.other;
  return deityQuotes[Math.floor(Math.random() * deityQuotes.length)];
}

/**
 * Get start of current week (Monday)
 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(now.setDate(diff));
}

/**
 * Clear old cache entries
 */
export function clearOldCache(): void {
  const today = new Date().toDateString();
  const weekStart = getWeekStart().toDateString();
  
  // Clear old daily cache
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(DAILY_CACHE_PREFIX)) {
      try {
        const data: AIResponse = JSON.parse(localStorage.getItem(key) || '{}');
        if (new Date(data.timestamp).toDateString() !== today) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
    
    // Clear old weekly cache
    if (key.startsWith(WEEKLY_CACHE_PREFIX)) {
      try {
        const data: AIResponse = JSON.parse(localStorage.getItem(key) || '{}');
        if (new Date(data.timestamp).toDateString() !== weekStart) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  });
}
