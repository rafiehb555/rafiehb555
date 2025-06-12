export type Language = 'en' | 'ur' | 'roman-ur';

export async function detectLanguage(text: string): Promise<Language> {
  // Simple language detection based on character patterns
  const urduPattern = /[\u0600-\u06FF]/; // Urdu Unicode range
  const romanUrduPattern = /[a-zA-Z]+/; // Roman Urdu typically uses English letters

  if (urduPattern.test(text)) {
    return 'ur';
  } else if (romanUrduPattern.test(text)) {
    // Check for common Roman Urdu words
    const romanUrduWords = ['kya', 'hai', 'main', 'tum', 'hum', 'kaise', 'kahan'];
    const words = text.toLowerCase().split(/\s+/);
    const hasRomanUrduWords = words.some(word => romanUrduWords.includes(word));

    return hasRomanUrduWords ? 'roman-ur' : 'en';
  }

  return 'en'; // Default to English
}
