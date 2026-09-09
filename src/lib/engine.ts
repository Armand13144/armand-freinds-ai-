// FriendAI Engine — main entry point
// CRITICAL: activePersonalityId ALWAYS = speaker. Never changes automatically.

import { analyze } from './nlu/detector';
import { buildContext } from './nlu/context';
import { characters, pickRandom, CharData, CharResponses } from './characters';
import type { PersonalityId, EntityId, Topic, Intent, NLUResult, ConvContext } from './nlu/types';

// Re-export everything pages need
export type { PersonalityId, EntityId, Topic, Intent, Message } from './nlu/types';
export { characters, personalityList, pickRandom } from './characters';
export { buildContext } from './nlu/context';

// Map entity → response key in character
function entityKey(entity: EntityId): keyof CharResponses | null {
  switch (entity) {
    case 'KurdoAI':        return 'aboutKurdo';
    case 'KingKawozAI':   return 'aboutKawoz';
    case 'AvrestAI':      return 'aboutAvrest';
    case 'TopgateAI':     return 'aboutTopgate';
    case 'JikaBallaAI':   return 'aboutJika';
    case 'AlphaAI':       return 'aboutAlpha';
    case 'WrchaJwanakaAI':return 'aboutWrcha';
    case 'Armand':        return 'armand';
    default:              return null;
  }
}

// Map intent → response key
function intentKey(intent: Intent): keyof CharResponses | null {
  switch (intent) {
    case 'GREETING':    return 'greetings';
    case 'FAREWELL':    return 'farewells';
    case 'META':        return 'meta';
    case 'CAPABILITY':  return 'capability';
    case 'JOKE':        return 'jokes';
    case 'NEGATION':    return 'negation';
    case 'AFFIRMATION': return 'affirmation';
    case 'CONFUSION':   return 'confusion';
    case 'REACTION':    return 'reaction';
    case 'COMPARE':     return 'compare';
    case 'CHESS':       return 'chess';
    case 'TRADING':     return 'trading';
    case 'BUSINESS':    return 'business';
    case 'GAMING':      return 'gaming';
    case 'PUBG':        return 'pubg';
    case 'MINECRAFT':   return 'minecraft';
    case 'ARMAND':      return 'armand';
    case 'PC_MONITOR':  return 'pcMonitor';
    case 'BEAR':        return 'bear';
    default:            return null;
  }
}

function pick(char: CharData, key: keyof CharResponses): string | null {
  const pool = char.r[key] as string[];
  if (pool && pool.length > 0) return pickRandom(pool);
  return null;
}

// Topic → intent mapping for topic-driven responses
const TOPIC_INTENT: Partial<Record<Topic, Intent>> = {
  chess: 'CHESS', trading: 'TRADING', business: 'BUSINESS',
  gaming: 'GAMING', pubg: 'PUBG', minecraft: 'MINECRAFT',
  pc: 'PC_MONITOR', armand: 'ARMAND', bear: 'BEAR',
};

