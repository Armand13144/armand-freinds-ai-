import type { Topic, TopicMatch } from './types';

// Each topic has a primary keyword list and a secondary (contextual) list.
// Primary words get higher confidence; secondary words boost but don't alone trigger.
interface TopicDef { primary: string[]; secondary: string[]; }

const TOPIC_DEFS: Record<Topic, TopicDef> = {
  chess: {
    primary: [
      'chess', 'checkmate', 'elo', 'opening', 'gambit', 'sicilian',
      'blunder', 'tactic', 'tactics', 'grandmaster', 'gm', '1640',
      'chess teacher', 'chess lesson', 'chess match', 'chess game',
      'chess player', 'chess training', 'chess skills', 'chess move',
      'chess student', 'play chess', 'playing chess', 'learn chess',
      'chesscom', 'chess.com', 'lichess', 'blitz', 'bullet chess',
      'rapid chess', 'classical chess',
    ],
    secondary: [
      'pawn', 'rook', 'bishop', 'knight', 'king', 'queen', 'board',
      'stalemate', 'endgame', 'middlegame', 'rank', 'rating', 'ranked',
      'check', 'mate', 'strategy', 'best move', 'bad move',
    ],
  },
  trading: {
    primary: [
      'forex', 'fx trading', 'trading', 'trade', 'trader', 'currency',
      'forex market', 'forex trader', 'market analysis', 'technical analysis',
      'fundamental analysis', 'trading strategy', 'trade setup',
      'risk management', 'position', 'leverage', 'broker',
      'pip', 'pips', 'lot', 'lots', 'signal', 'sell signal', 'buy signal',
    ],
    secondary: [
      'market', 'markets', 'stock', 'stocks', 'crypto', 'bitcoin', 'btc',
      'profit', 'loss', 'buy', 'sell', 'entry', 'exit', 'long', 'short',
      'chart', 'charts', 'price', 'spread', 'investment', 'investing',
    ],
  },
  business: {
    primary: [
      'business idea', 'business ideas', 'business plan', 'business model',
      'startup', 'start up', 'entrepreneur', 'entrepreneurship', 'venture',
      'online business', 'small business', 'big business',
      'make money', 'making money', 'money making',
    ],
    secondary: [
      'business', 'company', 'companies', 'project', 'idea', 'ideas',
      'profit', 'revenue', 'income', 'customer', 'customers', 'marketing',
      'product', 'service', 'store', 'shop', 'invest', 'opportunity',
      'launch', 'enterprise', 'capital', 'money',
    ],
  },
  gaming: {
    primary: [
      'gaming', 'video game', 'game night', 'kurdo smp', 'gar smp', 'smp server',
      'server owner', 'game server', 'admin server', 'gamer', 'pc gaming',
      'rainbow six', 'r6 siege', 'r6 mobile',
    ],
    secondary: [
      'game', 'play', 'playing', 'played', 'server', 'rank', 'ranked',
      'match', 'lobby', 'team', 'squad', 'clan', 'admin', 'owner',
      'discord', 'stream', 'xbox', 'ps5', 'roblox',
    ],
  },
  pubg: {
    primary: [
      'pubg', 'battlegrounds', 'battle royale', 'chicken dinner', 'warzone',
      'pubg mobile', 'pubg squad', 'pubg match',
    ],
    secondary: ['squad', 'drop zone', 'zone', 'loot'],
  },
  minecraft: {
    primary: [
      'minecraft', 'kurdo smp', 'gar smp', 'smp', 'creeper', 'diamond',
      'mining', 'crafting', 'bedrock', 'survival', 'mc server',
    ],
    secondary: ['mc', 'blocks', 'build', 'base', 'mine', 'craft'],
  },
  pc: {
    primary: [
      'monitor', 'no monitor', 'without monitor', 'pc build', 'gaming setup',
      'computer setup', 'gpu', 'cpu', 'ram', 'ssd', 'graphics card',
      'bought a pc', 'built a pc', 'pc without monitor', 'monitorless',
    ],
    secondary: ['pc', 'computer', 'desktop', 'laptop', 'keyboard', 'mouse', 'hardware', 'setup'],
  },
  armand: {
    primary: ['armand', 'creator armand', 'armand bro', 'the creator'],
    secondary: ['creator', 'founder'],
  },
  bear: {
    primary: ['dagestan warriors', 'dagestan warrior', 'dagestan bear', 'the bear', 'wrcha bear'],
    secondary: ['bear', 'dagestan'],
  },
  none: { primary: [], secondary: [] },
};

export function detectTopics(text: string): TopicMatch[] {
  const results: TopicMatch[] = [];
  const padded = ' ' + text + ' ';

  for (const [topicKey, def] of Object.entries(TOPIC_DEFS) as Array<[Topic, TopicDef]>) {
    if (topicKey === 'none') continue;
    let score = 0;
    let matched = false;
    // Primary — phrase match
    for (const phrase of def.primary) {
      if (padded.includes(' ' + phrase + ' ') || text.includes(phrase)) {
        score = Math.max(score, phrase.includes(' ') ? 0.95 : 0.85);
        matched = true;
      }
    }
    // Secondary — word boundary match
    for (const word of def.secondary) {
      const re = new RegExp('\\b' + word + '\\b');
      if (re.test(text)) {
        score = Math.max(score, 0.6);
        matched = true;
      }
    }
    if (matched) results.push({ topic: topicKey, confidence: score });
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}