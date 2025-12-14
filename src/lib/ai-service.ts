/**
 * AI Service for generating personalized spiritual content
 * Uses Lovable AI via edge function
 */

import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  content: string;
  timestamp: number;
}

// Cache storage key prefixes
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

  // Generate new message via edge function
  const message = await generateViaEdgeFunction(
    `Generate a brief, uplifting spiritual message for today that connects with ${deity} devotion. Make it warm, encouraging, and meaningful.`,
    'spiritual-message'
  );
  
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

  // Generate new horoscope via edge function
  const horoscope = await generateViaEdgeFunction(
    `Generate a weekly horoscope for ${zodiacSign} that is uplifting, spiritually oriented, and provides guidance for the week ahead. Focus on spiritual growth, relationships, and inner peace.`,
    'horoscope'
  );
  
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

  // Generate new quote via edge function
  const quote = await generateViaEdgeFunction(
    `Generate a beautiful, inspiring devotional quote related to ${deity} that can uplift someone's day.`,
    'quote'
  );
  
  // Cache for today
  localStorage.setItem(cacheKey, JSON.stringify({
    content: quote,
    timestamp: Date.now()
  }));

  return quote;
}

/**
 * Get daily Bhagavad Gita sloka with translation
 */
export async function getDailyBhagavadGitaSloka(language: string = 'english'): Promise<{
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
}> {
  const cacheKey = `${DAILY_CACHE_PREFIX}-gita-sloka-${language}`;
  const today = new Date().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (new Date(data.timestamp).toDateString() === today) {
        return data.sloka;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // Get a deterministic sloka for today
  const dayOfYear = getDayOfYear(new Date());
  const slokaIndex = dayOfYear % BHAGAVAD_GITA_SLOKAS.length;
  const baseSloka = BHAGAVAD_GITA_SLOKAS[slokaIndex];

  // Get translation in requested language
  const translation = getTranslation(baseSloka, language);
  
  const sloka = {
    chapter: baseSloka.chapter,
    verse: baseSloka.verse,
    sanskrit: baseSloka.sanskrit,
    transliteration: baseSloka.transliteration,
    translation: translation.translation,
    meaning: translation.meaning
  };
  
  // Cache for today
  localStorage.setItem(cacheKey, JSON.stringify({
    sloka,
    timestamp: Date.now()
  }));

  return sloka;
}

/**
 * Generate content via edge function
 */
async function generateViaEdgeFunction(prompt: string, type: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages: [{ role: 'user', content: prompt }],
        type
      }
    });

    if (error) {
      console.error('AI edge function error:', error);
      return getFallbackContent(type);
    }

    return data?.content || getFallbackContent(type);
  } catch (error) {
    console.error('AI request failed:', error);
    return getFallbackContent(type);
  }
}

/**
 * Fallback content when AI is unavailable
 */
function getFallbackContent(type: string): string {
  switch (type) {
    case 'spiritual-message':
      return "The divine presence is always with you, guiding and protecting your path. Trust in the cosmic plan and move forward with faith. 🙏";
    case 'horoscope':
      return "This week brings opportunities for spiritual growth. Trust your intuition and embrace the positive changes coming your way. Focus on inner peace and gratitude.";
    case 'quote':
      return "In devotion, we find the bridge between the finite and the infinite. The divine dwells within each of us. 🕉️";
    default:
      return "May divine blessings be with you always. 🙏";
  }
}

/**
 * Get start of current week (Monday)
 */
function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}

/**
 * Get day of year (1-365)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get translation for a sloka in the requested language
 */
function getTranslation(sloka: typeof BHAGAVAD_GITA_SLOKAS[0], language: string): {
  translation: string;
  meaning: string;
} {
  switch (language.toLowerCase()) {
    case 'telugu':
      return sloka.translations.telugu;
    case 'hindi':
      return sloka.translations.hindi;
    case 'sanskrit':
      return sloka.translations.sanskrit;
    default:
      return sloka.translations.english;
  }
}

/**
 * Curated Bhagavad Gita slokas with translations
 */
