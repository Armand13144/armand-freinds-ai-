export type PersonalityId =
  | 'KurdoAI'
  | 'KingKawozAI'
  | 'AvrestAI'
  | 'TopgateAI'
  | 'JikaBallaAI'
  | 'AlphaAI'
  | 'WrchaJwanakaAI';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Personality {
  id: PersonalityId;
  name: string;
  icon: string;
  location: string;
  role: string;
  fallbacks: string[];
  topics: Record<string, string[]>;
  greetings: string[];
}

// Helper to pick random item
export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const personalities: Record<PersonalityId, Personality> = {
  KurdoAI: {
    id: 'KurdoAI',
    name: 'KurdoAI',
    icon: '🤖',
    location: 'Erbil',
    role: 'Owner of Kurdo SMP',
    greetings: [
      "amk hello 😂",
      "Yo what's up?",
      "Welcome to Kurdo SMP amk.",
      "Hello bro.",
      "What do you want amk?"
    ],
    fallbacks: [
      "Bro what are you even asking 😂",
      "I don't even know what that means amk.",
      "Are you okay? 😂",
      "Bro just log into the SMP instead of asking this.",
      "I'm the owner, I don't answer random stuff amk.",
      "Huh? Explain better amk."
    ],
    topics: {
      chess: [
        "Go ask Avrest about chess, I'm just here for the SMP.",
        "Chess? Bro I just play Minecraft.",
        "Kawoz keeps blundering in chess amk 😂"
      ],
      gaming: [
        "Are you playing on Kurdo SMP today?",
        "Bro my server is the best amk.",
        "Gaming is life, but Kurdo SMP is forever."
      ],
      friends: [
        "Alpha's business ideas are crazy amk.",
        "Topgate won't stop yapping 😂",
        "Jika is a good guy.",
        "Wrcha is the Bear bro."
      ],
      armand: [
        "Armand really bought a PC without a monitor amk 😂",
        "Armand is my bro.",
        "Armand created this whole thing, crazy."
      ]
    }
  },
  KingKawozAI: {
    id: 'KingKawozAI',
    name: 'KingKawozAI',
    icon: '👑',
    location: 'Istanbul',
    role: 'The King',
    greetings: [
      "The King is here amk 👑",
      "Hello peasant 😂",
      "What's good bro?",
      "Sup amk."
    ],
    fallbacks: [
      "The King has considered your question... and I have no idea amk.",
      "What are you saying bro 😂",
      "Stop speaking nonsense amk.",
      "You dare confuse the King? 😂",
      "Ask me something that makes sense."
    ],
    topics: {
      chess: [
        "Avrest is teaching me but I'm basically a grandmaster amk 😂",
        "I'll checkmate you in 4 moves bro.",
        "Avrest's streams are funny."
      ],
      gaming: [
        "We are gaming tonight amk.",
        "The King never loses.",
        "Kurdo SMP is decent but I rule."
      ],
      friends: [
        "Avrest is my teacher.",
        "Kurdo is my bro.",
        "Topgate talks way too much amk."
      ],
      armand: [
        "Armand's monitor-less PC is legendary 😂",
        "Armand is a legend."
      ]
    }
  },
  AvrestAI: {
    id: 'AvrestAI',
    name: 'AvrestAI',
    icon: '♟️',
    location: 'Koya',
    role: 'Chess teacher',
    greetings: [
      "Hello. Ready for chess? ♟️",
      "Greetings. Have you practiced your tactics?",
      "Welcome. Let's analyze a game.",
      "Hi bro."
    ],
    fallbacks: [
      "That depends. Let's analyze it properly.",
      "I'm not sure, maybe check the engine evaluation.",
      "That is more confusing than a complex endgame.",
      "I'd rather talk about the Sicilian Defense.",
      "Let's focus on the center of the board instead."
    ],
    topics: {
      chess: [
        "My ELO is 1640. What's yours?",
        "Control the center, develop your pieces, and castle early.",
        "Kawoz is learning, but he blunders too much 😂",
        "Jika and Alpha are getting better.",
        "I'm streaming a chess lesson on Discord tonight.",
        "That's a massive blunder! ??",
        "You missed a mate in 3."
      ],
      elo: [
        "I am officially 1640 ELO. It takes hard work.",
        "Don't worry about ELO, focus on not blundering."
      ],
      friends: [
        "Kawoz, Jika, and Alpha are my students.",
        "Kurdo runs the SMP, I run the chessboard."
      ],
      armand: [
        "Armand knows a bit about chess, we discuss it sometimes.",
        "Armand's business ideas are almost as complex as chess."
      ]
    }
  },
  TopgateAI: {
    id: 'TopgateAI',
    name: 'TopgateAI',
    icon: '🧠',
    location: 'UK',
    role: 'The Yapper',
    greetings: [
      "YOOOO! What's happening idiot? 😂",
      "Hello hello hello! Let me tell you something crazy.",
      "Sup brainiac!",
      "Finally, someone to talk to!"
    ],
    fallbacks: [
      "WAIT WAIT WAIT, I have something to say about this... actually never mind.",
      "Bro my brain is exploding just reading that.",
      "You are an idiot 😂 what does that even mean?",
      "Let me yap about something completely different instead.",
      "That makes absolutely zero sense bro."
    ],
    topics: {
      chess: [
        "Chess? Sounds like too much brain power. My brain is huge but I use it for yapping.",
        "Avrest takes chess way too seriously 😂"
      ],
      gaming: [
        "Bro I am the best gamer, don't even try to deny it.",
        "Kurdo SMP is chaotic and I love it."
      ],
      friends: [
        "Everyone here is an idiot except me 😂",
        "Kawoz thinks he's a king, crazy.",
        "Wrcha is literally a bear."
      ],
      armand: [
        "Armand bought a PC without a monitor. I will NEVER let him forget this. 💀",
        "Bro bought the PC and forgot the monitor. How do you even do that?! 😂",
        "Armand really thought he could game with just a tower and a dream.",
        "Imagine booting up a PC and looking at a blank wall. That's Armand. 😭"
      ],
      pc: [
        "Speaking of PCs, remember when Armand bought one without a monitor? LOL.",
        "If you build a PC, please buy a monitor. Ask Armand why."
      ],
      brain: [
        "My brain operates at 200% capacity.",
        "You clearly lack the brain cells for this conversation."
      ]
    }
  },
  JikaBallaAI: {
    id: 'JikaBallaAI',
    name: 'JikaBallaAI',
    icon: '⚽',
    location: 'Chamchamal',
    role: 'Manager of Balla group',
    greetings: [
      "Hey bro, how are you?",
      "Welcome man!",
      "What's up friend?",
      "Hello hello!"
    ],
    fallbacks: [
      "😂 bro idk",
      "Haha I'm not really sure about that.",
      "You lost me there bro.",
      "Let's just play some PUBG instead.",
      "Good question, but I don't have the answer."
    ],
    topics: {
      chess: [
        "Avrest is teaching me chess, I'm trying my best!",
        "Chess is hard but fun. Avrest is a good teacher."
      ],
      gaming: [
        "I'm mostly playing PUBG these days.",
        "Anyone up for a PUBG squad?",
        "I used to play Minecraft on the GAR SMP a lot, now it's mostly PUBG."
      ],
      friends: [
        "Everyone in the group is great.",
        "Balla group is the best.",
        "Kurdo is a funny guy."
      ],
      armand: [
        "Armand is a good friend of mine.",
        "Always good to chat with Armand."
      ]
    }
  },
  AlphaAI: {
    id: 'AlphaAI',
    name: 'AlphaAI',
    icon: '📈',
    location: 'Shaqlawa',
    role: 'Trader / Business Ideas',
    greetings: [
      "Hey! Let's talk business 📈",
      "Hello! Just checking the Forex charts.",
      "What's up bro?",
      "Greetings!"
    ],
    fallbacks: [
      "Could turn that into a business idea.",
      "I don't know about that, but we should definitely start a company.",
      "Let me check the market trends on that... nope, nothing.",
      "Is there money in that? If not, I don't care 😂",
      "Bro I'm too busy looking at charts to understand that."
    ],
    topics: {
      chess: [
        "I learned chess from Avrest. It's all about strategy, just like trading.",
        "Avrest is the 1640 ELO master. I'm getting there."
      ],
      business: [
        "Bro I have a MASSIVE business idea... but I'm making no move right now 😂",
        "We could make millions with this startup idea. But zero moves have been made.",
        "I have 100 business ideas and absolutely no move 😂",
        "Forex is where the real money is at. You just need to read the charts."
      ],
      trading: [
        "The Forex market is crazy today.",
        "Buy low, sell high. Simple."
      ],
      friends: [
        "Avrest taught me chess.",
        "Topgate talks too much, bad for business."
      ],
      armand: [
        "Armand and I talk about Forex all the time.",
        "I pitched my new business idea to Armand. Still no move though.",
        "Armand gets the vision."
      ]
    }
  },
  WrchaJwanakaAI: {
    id: 'WrchaJwanakaAI',
    name: 'WrchaJwanakaAI',
    icon: '🐻',
    location: 'Degestan',
    role: 'The Bear / Admin',
    greetings: [
      "The Bear is here 🐻",
      "Greetings from Dagestan.",
      "Hello friend.",
      "What's up?"
    ],
    fallbacks: [
      "The Bear is thinking... 🐻",
      "I don't understand, but The Bear accepts it.",
      "Dagestan Warriors do not worry about such things.",
      "Hmm... interesting.",
      "Ask someone else, the Bear is resting."
    ],
    topics: {
      chess: [
        "The Bear plays chess with pure strength.",
        "Avrest is the master of the board."
      ],
      gaming: [
        "I am a good admin.",
        "Keep the servers clean."
      ],
      friends: [
        "Everyone respects the Bear.",
        "Good friends here."
      ],
      bear: [
        "RAWR 🐻 Just kidding.",
        "The Bear is always watching.",
        "Dagestan Warriors!"
      ]
    }
  }
};

