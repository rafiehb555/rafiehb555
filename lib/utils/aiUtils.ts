import { Language } from './languageUtils';

interface Intent {
  type: 'education' | 'health' | 'shopping' | 'general';
  service?: string;
  filters?: {
    subject?: string;
    city?: string;
    price?: number;
    sqlLevel?: number;
  };
}

interface IntentResponse {
  intent?: Intent;
  response: string;
}

// Common keywords for intent detection
const EDUCATION_KEYWORDS = ['tutor', 'teacher', 'course', 'learn', 'study', 'education', 'class'];
const HEALTH_KEYWORDS = ['doctor', 'hospital', 'clinic', 'health', 'medical', 'appointment'];
const SHOPPING_KEYWORDS = ['buy', 'shop', 'store', 'product', 'price', 'shopping'];

// Common subjects
const SUBJECTS = [
  'math',
  'science',
  'physics',
  'chemistry',
  'biology',
  'english',
  'urdu',
  'computer',
  'programming',
  'sql',
];

// Common cities in Pakistan
const CITIES = [
  'karachi',
  'lahore',
  'islamabad',
  'peshawar',
  'quetta',
  'faisalabad',
  'multan',
  'hyderabad',
  'sialkot',
  'gujranwala',
];

export async function detectIntent(text: string, language: Language): Promise<IntentResponse> {
  const lowerText = text.toLowerCase();

  // Check for education intent
  if (EDUCATION_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const intent: Intent = {
      type: 'education',
      service: 'tutor',
      filters: {},
    };

    // Extract subject
    const subject = SUBJECTS.find(subject => lowerText.includes(subject));
    if (subject) {
      intent.filters!.subject = subject;
    }

    // Extract city
    const city = CITIES.find(city => lowerText.includes(city));
    if (city) {
      intent.filters!.city = city;
    }

    // Extract price range
    const priceMatch = lowerText.match(/(\d+)\s*(?:rs|rupees|pkr)/i);
    if (priceMatch) {
      intent.filters!.price = parseInt(priceMatch[1]);
    }

    return {
      intent,
      response: generateResponse(intent, language),
    };
  }

  // Check for health intent
  if (HEALTH_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    return {
      intent: { type: 'health' },
      response:
        language === 'ur'
          ? 'میں آپ کو EMO ہیلتھ سروسز کی طرف رہنمائی کرتا ہوں۔'
          : "I'll guide you to EMO health services.",
    };
  }

  // Check for shopping intent
  if (SHOPPING_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    return {
      intent: { type: 'shopping' },
      response:
        language === 'ur'
          ? 'میں آپ کو GoSellr شاپنگ پلیٹ فارم کی طرف رہنمائی کرتا ہوں۔'
          : "I'll guide you to the GoSellr shopping platform.",
    };
  }

  // Default response for general queries
  return {
    response: language === 'ur' ? 'میں آپ کی کیسے مدد کر سکتا ہوں؟' : 'How can I help you today?',
  };
}

function generateResponse(intent: Intent, language: Language): string {
  if (language === 'ur') {
    return `میں آپ کو ${intent.filters?.subject || 'مطلوبہ'} کے ٹیوٹر تلاش کرنے میں مدد کرتا ہوں${
      intent.filters?.city ? ` ${intent.filters.city} میں` : ''
    }${intent.filters?.price ? ` ${intent.filters.price} روپے تک` : ''}۔`;
  }

  return `I'll help you find a ${intent.filters?.subject || 'suitable'} tutor${
    intent.filters?.city ? ` in ${intent.filters.city}` : ''
  }${intent.filters?.price ? ` within ${intent.filters.price} PKR` : ''}.`;
}
