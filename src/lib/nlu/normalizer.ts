// Large text normalizer — slang, abbreviations, contractions, typos

const SLANG: Record<string, string> = {
  // Pronouns / articles
  'u': 'you', 'ur': 'your', 'r': 'are', 'im': 'i am', 'ive': 'i have',
  // Question words
  'wat': 'what', 'wht': 'what', 'wut': 'what', 'wats': 'what is',
  'whats': 'what is', 'wyd': 'what are you doing', 'wdym': 'what do you mean',
  'wym': 'what do you mean', 'hw': 'how',
  // About / because / though
  'abt': 'about', 'bout': 'about', 'bc': 'because', 'bcs': 'because',
  'cuz': 'because', 'coz': 'because', 'cause': 'because',
  'tho': 'though', 'tbt': 'though',
  // Contractions
  'gonna': 'going to', 'wanna': 'want to', 'gotta': 'got to',
  'lemme': 'let me', 'gimme': 'give me', 'kinda': 'kind of',
  'sorta': 'sort of', 'hafta': 'have to', 'oughta': 'ought to',
  // Positives / negatives
  'nah': 'no', 'nope': 'no', 'na': 'no', 'yep': 'yes', 'yup': 'yes',
  'yeah': 'yes', 'yea': 'yes', 'yh': 'yes',
  // Internet / texting
  'fr': 'for real', 'ngl': 'honestly', 'imo': 'in my opinion',
  'idk': 'i do not know', 'idc': 'i do not care', 'irl': 'in real life',
  'tbh': 'honestly', 'lmk': 'let me know', 'btw': 'by the way',
  'rn': 'right now', 'rn?': 'right now', 'obv': 'obviously',
  'lowkey': 'honestly', 'highkey': 'definitely', 'ong': 'on god',
  'no cap': 'seriously', 'fax': 'true', 'bet': 'okay',
  'pls': 'please', 'plz': 'please', 'plez': 'please',
  // Laughter (neutral)
  'lol': '', 'lmao': '', 'lmfao': '', 'haha': '', 'hehe': '', 'lols': '',
  // Profanity softener (remove)
  'wtf': 'what the', 'omg': 'oh my god',
  // Gaming slang
  'gg': 'good game', 'wp': 'well played', 'op': 'overpowered',
  // Yes / agreement extras
  'true': 'true', 'facts': 'true', 'based': 'good',
  'goated': 'amazing', 'mid': 'mediocre', 'valid': 'correct',
  // Connectives
  'nd': 'and', 'n': 'and', 'w': 'with', 'w/': 'with',
};

// Normalize a raw user message.
// Returns both raw and normalized versions.
export function normalizeText(raw: string): { raw: string; normalized: string } {
  let t = raw.toLowerCase().trim();
  // Remove excessive punctuation but keep ? and . for sentence detection
  t = t.replace(/[!]{2,}/g, '!').replace(/[?]{2,}/g, '?');
  // Normalize apostrophes and quotes
  t = t.replace(/['']/g, "'").replace(/[""]/g, '"');
  // Normalize spaces
  t = t.replace(/\s+/g, ' ');
  // Apply slang word by word (whole-word matching to avoid false replacements)
  const words = t.split(' ');
  const normalized = words.map(w => {
    const clean = w.replace(/[^a-z0-9']/g, '');
    return SLANG[clean] !== undefined ? SLANG[clean] : w;
  }).filter(w => w !== '').join(' ').trim();
  return { raw, normalized };
}