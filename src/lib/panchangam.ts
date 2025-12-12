/**
 * Panchangam Service
 * Provides daily Hindu calendar information: Tithi, Nakshatra, Yoga, Karana
 */

export interface Panchangam {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  paksha: string;
  month: string;
  auspiciousTimings: {
    abhijit: string;
    amrit: string;
    brahma: string;
  };
  inauspiciousTimings: {
    rahu: string;
    yamaganda: string;
    gulika: string;
  };
  sunrise: string;
  sunset: string;
  moonRise: string;
}

/**
 * Tithi names
 */
const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
];

/**
 * Nakshatra names
 */
const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshta', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

/**
 * Yoga names
 */
const YOGAS = [
  'Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyana', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

/**
 * Karana names
 */
const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga',
  'Kimstughna'
];

/**
 * Get Panchangam for today
 */
export async function getTodayPanchangam(): Promise<Panchangam> {
  const cacheKey = 'panchangam-today';
  const today = new Date().toDateString();
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (data.date === today) {
        return data.panchangam;
      }
    } catch {
      // Invalid cache
    }
  }

  // Calculate Panchangam (simplified calculation)
  // In production, use a proper Panchangam API or library
  const panchangam = calculatePanchangam(new Date());

  // Cache for today
  localStorage.setItem(cacheKey, JSON.stringify({
    date: today,
    panchangam
  }));

  return panchangam;
}

/**
 * Calculate Panchangam for a given date
 * This is a simplified version - in production, use proper astronomical calculations
 */
function calculatePanchangam(date: Date): Panchangam {
  // Simplified calculation based on date
  // In production, integrate with a Panchangam API like drikPanchang.com API
  
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate lunar day (simplified)
  const lunarCycle = 30; // Approximate
  const tithiIndex = dayOfYear % lunarCycle;
  const tithi = TITHIS[tithiIndex % TITHIS.length];
  
  // Determine Paksha (waxing or waning)
  const paksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';

  // Calculate Nakshatra (simplified)
  const nakshatraIndex = (dayOfYear * 0.9) % NAKSHATRAS.length;
  const nakshatra = NAKSHATRAS[Math.floor(nakshatraIndex)];

  // Calculate Yoga (simplified)
  const yogaIndex = (dayOfYear * 0.8) % YOGAS.length;
  const yoga = YOGAS[Math.floor(yogaIndex)];

  // Calculate Karana
  const karanaIndex = (dayOfYear * 2) % KARANAS.length;
  const karana = KARANAS[Math.floor(karanaIndex)];

  // Month names
  const months = [
    'Chaitra', 'Vaisakha', 'Jyeshtha', 'Ashadha',
    'Shravana', 'Bhadrapada', 'Ashwin', 'Kartika',
    'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
  ];
  const month = months[date.getMonth()];

  // Calculate auspicious/inauspicious timings (simplified)
  const hour = date.getHours();
  const abhijit = calculateAbhijitMuhurta(date);
  const amrit = calculateAmritKala(date);
  const brahma = calculateBrahmaMuhurta(date);
  
  const rahu = calculateRahuKala(date);
  const yamaganda = calculateYamagandaKala(date);
  const gulika = calculateGulikaKala(date);

  // Sunrise/Sunset (simplified - in production use location-based calculations)
  const sunrise = '6:00 AM';
  const sunset = '6:30 PM';
  const moonRise = '8:00 PM';

  return {
    date: date.toDateString(),
    tithi: `${tithi} (${paksha})`,
    nakshatra,
    yoga,
    karana,
    paksha,
    month,
    auspiciousTimings: {
      abhijit,
      amrit,
      brahma
    },
    inauspiciousTimings: {
      rahu,
      yamaganda,
      gulika
    },
    sunrise,
    sunset,
    moonRise
  };
}

/**
 * Calculate Abhijit Muhurta (most auspicious time)
 */
function calculateAbhijitMuhurta(date: Date): string {
  // Abhijit Muhurta is approximately 24 minutes before and after noon
  // Simplified calculation
  return '11:36 AM - 12:24 PM';
}

/**
 * Calculate Amrit Kala
 */
function calculateAmritKala(date: Date): string {
  // Amrit Kala varies - simplified
  return '9:00 AM - 10:30 AM';
}

/**
 * Calculate Brahma Muhurta (early morning auspicious time)
 */
function calculateBrahmaMuhurta(date: Date): string {
  // Brahma Muhurta is 1.5 hours before sunrise
  return '4:30 AM - 5:30 AM';
}

/**
 * Calculate Rahu Kala (inauspicious time)
 */
function calculateRahuKala(date: Date): string {
  // Rahu Kala varies by day of week
  const dayOfWeek = date.getDay();
  const rahuTimings: Record<number, string> = {
    0: '4:30 PM - 6:00 PM', // Sunday
    1: '7:30 AM - 9:00 AM', // Monday
    2: '3:00 PM - 4:30 PM', // Tuesday
    3: '12:00 PM - 1:30 PM', // Wednesday
    4: '1:30 PM - 3:00 PM', // Thursday
    5: '10:30 AM - 12:00 PM', // Friday
    6: '9:00 AM - 10:30 AM' // Saturday
  };
  return rahuTimings[dayOfWeek] || '10:30 AM - 12:00 PM';
}

/**
 * Calculate Yamaganda Kala
 */
function calculateYamagandaKala(date: Date): string {
  const dayOfWeek = date.getDay();
  const yamagandaTimings: Record<number, string> = {
    0: '12:00 PM - 1:30 PM',
    1: '10:30 AM - 12:00 PM',
    2: '9:00 AM - 10:30 AM',
    3: '7:30 AM - 9:00 AM',
    4: '3:00 PM - 4:30 PM',
    5: '1:30 PM - 3:00 PM',
    6: '12:00 PM - 1:30 PM'
  };
  return yamagandaTimings[dayOfWeek] || '12:00 PM - 1:30 PM';
}

/**
 * Calculate Gulika Kala
 */
function calculateGulikaKala(date: Date): string {
  const dayOfWeek = date.getDay();
  const gulikaTimings: Record<number, string> = {
    0: '1:30 PM - 3:00 PM',
    1: '9:00 AM - 10:30 AM',
    2: '1:30 PM - 3:00 PM',
    3: '3:00 PM - 4:30 PM',
    4: '12:00 PM - 1:30 PM',
    5: '7:30 AM - 9:00 AM',
    6: '10:30 AM - 12:00 PM'
  };
  return gulikaTimings[dayOfWeek] || '1:30 PM - 3:00 PM';
}

/**
 * Check if current time is auspicious
 */
export function isAuspiciousTime(panchangam: Panchangam): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${currentHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;
  
  // Check if within Brahma Muhurta (4:30-5:30 AM)
  if (currentHour >= 4 && currentHour < 5) {
    return true;
  }
  
  // Check Abhijit Muhurta (11:36 AM - 12:24 PM)
  if ((currentHour === 11 && currentMinute >= 36) || (currentHour === 12 && currentMinute <= 24)) {
    return true;
  }
  
  return false;
}
