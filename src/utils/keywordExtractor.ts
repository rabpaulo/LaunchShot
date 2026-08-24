const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with',
  'of', 'in', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
  'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'that', 'which', 'who', 'whom', 'whose', 'this', 'that', 'these', 'those', 'it', 'its',
  'i', 'you', 'he', 'she', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their',
  'app', 'application', 'help', 'helps', 'make', 'makes', 'better', 'good', 'best', 'great'
]);

export function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Clean text and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
    
  // Get unique words, preferring earlier words (usually more important in short descriptions)
  const uniqueWords = [...new Set(words)];
  
  // Capitalize first letter of each word
  return uniqueWords.map(word => word.charAt(0).toUpperCase() + word.slice(1));
}
