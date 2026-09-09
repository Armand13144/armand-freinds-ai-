import type { Intent, IntentMatch, Sentiment, EntityMatch, TopicMatch, Topic } from './types';

// Semantic phrase patterns — the KEY upgrade.
// Instead of individual keywords, we match FULL PHRASES.
// Longer/more specific phrases get higher weight.

type PhraseBank = { phrases: string[]; confidence: number };

const INTENT_BANKS: Array<{ intent: Intent; banks: PhraseBank[] }> = [
  // ---- GREETING ----
  { intent: 'GREETING', banks: [
    { confidence: 0.98, phrases: [
      'good morning', 'good evening', 'good afternoon', 'good night',
      'morning bro', 'evening bro', 'how are you doing', 'how are you',
      'how you doing', 'how u doing', 'how is it going', "how's it going",
    ]},
    { confidence: 0.95, phrases: [
      'hello bro', 'hey bro', 'hey man', 'yo bro', 'yo man', 'what is up',
      "what's up", 'whats up', 'sup bro', 'hello there', 'hey there',
    ]},
    { confidence: 0.9, phrases: ['hello', 'hi', 'hey', 'yo', 'sup', 'salam', 'salaam', 'hiya', 'howdy']},
  ]},

  // ---- FAREWELL ----
  { intent: 'FAREWELL', banks: [
    { confidence: 0.98, phrases: ['goodbye', 'good bye', 'see you later', 'see ya later', 'gotta go', 'take care', 'talk later', 'ttyl', 'peace out']},
    { confidence: 0.9, phrases: ['bye', 'cya', 'later', 'see you', 'see ya', 'peace']},
  ]},

  // ---- WHO ARE YOU / META ----
  { intent: 'META', banks: [
    { confidence: 0.99, phrases: [
      'who are you', 'who r you', 'who are u', 'what are you', 'which model are you',
      'what model are you', 'tell me about yourself', 'introduce yourself',
      'who is this', 'who am i talking to', 'who am i chatting with', 'what is your name',
      "what's your name", 'your name', 'what do you do', 'what do u do',
    ]},
  ]},

  // ---- CAPABILITY ----
  { intent: 'CAPABILITY', banks: [
    { confidence: 0.97, phrases: [
      'what can you do', 'what can u do', 'what are you capable of', 'what are you good at',
      'what do you know', 'what do you know about', 'can you help', 'can u help',
      'can you explain', 'can you tell me', 'can you answer',
    ]},
  ]},

  // ---- OPINION — this is the MOST important one ----
  { intent: 'OPINION', banks: [
    { confidence: 0.99, phrases: [
      'what do you think about', 'what do u think about', 'what do you think of',
      'what is your opinion on', 'what is your opinion about', "what's your opinion on",
      "what's your opinion about", 'your opinion on', 'your opinion about',
      'your thoughts on', 'your thoughts about', 'thoughts on', 'thoughts about',
      'how do you feel about', 'how u feel about', 'how do you feel',
      "what's your take on", "what's your take", 'your take on', 'whats your take',
      "what's your view on", 'your view on', 'what is your view',
      'what would you say about', 'tell me your opinion', 'give me your opinion',
      'be honest about', 'honestly what do you think', 'honest opinion',
      'what do you reckon', 'what you reckon',
    ]},
    { confidence: 0.9, phrases: [
      'do you like', 'do u like', 'you like', 'is he good', 'is she good', 'is it good',
      'is he actually good', 'is he bad', 'is he solid', 'what about',
      'tell me what you think', 'how do you see', 'what would you say',
      'any thoughts', 'got thoughts', 'got opinions',
    ]},
    { confidence: 0.8, phrases: [
      'what do you think', 'what do u think', 'what you think',
    ]},
  ]},

  // ---- DESCRIBE / WHO IS ----
  { intent: 'DESCRIBE', banks: [
    { confidence: 0.99, phrases: [
      'tell me about', 'who is', 'what is', 'describe', 'explain who',
      'who exactly is', 'give me info on', 'give me information about',
      'what do you know about', 'what can you tell me about',
    ]},
    { confidence: 0.85, phrases: ['explain', 'give me']},
  ]},

  // ---- QUESTION FACT ----
  { intent: 'QUESTION_FACT', banks: [
    { confidence: 0.97, phrases: [
      'does he', 'did he', 'does she', 'did she', 'how much', 'how many',
      'how long', 'how often', 'who taught', 'who teaches', 'who trained',
      'where is he from', 'where is she from', 'where does', 'when did',
      'is he from', 'is she from', 'has he', 'has she', 'can he', 'can she',
    ]},
    { confidence: 0.85, phrases: ['does ', 'did ', 'can he', 'is he ', 'is she ']},
  ]},

  // ---- COMPARE ----
  { intent: 'COMPARE', banks: [
    { confidence: 0.99, phrases: [
      'who is better', 'which is better', 'who wins', 'who would win',
      'compare', 'comparison between', 'difference between', 'versus',
      'is he better than', 'is she better than', 'or is',
    ]},
    { confidence: 0.88, phrases: ['better than', 'worse than', 'vs', 'or ', 'stronger than', 'weaker than']},
  ]},

  // ---- CHESS (topic intent, when no entity present) ----
  { intent: 'CHESS', banks: [
    { confidence: 0.99, phrases: [
      'talk about chess', 'chess lesson', 'chess teacher', 'chess training',
      'play chess', 'playing chess', 'let us talk about chess', 'chess match',
      'how good are you at chess', 'how good is your chess',
    ]},
    { confidence: 0.9, phrases: ['chess', 'elo', 'checkmate', 'blunder', 'gambit', 'openings', 'chess game']},
  ]},

  // ---- TRADING ----
  { intent: 'TRADING', banks: [
    { confidence: 0.99, phrases: ['how does forex work', 'tell me about forex', 'forex trading', 'talk about trading', 'trading strategy']},
    { confidence: 0.9, phrases: ['forex', 'trading', 'trade market', 'forex market']},
  ]},

  // ---- BUSINESS ----
  { intent: 'BUSINESS', banks: [
    { confidence: 0.99, phrases: ['business idea', 'business plan', 'business model', 'startup idea', 'business ideas', 'make money online']},
    { confidence: 0.85, phrases: ['business', 'startup', 'entrepreneur', 'venture']},
  ]},

  // ---- GAMING ----
  { intent: 'GAMING', banks: [
    { confidence: 0.99, phrases: ['what games', 'what game do you play', 'what do you play', 'what games do you like', 'gaming session', 'game night', 'hop on', 'server up']},
    { confidence: 0.85, phrases: ['gaming', 'game', 'gamer', 'play games', 'games']},
  ]},

  // ---- PUBG ----
  { intent: 'PUBG', banks: [
    { confidence: 0.99, phrases: ['pubg', 'battle royale', 'chicken dinner', 'still play pubg', 'does he play pubg', 'does jika play pubg']},
  ]},

  // ---- MINECRAFT ----
  { intent: 'MINECRAFT', banks: [
    { confidence: 0.99, phrases: ['minecraft', 'kurdo smp', 'gar smp', 'smp server', 'still play minecraft', 'does he play minecraft']},
  ]},

  // ---- PC / MONITOR ----
  { intent: 'PC_MONITOR', banks: [
    { confidence: 0.99, phrases: [
      'bought a pc without a monitor', 'pc without monitor', 'no monitor', 'without monitor',
      'monitor story', 'armand monitor', 'forgot the monitor', 'armand pc',
    ]},
    { confidence: 0.8, phrases: ['monitor', 'pc build', 'gaming setup', 'built a pc']},
  ]},

  // ---- JOKE ----
  { intent: 'JOKE', banks: [
    { confidence: 0.99, phrases: ['tell me a joke', 'say something funny', 'make me laugh', 'got any jokes', 'joke time']},
    { confidence: 0.85, phrases: ['joke', 'funny', 'humor', 'humour', 'roast']},
  ]},

  // ---- NEGATION ----
  { intent: 'NEGATION', banks: [
    { confidence: 0.98, phrases: [
      'no bro', 'nah bro', 'not really', 'not true', "that's wrong", 'thats wrong',
      'i do not think so', 'dont think so', 'not the case', 'no way bro',
      "that's not true", 'thats not true', 'you are wrong', 'ur wrong',
    ]},
    { confidence: 0.9, phrases: ['no', 'nope', 'nah', 'wrong', 'incorrect', 'never', 'no way']},
  ]},

  // ---- AFFIRMATION ----
  { intent: 'AFFIRMATION', banks: [
    { confidence: 0.95, phrases: [
      'yes bro', 'yeah bro', 'for real bro', 'exactly bro', 'true bro', 'that is true',
      "you're right", 'ur right', 'agreed', 'of course', 'definitely',
      'you are right', 'thats right', "that's right",
    ]},
    { confidence: 0.87, phrases: ['yes', 'yeah', 'yep', 'yup', 'sure', 'true', 'facts', 'exactly', 'right', 'correct']},
  ]},

  // ---- CONFUSION ----
  { intent: 'CONFUSION', banks: [
    { confidence: 0.99, phrases: [
      'what do you mean', 'what u mean', 'i do not understand', 'dont understand',
      'come again', 'say that again', 'explain that', 'explain please',
      'i am confused', 'i am lost', 'wait what', 'what now',
    ]},
    { confidence: 0.88, phrases: ['what', 'huh', 'wdym', 'wym', 'explain', 'confused']},
  ]},

  // ---- REACTION ----
  { intent: 'REACTION', banks: [
    { confidence: 0.95, phrases: [
      'that is crazy', "that's crazy", 'no way', 'bro what', 'wait what',
      'are you serious', 'seriously though', 'that is wild', "that's wild",
      'insane bro', 'bro really', 'actually',
    ]},
    { confidence: 0.8, phrases: ['really', 'seriously', 'damn', 'wow', 'crazy', 'insane', 'wild', 'lol', 'lmao']},
  ]},

  // ---- FOLLOWUP ----
  { intent: 'FOLLOWUP', banks: [
    { confidence: 0.99, phrases: [
      'same question', 'ask the same', 'why though', 'why tho', 'but why',
      'how so', 'how come', 'what about him', 'what about her', 'what about them',
      'what about that', 'and what about', 'what about his', 'what about her',
      'is he actually', 'is he really', 'for real though',
    ]},
    { confidence: 0.88, phrases: ['why', 'how', 'and', 'same', 'him', 'her', 'his', 'their', 'that', 'really', 'wait']},
  ]},
];

