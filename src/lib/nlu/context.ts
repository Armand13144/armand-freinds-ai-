import type { ConvContext, Intent, EntityId, Topic, Sentiment, Message } from './types';
import { normalizeText } from './normalizer';
import { detectEntities } from './entities';
import { detectTopics } from './topics';
import { detectIntent, detectSentiment } from './intents';

const DEFAULT_CTX: ConvContext = {
  lastIntent: 'UNKNOWN',
  lastEntity: null,
  lastTopic: 'none',
  lastSentiment: 'neutral',
  recentEntities: [],
  recentTopics: [],
  turnCount: 0,
};

export function buildContext(history: Message[]): ConvContext {
  const ctx = { ...DEFAULT_CTX };
  const recent = history.filter(m => m.role !== 'system').slice(-20);

  for (const m of recent) {
    if (m.role !== 'user') continue;
    const { normalized } = normalizeText(m.content);
    const entities = detectEntities(normalized);
    const topics = detectTopics(normalized);
    const intent = detectIntent(normalized, entities, topics);
    const sentiment = detectSentiment(normalized);

    ctx.turnCount++;
    ctx.lastSentiment = sentiment;

    if (intent.intent !== 'UNKNOWN' && intent.intent !== 'FOLLOWUP') {
      ctx.lastIntent = intent.intent;
    }
    if (entities.length > 0) {
      ctx.lastEntity = entities[0].entity;
      // Track up to 5 recent entities
      for (const e of entities) {
        if (e.entity && !ctx.recentEntities.includes(e.entity)) {
          ctx.recentEntities.unshift(e.entity);
          if (ctx.recentEntities.length > 5) ctx.recentEntities.pop();
        }
      }
    }
    if (topics.length > 0 && topics[0].topic !== 'none') {
      ctx.lastTopic = topics[0].topic;
      for (const t of topics) {
        if (!ctx.recentTopics.includes(t.topic)) {
          ctx.recentTopics.unshift(t.topic);
          if (ctx.recentTopics.length > 5) ctx.recentTopics.pop();
        }
      }
    }
  }

  return ctx;
}

// Resolve topic from entity if no topic detected directly
// e.g., entity=AvrestAI + no topic → chess (Avrest is known for chess)
const ENTITY_DEFAULT_TOPIC: Partial<Record<NonNullable<EntityId>, Topic>> = {
  AvrestAI: 'chess',
  AlphaAI: 'trading',
};

export function resolveTopicFromEntity(entity: EntityId, topic: Topic): Topic {
  if (topic !== 'none') return topic;
  return ENTITY_DEFAULT_TOPIC[entity!] ?? 'none';
}