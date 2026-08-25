const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with',
  'of', 'in', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'that', 'which', 'who', 'whom', 'whose', 'this', 'these', 'those', 'it', 'its',
  'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their',
  'app', 'application', 'help', 'helps', 'make', 'makes', 'better', 'good', 'best', 'great',
  'free', 'new', 'easy', 'simple', 'fast', 'smart', 'get', 'use', 'using', 'also', 'all'
]);

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function extractKeywords(text: string): string[] {
  if (!text || !text.trim()) return [];
  
  // Clean text and split into words
  const rawWords = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(word => word.length > 2);

  const meaningfulWords = rawWords.filter(word => !STOP_WORDS.has(word));
  
  const extractedPhrases: string[] = [];

  // 1. Extract 2-word meaningful compound phrases (e.g. "Sleep Tracker", "Crypto Wallet")
  for (let i = 0; i < rawWords.length - 1; i++) {
    const w1 = rawWords[i];
    const w2 = rawWords[i + 1];
    
    // Pair must not be just stop words
    if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w2) && w1.length > 2 && w2.length > 2) {
      const phrase = `${capitalize(w1)} ${capitalize(w2)}`;
      if (!extractedPhrases.includes(phrase)) {
        extractedPhrases.push(phrase);
      }
    }
  }

  // 2. Extract single meaningful keywords
  const singleKeywords = meaningfulWords.map(capitalize);
  
  // 3. Combine unique items preserving priority (phrases first, then single words)
  const combined = [...extractedPhrases, ...singleKeywords];
  return [...new Set(combined)];
}

