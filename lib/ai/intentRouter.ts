import { Language } from '@/lib/utils/languageUtils';

export interface Intent {
  type: 'education' | 'health' | 'shopping' | 'wallet' | 'franchise' | 'general';
  service?: string;
  filters?: {
    subject?: string;
    city?: string;
    price?: number;
    sqlLevel?: number;
    category?: string;
    specialization?: string;
    product?: string;
  };
  actions?: {
    book?: boolean;
    apply?: boolean;
    search?: boolean;
    view?: boolean;
  };
}

export interface IntentResponse {
  intent: Intent;
  response: string;
}

// Common keywords for intent detection
const EDUCATION_KEYWORDS = ['tutor', 'teacher', 'course', 'learn', 'study', 'education', 'class'];
const HEALTH_KEYWORDS = ['doctor', 'hospital', 'clinic', 'health', 'medical', 'appointment'];
const SHOPPING_KEYWORDS = ['buy', 'shop', 'store', 'product', 'price', 'shopping'];
const WALLET_KEYWORDS = ['wallet', 'coin', 'balance', 'lock', 'unlock', 'reward'];
const FRANCHISE_KEYWORDS = ['franchise', 'business', 'partner', 'apply', 'join'];

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

// Common medical specializations
const SPECIALIZATIONS = [
  'mbbs',
  'dentist',
  'cardiologist',
  'pediatrician',
  'gynecologist',
  'orthopedic',
  'neurologist',
  'psychiatrist',
  'dermatologist',
];

// Common product categories
const CATEGORIES = [
  'electronics',
  'clothing',
  'groceries',
  'home',
  'beauty',
  'sports',
  'books',
  'toys',
  'automotive',
  'jewelry',
];

export async function detectIntent(text: string, language: Language): Promise<IntentResponse> {
  const lowerText = text.toLowerCase();

  // Check for education intent
  if (EDUCATION_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const intent: Intent = {
      type: 'education',
      service: 'tutor',
      filters: {},
      actions: {},
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

    // Check for booking intent
    if (lowerText.includes('book') || lowerText.includes('enroll')) {
      intent.actions!.book = true;
    }

    return {
      intent,
      response:
        language === 'ur'
          ? `میں آپ کو ${intent.filters?.subject || 'مطلوبہ'} کے ٹیوٹر تلاش کرنے میں مدد کرتا ہوں${
              intent.filters?.city ? ` ${intent.filters.city} میں` : ''
            }${intent.filters?.price ? ` ${intent.filters.price} روپے تک` : ''}۔`
          : `I'll help you find a ${intent.filters?.subject || 'suitable'} tutor${
              intent.filters?.city ? ` in ${intent.filters.city}` : ''
            }${intent.filters?.price ? ` within ${intent.filters.price} PKR` : ''}.`,
    };
  }

  // Check for health intent
  if (HEALTH_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const intent: Intent = {
      type: 'health',
      service: 'doctor',
      filters: {},
      actions: {},
    };

    // Extract specialization
    const specialization = SPECIALIZATIONS.find(spec => lowerText.includes(spec));
    if (specialization) {
      intent.filters!.specialization = specialization;
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

    // Check for booking intent
    if (lowerText.includes('book') || lowerText.includes('appointment')) {
      intent.actions!.book = true;
    }

    return {
      intent,
      response:
        language === 'ur'
          ? `میں آپ کو ${intent.filters?.specialization || 'ڈاکٹر'} تلاش کرنے میں مدد کرتا ہوں${
              intent.filters?.city ? ` ${intent.filters.city} میں` : ''
            }${intent.filters?.price ? ` ${intent.filters.price} روپے تک` : ''}۔`
          : `I'll help you find a ${intent.filters?.specialization || 'doctor'}${
              intent.filters?.city ? ` in ${intent.filters.city}` : ''
            }${intent.filters?.price ? ` within ${intent.filters.price} PKR` : ''}.`,
    };
  }

  // Check for shopping intent
  if (SHOPPING_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const intent: Intent = {
      type: 'shopping',
      service: 'product',
      filters: {},
      actions: {},
    };

    // Extract category
    const category = CATEGORIES.find(cat => lowerText.includes(cat));
    if (category) {
      intent.filters!.category = category;
    }

    // Extract product
    const productMatch = lowerText.match(/(?:find|show|get|buy)\s+([a-zA-Z]+)/i);
    if (productMatch) {
      intent.filters!.product = productMatch[1];
    }

    // Extract price range
    const priceMatch = lowerText.match(/(\d+)\s*(?:rs|rupees|pkr)/i);
    if (priceMatch) {
      intent.filters!.price = parseInt(priceMatch[1]);
    }

    // Check for cart action
    if (lowerText.includes('cart') || lowerText.includes('add')) {
      intent.actions!.book = true;
    }

    return {
      intent,
      response:
        language === 'ur'
          ? `میں آپ کو ${intent.filters?.product || 'پروڈکٹ'} تلاش کرنے میں مدد کرتا ہوں${
              intent.filters?.category ? ` ${intent.filters.category} کیٹیگری میں` : ''
            }${intent.filters?.price ? ` ${intent.filters.price} روپے تک` : ''}۔`
          : `I'll help you find ${intent.filters?.product || 'products'}${
              intent.filters?.category ? ` in ${intent.filters.category}` : ''
            }${intent.filters?.price ? ` within ${intent.filters.price} PKR` : ''}.`,
    };
  }

  // Check for wallet intent
  if (WALLET_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const intent: Intent = {
      type: 'wallet',
      service: 'balance',
      actions: {
        view: true,
      },
    };

    return {
      intent,
      response:
        language === 'ur'
          ? 'میں آپ کو والیٹ کی معلومات دکھاتا ہوں۔'
          : "I'll show you your wallet information.",
    };
  }

  // Check for franchise intent
  if (FRANCHISE_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    const intent: Intent = {
      type: 'franchise',
      service: 'apply',
      actions: {
        apply: true,
      },
    };

    return {
      intent,
      response:
        language === 'ur'
          ? 'میں آپ کو فرنچائز کے بارے میں معلومات دیتا ہوں۔'
          : "I'll guide you through the franchise process.",
    };
  }

  // Default to general intent
  return {
    intent: {
      type: 'general',
      actions: {
        search: true,
      },
    },
    response: language === 'ur' ? 'میں آپ کی کیسے مدد کر سکتا ہوں؟' : 'How can I help you today?',
  };
}