export function generateResponse(
  rawMessage: string,
  activePersonalityId: PersonalityId,
  history: import('./nlu/types').Message[],
  debug = false
): string {
  // ★ THE SPEAKER IS ALWAYS THE ACTIVE CHARACTER. NEVER CHANGES. ★
  const char = characters[activePersonalityId];
  const ctx = buildContext(history);
  const nlu = analyze(rawMessage, ctx);

  if (debug) {
    console.group('[FriendAI NLU]');
    console.log('ACTIVE MODEL  :', activePersonalityId);
    console.log('RAW           :', nlu.raw);
    console.log('NORMALIZED    :', nlu.normalized);
    console.log('INTENT        :', nlu.intent, '(' + nlu.intentConfidence.toFixed(2) + ')');
    console.log('ENTITIES      :', nlu.entities.map(e => e.entity + '(' + e.confidence.toFixed(2) + ')').join(', ') || 'none');
    console.log('PRIMARY ENTITY:', nlu.resolvedEntity);
    console.log('TOPICS        :', nlu.topics.map(t => t.topic + '(' + t.confidence.toFixed(2) + ')').join(', ') || 'none');
    console.log('RESOLVED TOPIC:', nlu.resolvedTopic);
    console.log('SENTIMENT     :', nlu.sentiment);
    console.log('IS FOLLOWUP   :', nlu.isFollowup);
    console.groupEnd();
  }

  const entity = nlu.resolvedEntity;
  const topic  = nlu.resolvedTopic;
  const intent = nlu.intent;

  // ---- STEP 1: Greeting ----
  if (intent === 'GREETING') {
    return pick(char, 'greetings') ?? pickRandom(char.r.fallbacks);
  }

  // ---- STEP 2: Farewell ----
  if (intent === 'FAREWELL') {
    return pick(char, 'farewells') ?? 'Later bro.';
  }

  // ---- STEP 3: Who are you ----
  if (intent === 'META') {
    if (entity === null || entity === activePersonalityId) {
      return pick(char, 'meta') ?? pickRandom(char.r.fallbacks);
    }
    // "Who is Alpha?" with META intent → describe entity
    const k = entityKey(entity);
    if (k) return pick(char, k) ?? pickRandom(char.r.fallbacks);
  }

  // ---- STEP 4: Capability ----
  if (intent === 'CAPABILITY' && (entity === null || entity === activePersonalityId)) {
    return pick(char, 'capability') ?? pick(char, 'meta') ?? pickRandom(char.r.fallbacks);
  }

  // ---- STEP 5: Simple social intents ----
  if (intent === 'NEGATION') return pick(char, 'negation') ?? pickRandom(char.r.fallbacks);
  if (intent === 'AFFIRMATION') return pick(char, 'affirmation') ?? pickRandom(char.r.fallbacks);
  if (intent === 'CONFUSION') return pick(char, 'confusion') ?? pickRandom(char.r.fallbacks);
  if (intent === 'REACTION') return pick(char, 'reaction') ?? pickRandom(char.r.fallbacks);
  if (intent === 'JOKE') return pick(char, 'jokes') ?? pickRandom(char.r.fallbacks);
  if (intent === 'COMPARE') return pick(char, 'compare') ?? pickRandom(char.r.fallbacks);

  // ---- STEP 6: OPINION / DESCRIBE / QUESTION_FACT about a specific entity ----
  // e.g. "what do you think about Alpha?" → KingKawozAI talks ABOUT Alpha
  if (entity && entity !== activePersonalityId) {
    const opinionIntents: Intent[] = ['OPINION', 'DESCRIBE', 'QUESTION_FACT'];
    if (opinionIntents.includes(intent) || nlu.intentConfidence > 0.75) {
      const k = entityKey(entity);
      if (k) {
        // If there is also a topic, try to blend — but still speak from active char
        const response = pick(char, k);
        if (response) return response;
      }
    }
  }

  // ---- STEP 7: Entity mentioned + topic ----
  // e.g. "Alpha chess?" → talk about entity, but topic adds context
  if (entity && entity !== activePersonalityId) {
    const k = entityKey(entity);
    if (k) {
      const response = pick(char, k);
      if (response) return response;
    }
  }

  // ---- STEP 8: Self-reference ----
  if (entity === activePersonalityId) {
    if (topic !== 'none') {
      const topicIntent = TOPIC_INTENT[topic];
      if (topicIntent) {
        const k = intentKey(topicIntent);
        if (k) {
          const r = pick(char, k);
          if (r) return r;
        }
      }
    }
    return pick(char, 'meta') ?? pickRandom(char.r.fallbacks);
  }

  // ---- STEP 9: Topic-driven response (no entity, but topic detected) ----
  if (topic !== 'none') {
    const topicIntent = TOPIC_INTENT[topic];
    if (topicIntent) {
      const k = intentKey(topicIntent);
      if (k) {
        const r = pick(char, k);
        if (r) return r;
      }
    }
  }

  // ---- STEP 10: Intent-driven response (no entity, no topic) ----
  const iKey = intentKey(intent);
  if (iKey) {
    const r = pick(char, iKey);
    if (r) return r;
  }

  // ---- STEP 11: Follow-up — try context entity then context topic ----
  if (nlu.isFollowup) {
    if (ctx.lastEntity && ctx.lastEntity !== activePersonalityId) {
      const k = entityKey(ctx.lastEntity);
      if (k) {
        const r = pick(char, k);
        if (r) return r;
      }
    }
    if (ctx.lastTopic !== 'none') {
      const topicIntent = TOPIC_INTENT[ctx.lastTopic];
      if (topicIntent) {
        const k = intentKey(topicIntent);
        if (k) {
          const r = pick(char, k);
          if (r) return r;
        }
      }
    }
  }

  // ---- STEP 12: Final fallback ----
  return pickRandom(char.r.fallbacks);
}