export type PersonalityId =
  | 'KurdoAI' | 'KingKawozAI' | 'AvrestAI'
  | 'TopgateAI' | 'JikaBallaAI' | 'AlphaAI' | 'WrchaJwanakaAI';

export type EntityId = PersonalityId | 'Armand' | null;

export type Topic =
  | 'chess' | 'trading' | 'business' | 'gaming'
  | 'pubg' | 'minecraft' | 'pc' | 'armand' | 'bear' | 'none';

export type Intent =
  | 'GREETING' | 'FAREWELL' | 'META' | 'CAPABILITY'
  | 'OPINION' | 'DESCRIBE' | 'QUESTION_FACT'
  | 'COMPARE' | 'CHESS' | 'TRADING' | 'BUSINESS'
  | 'GAMING' | 'PUBG' | 'MINECRAFT' | 'PC_MONITOR'
  | 'ARMAND' | 'BEAR' | 'JOKE'
  | 'NEGATION' | 'AFFIRMATION' | 'CONFUSION'
  | 'REACTION' | 'FOLLOWUP' | 'UNKNOWN';

export type Sentiment = 'positive' | 'negative' | 'neutral' | 'confused' | 'excited' | 'joking';

export interface EntityMatch {
  entity: EntityId;
  confidence: number;
  matchType: 'exact' | 'alias' | 'fuzzy' | 'possessive' | 'context';
}

export interface TopicMatch { topic: Topic; confidence: number; }
export interface IntentMatch { intent: Intent; confidence: number; }

export interface NLUResult {
  raw: string;
  normalized: string;
  intent: Intent;
  intentConfidence: number;
  entities: EntityMatch[];
  primaryEntity: EntityId;
  entityConfidence: number;
  topics: TopicMatch[];
  primaryTopic: Topic;
  topicConfidence: number;
  sentiment: Sentiment;
  isFollowup: boolean;
  resolvedEntity: EntityId;
  resolvedTopic: Topic;
}

export interface ConvContext {
  lastIntent: Intent;
  lastEntity: EntityId;
  lastTopic: Topic;
  lastSentiment: Sentiment;
  recentEntities: EntityId[];
  recentTopics: Topic[];
  turnCount: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  speaker?: PersonalityId;
}