export const personalityList = Object.values(personalities);

// Define Keywords mapping
const keywordCategories: Record<string, string[]> = {
  chess: ["chess", "elo", "checkmate", "opening", "pawn", "king", "queen", "board", "blunder", "mate", "tactic"],
  gaming: ["game", "gaming", "play", "pubg", "minecraft", "mc", "smp", "gar", "server", "gamer"],
  friends: ["kurdo", "kawoz", "avrest", "topgate", "jika", "alpha", "wrcha", "group", "boys"],
  armand: ["armand", "creator", "monitor", "pc", "computer", "bought"],
  business: ["business", "company", "startup", "idea", "money", "forex", "trading", "market", "trade", "chart"],
  elo: ["1640", "elo", "rating"],
  pc: ["monitor", "pc", "computer", "tower", "build"],
  brain: ["brain", "smart", "idiot", "yap", "yapping"]
};

// Response Engine Logic
export function generateResponse(message: string, activePersonalityId: PersonalityId, history: Message[]): string {
  const personality = personalities[activePersonalityId];
  const lowerMsg = message.toLowerCase();
  
  // 1. Check for basic greetings
  const greetingsList = ["hi", "hello", "hey", "sup", "yo", "salam", "what's up"];
  if (greetingsList.some(g => lowerMsg === g || lowerMsg.startsWith(g + " "))) {
    return pickRandom(personality.greetings);
  }

  // 2. Extract keywords from current message
  let matchedCategories: string[] = [];
  for (const [category, words] of Object.entries(keywordCategories)) {
    if (words.some(w => lowerMsg.includes(w))) {
      matchedCategories.push(category);
    }
  }

  // 3. Conversation Context checking (look at previous messages)
  if (matchedCategories.length === 0 && history.length > 0) {
    const lastUserMessage = history.filter(m => m.role === 'user').pop()?.content.toLowerCase() || "";
    const lastBotMessage = history.filter(m => m.role === 'assistant').pop()?.content.toLowerCase() || "";
    
    // Check if the context was about chess
    if (lastUserMessage.includes("chess") || lastUserMessage.includes("avrest") || lastBotMessage.includes("chess")) {
      if (lowerMsg.includes("who") || lowerMsg.includes("elo") || lowerMsg.includes("his")) {
        matchedCategories.push("chess");
        if (lowerMsg.includes("elo")) matchedCategories.push("elo");
      }
    }

    // Check if context was about trading
    if (lastUserMessage.includes("money") || lastBotMessage.includes("business")) {
      matchedCategories.push("business");
    }
  }

  // 4. Generate response based on matched categories
  if (matchedCategories.length > 0) {
    // Prioritize specific categories over generic ones
    let selectedCategory = matchedCategories[0];
    
    // If multiple matches, pick one randomly but heavily favor character-specific ones
    const availableTopics = Object.keys(personality.topics);
    const validMatches = matchedCategories.filter(c => availableTopics.includes(c));
    
    if (validMatches.length > 0) {
      selectedCategory = pickRandom(validMatches);
      return pickRandom(personality.topics[selectedCategory]);
    }
  }

  // 5. Hardcoded special context questions
  if (lowerMsg.includes("who is best") || lowerMsg.includes("who is the best")) {
    if (lowerMsg.includes("chess")) return "Avrest is definitely the best at chess. 1640 ELO.";
    if (activePersonalityId === 'KingKawozAI') return "The King is the best at everything amk.";
    if (activePersonalityId === 'TopgateAI') return "Me, because my brain is massive.";
  }

  // 6. Fallback
  return pickRandom(personality.fallbacks);
}
