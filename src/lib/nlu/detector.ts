import type { NLUResult, ConvContext } from './types';
import { normalizeText } from './normalizer';
import { detectEntities } from './entities';
import { detectTopics } from './topics';
import { detectIntent, detectSentiment } from './intents';

export function analyze(raw: string, ctx: ConvContext): NLUResult {
  const { normalized } = normalizeText(raw);

  const entityMatches = detectEntities(normalized, ctx);
  const topicMatches = detectTopics(normalized);
  const intentMatch = detectIntent(normalized, entityMatches, topicMatches);
  const sentiment = detectSentiment(normalized);

  const primaryEntity = entityMatches[0]?.entity ?? null;
  const entityConfidence = entityMatches[0]?.confidence ?? 0;
  const primaryTopic = topicMatches[0]?.topic ?? 'none';
  const topicConfidence = topicMatches[0]?.confidence ?? 0;

  // Resolve entity via context if this is a follow-up with pronouns/short message
  const PRONOUN_PATTERNS = /^(why|how|really|and |same|him|her|his|their|that|this|who|what about|and what|him?|wait)$/;
  const isFollowup =
    intentMatch.intent === 'FOLLOWUP' ||
    (primaryEntity === null && PRONOUN_PATTERNS.test(normalized.trim())) ||
    (normalized.trim().length <= 8 && intentMatch.intent === 'UNKNOWN');

  // Resolved values: use context if direct detection is weak
  const resolvedEntity: NLUResult['resolvedEntity'] =
    (primaryEntity !== null && entityConfidence >= 0.6)
      ? primaryEntity
      : isFollowup ? ctx.lastEntity
      : primaryEntity;

  const resolvedTopic: NLUResult['resolvedTopic'] =
    (primaryTopic !== 'none' && topicConfidence >= 0.55)
      ? primaryTopic
      : isFollowup ? ctx.lastTopic
      : primaryTopic;

  return {
    raw,
    normalized,
    intent: intentMatch.intent,
    intentConfidence: intentMatch.confidence,
    entities: entityMatches,
    primaryEntity,
    entityConfidence,
    topics: topicMatches,
    primaryTopic,
    topicConfidence,
    sentiment,
    isFollowup,
    resolvedEntity,
    resolvedTopic,
  };
}