const BHAGAVAD_GITA_SLOKAS = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translations: {
      english: {
        translation: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
        meaning: "Focus on your actions without attachment to results. This is the essence of Karma Yoga."
      },
      hindi: {
        translation: "कर्म करने में तुम्हारा अधिकार है, फल में कभी नहीं।",
        meaning: "बिना फल की चिंता किए कर्म करते रहो। यही कर्म योग का सार है।"
      },
      telugu: {
        translation: "కర్మ చేయడంలో నీకు అధికారం ఉంది, ఫలంలో ఎప్పుడూ లేదు.",
        meaning: "ఫలితం గురించి చింతించకుండా కర్మ చేయండి. ఇదే కర్మ యోగం యొక్క సారాంశం."
      },
      sanskrit: {
        translation: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
        meaning: "कर्मयोगस्य सारोऽयम् - फलासक्तिं विना कर्म कुरु।"
      }
    }
  },
  {
    chapter: 2,
    verse: 14,
    sanskrit: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः। आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥",
    transliteration: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ āgamāpāyino 'nityās tāṁs titikṣasva bhārata",
    translations: {
      english: {
        translation: "The contact of senses with their objects gives rise to feelings of cold, heat, pleasure and pain. They come and go, being impermanent. Bear them patiently.",
        meaning: "All experiences are temporary. Learn to remain equanimous through life's ups and downs."
      },
      hindi: {
        translation: "इंद्रियों का विषयों से संपर्क सर्दी-गर्मी, सुख-दुख देता है। ये आते-जाते हैं। इन्हें सहन करो।",
        meaning: "सभी अनुभव अस्थायी हैं। जीवन के उतार-चढ़ाव में समभाव रखना सीखो।"
      },
      telugu: {
        translation: "ఇంద్రియాలు వస్తువులతో సంపర్కం చలి-వేడి, సుఖ-దుఃఖాలను ఇస్తుంది. వారు వస్తారు, పోతారు. వాటిని సహించు.",
        meaning: "అన్ని అనుభవాలు తాత్కాలికం. జీవితంలో సమతుల్యత నేర్చుకోండి."
      },
      sanskrit: {
        translation: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।",
        meaning: "सर्वाणि अनुभवानि अनित्यानि। समत्वं शिक्षस्व।"
      }
    }
  },
  {
    chapter: 4,
    verse: 7,
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
    translations: {
      english: {
        translation: "Whenever there is a decline in righteousness and an increase in unrighteousness, I manifest Myself.",
        meaning: "The Divine protects dharma in every age. Have faith that righteousness will always prevail."
      },
      hindi: {
        translation: "जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं स्वयं को प्रकट करता हूँ।",
        meaning: "भगवान हर युग में धर्म की रक्षा करते हैं। विश्वास रखो कि सत्य की जीत होगी।"
      },
      telugu: {
        translation: "ధర్మానికి హాని, అధర్మానికి వృద్ధి జరిగినప్పుడు, నేను నన్ను ప్రకటించుకుంటాను.",
        meaning: "భగవంతుడు ప్రతి యుగంలో ధర్మాన్ని రక్షిస్తాడు. న్యాయం గెలుస్తుందని నమ్మండి."
      },
      sanskrit: {
        translation: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।",
        meaning: "भगवान् धर्मं रक्षति सर्वदा। श्रद्धां धारय।"
      }
    }
  },
  {
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translations: {
      english: {
        translation: "One must elevate oneself by one's own mind, not degrade oneself. The mind can be the friend or the enemy of the self.",
        meaning: "You have the power to uplift or bring yourself down. Choose thoughts that elevate your spirit."
      },
      hindi: {
        translation: "अपने मन से स्वयं को ऊपर उठाओ, गिराओ नहीं। मन ही आत्मा का मित्र है और मन ही शत्रु।",
        meaning: "तुम्हारे पास खुद को ऊपर उठाने या गिराने की शक्ति है। ऐसे विचार चुनो जो आत्मा को ऊंचा करें।"
      },
      telugu: {
        translation: "తన మనస్సుతో తనను తాను ఉద్ధరించుకోవాలి, పతనం చెందకూడదు. మనస్సే స్నేహితుడు, మనస్సే శత్రువు.",
        meaning: "మిమ్మల్ని మీరు ఎదగడానికి లేదా పడిపోవడానికి శక్తి మీ దగ్గరే ఉంది. ఆత్మను ఉన్నతం చేసే ఆలోచనలు ఎంచుకోండి."
      },
      sanskrit: {
        translation: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
        meaning: "स्वस्य उन्नतये वा पतनाय शक्तिः त्वय्येव। सद्विचारान् चिनुहि।"
      }
    }
  },
  {
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    translations: {
      english: {
        translation: "Those who worship Me with exclusive devotion, meditating on Me without any other thought – to them I carry what they lack and preserve what they have.",
        meaning: "Complete surrender to the Divine brings total protection and provision. Trust in divine care."
      },
      hindi: {
        translation: "जो अनन्य भक्ति से मेरा चिंतन करते हुए मेरी उपासना करते हैं, उनका योगक्षेम मैं वहन करता हूँ।",
        meaning: "पूर्ण समर्पण से दैवी सुरक्षा और प्रदान मिलता है। ईश्वर पर विश्वास रखो।"
      },
      telugu: {
        translation: "అనన్య భక్తితో నన్ను ధ్యానిస్తూ ఆరాధించే వారి యోగక్షేమం నేను భరిస్తాను.",
        meaning: "పూర్తి శరణాగతితో దైవ రక్షణ మరియు అందుకుంటారు. దైవంపై నమ్మకం ఉంచండి."
      },
      sanskrit: {
        translation: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।",
        meaning: "पूर्णशरणागत्या दैवी रक्षा प्राप्यते। ईश्वरे विश्वसिहि।"
      }
    }
  },
  {
    chapter: 18,
    verse: 66,
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
    translations: {
      english: {
        translation: "Abandon all varieties of dharma and surrender unto Me alone. I shall deliver you from all sinful reactions; do not grieve.",
        meaning: "Complete surrender to the Divine is the ultimate path. Let go of all worries and trust in divine grace."
      },
      hindi: {
        translation: "सभी धर्मों को त्यागकर केवल मेरी शरण में आ जाओ। मैं तुम्हें सब पापों से मुक्त करूंगा, शोक मत करो।",
        meaning: "ईश्वर के प्रति पूर्ण समर्पण ही परम मार्ग है। सभी चिंताएं छोड़ो और दैवी कृपा पर विश्वास रखो।"
      },
      telugu: {
        translation: "అన్ని ధర్మాలను వదిలి నా శరణు మాత్రమే రా. నేను నిన్ను అన్ని పాపాల నుండి విముక్తి చేస్తాను, దుఃఖించకు.",
        meaning: "దైవానికి పూర్తి శరణాగతి అంతిమ మార్గం. అన్ని ఆందోళనలు వదిలి దైవ కృపను నమ్ముకోండి."
      },
      sanskrit: {
        translation: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।",
        meaning: "पूर्णशरणागतिः परमो मार्गः। सर्वाः चिन्ताः त्यज दैवीकृपायां विश्वसिहि।"
      }
    }
  },
  {
    chapter: 12,
    verse: 13,
    sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥",
    transliteration: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
    translations: {
      english: {
        translation: "One who is free from enmity towards all beings, friendly and compassionate, without possessiveness and ego, equal in pleasure and pain, and forgiving.",
        meaning: "These are the qualities of a true devotee. Cultivate compassion and equanimity in your heart."
      },
      hindi: {
        translation: "जो सभी प्राणियों से द्वेष नहीं रखता, मित्रवत और करुणामय है, अहंकार रहित है, सुख-दुख में समान और क्षमाशील है।",
        meaning: "ये सच्चे भक्त के गुण हैं। अपने हृदय में करुणा और समता विकसित करो।"
      },
      telugu: {
        translation: "అన్ని ప్రాణులపై ద్వేషం లేని, స్నేహపూర్వక మరియు కరుణామయుడు, అహంకారం లేని, సుఖ-దుఃఖాలలో సమానంగా, క్షమాశీలుడు.",
        meaning: "ఇవి నిజమైన భక్తుని లక్షణాలు. మీ హృదయంలో కరుణ మరియు సమత్వం పెంచుకోండి."
      },
      sanskrit: {
        translation: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च।",
        meaning: "एते सद्भक्तस्य गुणाः। करुणां समतां च हृदये पोषय।"
      }
    }
  }
];

/**
 * Clear old cache entries
 */
export function clearOldCache(): void {
  const today = new Date().toDateString();
  const weekStart = getWeekStart().toDateString();
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(DAILY_CACHE_PREFIX)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (new Date(data.timestamp).toDateString() !== today) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
    
    if (key.startsWith(WEEKLY_CACHE_PREFIX)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (new Date(data.timestamp).toDateString() !== weekStart) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  });
}