// Detect sentiment from raw text
export function detectSentiment(text: string): Sentiment {
  if (/😂|lmao|lol|haha|💀|😭/.test(text)) return 'joking';
  if (/wow|crazy|insane|wild|no way|bro what|🔥|lets go|yooo/.test(text)) return 'excited';
  if (/nah|no|wrong|not true|dont|trash|bad|terrible/.test(text)) return 'negative';
  if (/yes|yeah|true|facts|great|good|nice|solid|love|based/.test(text)) return 'positive';
  if (/huh|what|confused|idk|dont understand|wdym/.test(text)) return 'confused';
  return 'neutral';
}

export function detectIntent(
  text: string,
  entities: EntityMatch[],
  topics: TopicMatch[]
): IntentMatch {
  let best: IntentMatch = { intent: 'UNKNOWN', confidence: 0 };
  const padded = ' ' + text + ' ';

  for (const { intent, banks } of INTENT_BANKS) {
    for (const bank of banks) {
      for (const phrase of bank.phrases) {
        if (padded.includes(' ' + phrase + ' ') ||
            text.startsWith(phrase + ' ') ||
            text.endsWith(' ' + phrase) ||
            text === phrase ||
            text.includes(phrase)) {
          const score = bank.confidence;
          if (score > best.confidence) {
            best = { intent, confidence: score };
          }
          break;
        }
      }
    }
  }

  // Semantic boosting: if entity detected + OPINION phrase → stronger OPINION signal
  if (entities.length > 0 && best.intent === 'OPINION') {
    best.confidence = Math.min(0.99, best.confidence + 0.05);
  }

  // If a topic is detected but no strong intent, make it a topic intent
  if (best.confidence < 0.6 && topics.length > 0) {
    const topTopic = topics[0];
    const topicToIntent: Partial<Record<Topic, Intent>> = {
      chess: 'CHESS', trading: 'TRADING', business: 'BUSINESS',
      gaming: 'GAMING', pubg: 'PUBG', minecraft: 'MINECRAFT',
      pc: 'PC_MONITOR', armand: 'ARMAND', bear: 'BEAR',
    };
    const mapped = topicToIntent[topTopic.topic];
    if (mapped) best = { intent: mapped, confidence: topTopic.confidence * 0.9 };
  }

  // Short single-word check for likely follow-ups
  const trimmed = text.trim();
  if (best.confidence < 0.5 && (trimmed.length <= 6 || /^(why|how|really|and|same|him|her|his|that|wait|ok|okay)$/.test(trimmed))) {
    best = { intent: 'FOLLOWUP', confidence: 0.75 };
  }

  return best;
}