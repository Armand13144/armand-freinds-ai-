import type { EntityId, EntityMatch, ConvContext } from './types';

// --- Levenshtein distance (fuzzy matching) ---
function lev(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n; if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

// Exact/alias patterns for each entity
// Order matters — longer patterns checked first to avoid partial matches
const ENTITY_ALIASES: Array<{ entity: EntityId; phrases: string[]; fuzzyTargets: string[] }> = [
  {
    entity: 'KurdoAI',
    phrases: ['kurdo smp owner', 'smp owner kurdo', 'kurdoai', 'kurdo bro', 'kurdo'],
    fuzzyTargets: ['kurdo', 'kurdi', 'kurdoo'],
  },
  {
    entity: 'KingKawozAI',
    phrases: ['king kawoz', 'king kawo', 'kingkawozai', 'kingkawoz', 'kawozz', 'kawoz bro', 'kawoz', 'kawo', 'kawz'],
    fuzzyTargets: ['kawoz', 'kawz', 'kawo', 'kawozz'],
  },
  {
    entity: 'AvrestAI',
    phrases: ['chess teacher avrest', 'avrestai', 'the chess teacher', 'chess teacher', 'avrestt', 'avrest bro', 'avrest', 'avrst', 'avres'],
    fuzzyTargets: ['avrest', 'avrst', 'avres', 'avrestt'],
  },
  {
    entity: 'TopgateAI',
    phrases: ['top gate', 'topgateai', 'topgatte', 'topgat', 'topgate bro', 'topgate'],
    fuzzyTargets: ['topgate', 'topgat', 'topgatte'],
  },
  {
    entity: 'JikaBallaAI',
    phrases: ['jika ball', 'jikaballaai', 'jikaballa', 'jikaa', 'jikka', 'jika bro', 'jika', 'balla group manager', 'balla'],
    fuzzyTargets: ['jika', 'jikaa', 'jikka'],
  },
  {
    entity: 'AlphaAI',
    phrases: ['alphaai', 'alphaa', 'alpha bro', 'alpa', 'alpha'],
    fuzzyTargets: ['alpha', 'alphaa', 'alpa'],
  },
  {
    entity: 'WrchaJwanakaAI',
    phrases: ['dagestan bear', 'dagestan warrior', 'dagestan warriors', 'wrcha jwanaka', 'wrchajwanakaai', 'wrchajwanaka', 'the bear', 'jwanaka', 'wrcha bro', 'wrcha'],
    fuzzyTargets: ['wrcha', 'jwanaka'],
  },
  {
    entity: 'Armand',
    phrases: ['armand bro', 'creator armand', 'armand'],
    fuzzyTargets: ['armand'],
  },
];

// Detect possessives: "Alpha's" → Alpha
function stripPossessive(word: string): string {
  return word.replace(/'s$/, '').replace(/s'$/, 's');
}

export function detectEntities(text: string, ctx?: ConvContext): EntityMatch[] {
  const results: EntityMatch[] = [];
  const seen = new Set<EntityId>();

  const addIfNew = (m: EntityMatch) => {
    if (!seen.has(m.entity)) { seen.add(m.entity); results.push(m); }
  };

  // 1. Exact/alias phrase matching (longest first per entity)
  for (const { entity, phrases } of ENTITY_ALIASES) {
    for (const phrase of phrases) {
      // Use word boundary via space-padded text
      const padded = ' ' + text + ' ';
      if (padded.includes(' ' + phrase + ' ') || padded.includes(' ' + phrase + '?') ||
          padded.includes(' ' + phrase + '.') || padded.includes(' ' + phrase + ',') ||
          text.startsWith(phrase + ' ') || text === phrase || text.endsWith(' ' + phrase)) {
        addIfNew({ entity, confidence: phrase.includes(' ') ? 0.97 : 0.93, matchType: 'alias' });
        break;
      }
    }
  }

  // 2. Possessive detection ("Alpha's ...", "Kawoz's ...")
  const words = text.split(/\s+/);
  for (const word of words) {
    if (!word.includes("'s") && !word.endsWith("'s")) continue;
    const base = stripPossessive(word);
    for (const { entity, phrases, fuzzyTargets } of ENTITY_ALIASES) {
      if (seen.has(entity)) continue;
      if (phrases.includes(base) || fuzzyTargets.includes(base)) {
        addIfNew({ entity, confidence: 0.9, matchType: 'possessive' });
      }
    }
  }

  // 3. Fuzzy matching for individual words (only if not already detected)
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, '');
    if (clean.length < 3) continue; // skip very short words
    for (const { entity, fuzzyTargets } of ENTITY_ALIASES) {
      if (seen.has(entity)) continue;
      for (const target of fuzzyTargets) {
        const dist = lev(clean, target);
        const maxLen = Math.max(clean.length, target.length);
        const similarity = 1 - dist / maxLen;
        if (dist === 1 && target.length >= 4) {
          addIfNew({ entity, confidence: 0.82, matchType: 'fuzzy' });
        } else if (dist === 2 && target.length >= 6) {
          addIfNew({ entity, confidence: 0.65, matchType: 'fuzzy' });
        }
      }
    }
  }

  // 4. Context-based pronoun resolution
  const PRONOUNS = ['he', 'him', 'his', 'she', 'her', 'they', 'them', 'their', 'it', 'that guy', 'the guy', 'same', 'that', 'this one'];
  const hasPronoun = PRONOUNS.some(p => (' ' + text + ' ').includes(' ' + p + ' ') || text === p || text.startsWith(p + ' '));
  if (hasPronoun && results.length === 0 && ctx?.lastEntity) {
    addIfNew({ entity: ctx.lastEntity, confidence: 0.75, matchType: 'context' });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}