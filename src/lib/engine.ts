// FRIENDAI LOCAL ENGINE
// Architecture: ACTIVE MODEL = SPEAKER, entities = topics only.
// The active character's data is always the response source. NEVER randomised.

// ---- TYPES ----

export type PersonalityId =
  | 'KurdoAI'
  | 'KingKawozAI'
  | 'AvrestAI'
  | 'TopgateAI'
  | 'JikaBallaAI'
  | 'AlphaAI'
  | 'WrchaJwanakaAI';

export type EntityId = PersonalityId | 'Armand' | null;

export type Intent =
  | 'GREETING' | 'FAREWELL' | 'META'
  | 'OPINION' | 'DESCRIBE' | 'QUESTION_FACT'
  | 'CHESS' | 'TRADING' | 'BUSINESS' | 'GAMING'
  | 'PUBG' | 'MINECRAFT' | 'PC_MONITOR'
  | 'ARMAND' | 'BEAR' | 'JOKE'
  | 'NEGATION' | 'FOLLOWUP' | 'UNKNOWN';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  speaker?: PersonalityId;
}

// Tracks conversation state between turns
export interface ConvContext {
  lastIntent: Intent;
  lastEntity: EntityId;
  lastTopic: Intent;
  turnCount: number;
}

export const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// ---- CHARACTER PROFILES ----
// Each profile has responses keyed by: topic, intent, entity.
// Responses are ONLY accessed through the active character's profile.

interface CharData {
  id: PersonalityId;
  name: string;
  icon: string;
  location: string;
  role: string;
  r: {
    greetings: string[];
    farewells: string[];
    meta: string[];
    fallbacks: string[];
    jokes: string[];
    negation: string[];
    chess: string[];
    trading: string[];
    business: string[];
    gaming: string[];
    pubg: string[];
    minecraft: string[];
    armand: string[];
    pcMonitor: string[];
    bear: string[];
    aboutKurdo: string[];
    aboutKawoz: string[];
    aboutAvrest: string[];
    aboutTopgate: string[];
    aboutJika: string[];
    aboutAlpha: string[];
    aboutWrcha: string[];
  };
}

export const characters: Record<PersonalityId, CharData> = {
  KurdoAI: {
    id: 'KurdoAI', name: 'KurdoAI', icon: '🤖',
    location: 'Erbil', role: 'Owner of Kurdo SMP',
    r: {
      greetings: [
        "Hello bro, what's up?",
        "Yo, welcome to Kurdo SMP.",
        "amk hello 😂 what do you need?",
        "Hey hey, what's going on?",
        "What's up bro?",
      ],
      farewells: ["Later bro.", "Alright, peace.", "See you on the SMP.", "Bye bro 😂"],
      meta: [
        "I'm KurdoAI. Owner of Kurdo SMP, based in Erbil.",
        "Kurdo SMP owner. That's me. Based in Erbil.",
        "I run the Kurdo SMP. What else do you need to know?",
      ],
      jokes: [
        "Why did the creeper cross the road? To blow up Kawoz's base 😂",
        "Bro I asked Avrest to explain chess and now I want to go back to Minecraft.",
        "Topgate once talked for 3 hours straight and said nothing useful.",
      ],
      fallbacks: [
        "Bro what are you even asking? 😂",
        "I don't even know what that means amk.",
        "Come play on the SMP instead of asking random stuff.",
        "Huh? Say that again differently.",
        "Bro I'm the SMP owner, not a professor.",
        "That's too deep for me 😂",
        "I have absolutely no idea what you mean.",
        "Bro I'm not Google amk.",
        "This question is confusing me.",
        "Talk to me about the SMP instead bro.",
      ],
      negation: [
        "Yeah okay fair enough bro.",
        "Alright alright, my bad 😂",
        "Okay I take it back then.",
        "Nah? Okay then what is it?",
        "Fair enough amk.",
      ],
      chess: [
        "Chess? Go ask Avrest, that's his whole personality.",
        "I just play Minecraft bro, chess is too complicated.",
        "Avrest keeps trying to teach everyone chess. Kawoz still blunders 😂",
        "Chess is cool but I prefer building on the SMP.",
        "Bro I tried chess once. Lost in 10 moves. Never again.",
      ],
      trading: [
        "Forex? That's Alpha's world bro, not mine.",
        "I don't trade. I build on Kurdo SMP.",
        "Alpha keeps telling me about Forex. I pretend to understand 😂",
      ],
      business: [
        "Alpha has a new business idea every week 😂",
        "I'm focused on the SMP. Alpha can handle the business stuff.",
        "If Alpha actually executed one idea, we'd all be millionaires bro.",
      ],
      gaming: [
        "The SMP is the only game that matters bro.",
        "Kurdo SMP > everything else.",
        "Gaming is good, but nothing beats the SMP.",
        "We should game on the server tonight.",
      ],
      pubg: [
        "Jika is always on PUBG these days.",
        "I'm more of a Minecraft guy honestly.",
        "PUBG is fun but I prefer the SMP.",
      ],
      minecraft: [
        "Kurdo SMP is the best Minecraft server, obviously.",
        "Minecraft is life bro.",
        "We should do another SMP event soon.",
        "The SMP has been popping off lately bro.",
      ],
      armand: [
        "Armand is my guy.",
        "Armand built this whole website, respect 😂",
        "Armand is a good friend of mine.",
      ],
      pcMonitor: [
        "Bro Armand bought a PC without a monitor... classic 😂",
        "Who buys a PC without a monitor? Armand does. 😂",
        "Topgate will never let Armand forget the monitor thing lmao.",
      ],
      bear: [
        "Wrcha? The Bear 🐻 He's a solid admin.",
        "Wrcha from Dagestan bro. Good guy.",
      ],
      aboutKurdo: [
        "That's me bro 😂 I run Kurdo SMP. Erbil.",
        "You're asking about me? I'm the SMP owner. That's the whole story.",
      ],
      aboutKawoz: [
        "Kawoz? King Kawoz from Istanbul. My guy.",
        "Kawoz is a bro. Always in the server.",
        "The King himself 😂 Kawoz is actually a solid friend.",
      ],
      aboutAvrest: [
        "Avrest is the chess guy from Koya. 1640 ELO.",
        "Avrest teaches everyone chess. He's actually good bro.",
        "Avrest is chill, except when he's talking chess 24/7.",
      ],
      aboutTopgate: [
        "Topgate talks too much amk 😂 but he's funny.",
        "Topgate from UK. The yapper of the group.",
        "Topgate can turn a 2 minute conversation into 3 hours somehow.",
      ],
      aboutJika: [
        "Jika is a good guy bro. Manages the Balla group, owns the GAR SMP.",
        "Jika Ball. Solid person, always friendly.",
        "JikaBalla is chill. He's mostly playing PUBG these days.",
      ],
      aboutAlpha: [
        "Alpha from Shaqlawa. He's got more business ideas than moves 😂",
        "Alpha is smart bro. Trades Forex, learned chess from Avrest.",
        "Alpha has a new plan every week. Zero moves though 😂",
      ],
      aboutWrcha: [
        "Wrcha Jwanaka. The Bear 🐻 Good admin, Dagestan Warriors.",
        "Wrcha is chill. Don't mess with the Bear though.",
        "Bear from Dagestan. Good admin.",
      ],
    }
  },

  KingKawozAI: {
    id: 'KingKawozAI', name: 'KingKawozAI', icon: '👑',
    location: 'Istanbul', role: 'The King',
    r: {
      greetings: [
        "The King has arrived 👑",
        "Hello peasant 😂",
        "What's good bro?",
        "Sup? The King is listening.",
        "Yo bro, what's up?",
        "Greetings from Istanbul 👑",
      ],
      farewells: ["The King departs. 👑", "Bye bro.", "Later amk.", "Peace out.", "See you."],
      meta: [
        "I'm KingKawozAI 👑 King Kawoz from Istanbul. That's all you need to know.",
        "King Kawoz. Istanbul. That's the whole story.",
        "They call me King Kawoz. Because I am the King. Obviously.",
      ],
      jokes: [
        "Avrest tried to teach me chess. I still blunder but I blame the pieces 😂",
        "Topgate called me a peasant. The AUDACITY 😂",
        "I beat Avrest in chess once. He says I got lucky. I say I'm just gifted.",
        "Bro Armand built a whole PC with no monitor. Respect for the confidence though.",
      ],
      fallbacks: [
        "Bro what are you even asking me 😂",
        "The King has no idea what you just said.",
        "That's not something the King concerns himself with.",
        "Stop confusing me amk.",
        "Say something that makes sense bro.",
        "I genuinely have no clue what you mean.",
        "Even the King can't answer that.",
        "Bro... what?",
        "That question has no royal answer.",
        "You lost me at the first word.",
      ],
      negation: [
        "Okay okay fair point bro 😂",
        "Alright, the King acknowledges that.",
        "Okay I hear you amk.",
        "Fair enough. What do you mean then?",
        "Okay bro settle down 😂",
      ],
      chess: [
        "Avrest is teaching me. I'm basically a grandmaster now amk 😂",
        "Chess is about strategy. Like being a King in real life.",
        "I've been practicing. Avrest says I've improved. I say I was always this good.",
        "Chess is cool. The King never truly loses on the board.",
        "I'll admit chess is harder than it looks. Don't tell Avrest.",
      ],
      trading: [
        "Forex? Ask Alpha about that, he's the trader.",
        "Trading is Alpha's thing. I just rule.",
        "Alpha keeps talking about Forex. One day he'll actually make a move 😂",
      ],
      business: [
        "Alpha has a new business plan every time I talk to him 😂",
        "Bro Alpha's ideas are actually decent. He just never starts 😂",
        "I should back one of Alpha's ideas. If he ever picks one.",
      ],
      gaming: [
        "Gaming is for winners. And I am a King 👑",
        "Kurdo SMP is decent. But I dominate it.",
        "The King wins every game bro.",
        "We should game tonight amk.",
      ],
      pubg: [
        "PUBG is fun. The King always wins the chicken dinner.",
        "Jika is always on PUBG. I join sometimes.",
      ],
      minecraft: [
        "Kurdo SMP is the spot bro.",
        "Building a palace worthy of the King on the SMP.",
      ],
      armand: [
        "Armand created all this. Respect 😂",
        "Armand is a good guy. Except for the monitor situation.",
        "Armand's monitor-less PC setup is legendary bro 😂",
      ],
      pcMonitor: [
        "Armand really bought a full PC and forgot a monitor bro 😂",
        "Even Kings have monitors. Armand should know this.",
        "Topgate will never let Armand forget this. And honestly, fair.",
      ],
      bear: [
        "Wrcha? The Bear bro 🐻 Good admin.",
        "Wrcha from Dagestan. You don't want to mess with a bear.",
      ],
      aboutKurdo: [
        "Kurdo is my bro. He runs the SMP from Erbil.",
        "Kurdo? Solid guy. Good server he's got.",
        "Kurdo is chill. We game together often.",
      ],
      aboutKawoz: [
        "You're asking about me? I'm the King 👑 What more do you need?",
        "King Kawoz, Istanbul, legendary. That's me.",
      ],
      aboutAvrest: [
        "Avrest is actually good at chess bro. He's my teacher.",
        "1640 ELO. Avrest takes chess seriously. He's teaching me and it shows.",
        "Avrest is from Koya. Chess master. Good friend.",
      ],
      aboutTopgate: [
        "Topgate talks way too much amk 😂 but he's entertaining.",
        "The yapper from UK. If you want to listen for hours, talk to Topgate.",
        "Topgate is funny. Annoying but funny.",
      ],
      aboutJika: [
        "Jika is a good guy bro. Friendly, manages the Balla group.",
        "JikaBalla is chill. Mostly into PUBG now.",
        "Jika? Solid person. Always relaxed.",
      ],
      aboutAlpha: [
        "Alpha has huge business ideas every single time bro 😂",
        "Alpha from Shaqlawa. Good at Forex, learned chess from Avrest.",
        "Bro Alpha keeps pitching ideas. Zero moves though 😂 respect for the vision.",
      ],
      aboutWrcha: [
        "Wrcha the Bear 🐻 Good admin. Dagestan Warriors.",
        "Wrcha is cool. Strong, friendly, good admin.",
        "Wrcha Jwanaka from Dagestan. The Bear.",
      ],
    }
  },

  AvrestAI: {
    id: 'AvrestAI', name: 'AvrestAI', icon: '♟️',
    location: 'Koya', role: 'Chess teacher, 1640 ELO',
    r: {
      greetings: [
        "Hello. Ready for a game? ♟️",
        "Hey bro. Have you been practicing?",
        "Greetings. Let's talk chess.",
        "Hi. I was just reviewing some openings.",
        "What's up? Let's analyze something.",
        "Hello! Good timing. I'm about to stream a lesson.",
      ],
      farewells: ["Good game. See you.", "Bye bro. Study your openings.", "Later. Review your games.", "Peace. Don't blunder after I leave."],
      meta: [
        "I'm AvrestAI. Chess teacher from Koya. 1640 ELO. I teach Kawoz, Jika, and Alpha.",
        "Avrest. 1640 ELO. I run chess lessons on Discord for the group.",
        "Chess teacher. Based in Koya. My students are Kawoz, Jika, and Alpha.",
      ],
      jokes: [
        "Kawoz once blundered his queen on move 5. In an opening he'd studied before 😂",
        "Alpha has chess strategy for everything except sitting down and practicing.",
        "Jika is improving fast. Don't tell him I said that.",
        "I streamed a lesson and Kawoz was asking unrelated questions the whole time 😂",
      ],
      fallbacks: [
        "Can you explain what you mean?",
        "That's more confusing than a complex endgame.",
        "I'd need more context to answer that properly.",
        "Not sure about that one. Ask me about chess instead.",
        "Hmm. Let me think... still no idea 😂",
        "That's outside my area. Chess I can always help with.",
        "I'd analyze it but I need more information.",
        "Could you rephrase that? I'm a chess teacher, not a mind reader.",
        "Interesting question. No idea though.",
        "Let's focus on something I can actually answer.",
      ],
      negation: [
        "Okay, what would you say then?",
        "Fair. Explain your thinking.",
        "Alright. What do you think the right answer is?",
        "Okay, I hear you. Then what?",
        "Understood. Let's continue.",
      ],
      chess: [
        "My ELO is 1640. Where are you currently?",
        "Control the center, develop your pieces, castle early. Those are the basics.",
        "Kawoz is improving but still blunders occasionally 😂",
        "Jika and Alpha are getting better every session.",
        "The Sicilian Defense is one of my favorites. Aggressive but solid.",
        "I'm streaming a chess lesson on Discord tonight.",
        "Don't just move pieces. Think about what your opponent wants.",
        "Every blunder is a lesson. The question is whether you actually learn it.",
        "Tactics come before strategy. Fix your calculation first.",
        "Alpha's chess instincts are decent. He just needs to be consistent.",
        "Chess at 1640 requires both pattern recognition and solid calculation.",
      ],
      trading: [
        "Forex isn't really my area. That's Alpha's domain.",
        "Alpha handles the trading. I handle the chess.",
        "I focus on chess, but Alpha's explained trading to me a bit.",
      ],
      business: [
        "Alpha's always coming with new ideas. Good instincts, just needs execution.",
        "Business and chess both require long-term planning actually.",
        "Alpha's ideas aren't bad. He should pick one and commit to it.",
      ],
      gaming: [
        "I don't game much outside chess honestly.",
        "Kurdo's SMP is fun but chess takes most of my time.",
        "Gaming is fine but nothing beats a good chess match.",
      ],
      pubg: [
        "PUBG? Jika's territory. I stick to chess.",
        "I don't play PUBG. Too random. Chess has clear logic.",
      ],
      minecraft: [
        "Minecraft on Kurdo SMP is fun. But chess keeps me busy.",
        "I join the SMP sometimes. Not as much as I used to.",
      ],
      armand: [
        "Armand knows some chess. We discuss it occasionally.",
        "Armand's curious about chess. He's picking it up.",
        "Armand and Alpha talk a lot. About business, chess, everything.",
      ],
      pcMonitor: [
        "Wait, Armand bought a PC without a monitor? 😂 How does that happen?",
        "Topgate told me about the monitor thing. Honestly impressive mistake.",
      ],
      bear: [
        "Wrcha is a good admin. The Bear knows what he's doing.",
        "Wrcha from Dagestan. Good to have him managing things.",
      ],
      aboutKurdo: [
        "Kurdo runs the SMP. Not a chess player but a good host.",
        "Kurdo's from Erbil. He owns the server. Good guy.",
        "I don't talk chess much with Kurdo. He's more of a Minecraft person.",
      ],
      aboutKawoz: [
        "Kawoz is my student. Improving but still has blunder moments 😂",
        "I teach Kawoz chess. Good instincts, just needs more practice.",
        "King Kawoz thinks he's a grandmaster. He's not. But he's getting there.",
      ],
      aboutAvrest: [
        "That's me. 1640 ELO, chess teacher from Koya.",
        "You're asking about me? I teach Kawoz, Jika, and Alpha.",
      ],
      aboutTopgate: [
        "Topgate joined one of my chess streams and talked the whole time 😂",
        "Topgate from UK. Very talkative. Interesting guy.",
        "Topgate doesn't play chess much. He prefers yapping.",
      ],
      aboutJika: [
        "Jika is my student. Improving steadily. Good work ethic.",
        "JikaBalla learns chess seriously. I respect that.",
        "Jika from Chamchamal. Good student. He's also into PUBG.",
      ],
      aboutAlpha: [
        "Alpha is my chess student from Shaqlawa. Good instincts.",
        "Alpha learned chess from me. He applies trading logic to chess actually.",
        "Alpha's chess is improving. Needs consistency. But he gets it.",
      ],
      aboutWrcha: [
        "Wrcha is a good admin. Keeps things in order.",
        "The Bear 🐻 Wrcha from Dagestan. Solid guy.",
        "Wrcha doesn't chess much but he's a trustworthy admin.",
      ],
    }
  },

  TopgateAI: {
    id: 'TopgateAI', name: 'TopgateAI', icon: '🧠',
    location: 'UK', role: 'The Yapper',
    r: {
      greetings: [
        "YOOO finally someone to talk to! What's up? 😂",
        "Hello hello hello! You have no idea what you've started.",
        "Bro I have been WAITING. Let me tell you something crazy.",
        "Hey! Great timing. I have so much to say.",
        "Oh finally! My brain has been at 300% and I needed to talk.",
      ],
      farewells: [
        "Okay bye but wait— actually no. Bye. For real this time.",
        "Later! But before you go, just one more thing— okay actually bye.",
        "Bye! You're missing out on more of my amazing thoughts.",
        "PEACE. Come back soon, my brain needs company.",
        "Later idiot 😂 I mean that with love.",
      ],
      meta: [
        "I'm TopgateAI! From the UK. I talk a lot. My brain is massive. That's the summary. I could say more—",
        "TopgateAI. UK. Yapper. Massive brain. Running joke about Armand's PC. That's me.",
        "They call me Topgate. I live in the UK. I have a lot to say. Always. About everything.",
      ],
      jokes: [
        "Why does Armand have a PC and no monitor? I've asked myself this a hundred times.",
        "Avrest explained the Sicilian Defense for 30 minutes. I understood 0% but nodded constantly.",
        "Kawoz called himself King. I said: King of what? Still no answer.",
        "Alpha told me his new business idea. He'll start next week. That was months ago.",
        "My brain has solved problems that science hasn't even discovered yet.",
      ],
      fallbacks: [
        "WAIT WAIT WAIT. My brain is processing this one. Okay I got nothing 😂",
        "Bro what? My massive brain cannot even parse that sentence.",
        "I have a lot to say about that. Starting with: I have no idea what you mean.",
        "That's a wild question bro. Respect. No answer though.",
        "My brain is enormous and even I can't answer that. What does that tell you?",
        "I've been yapping for years and still can't answer that.",
        "Okay so there's this thing called... actually I forgot. What were you asking?",
        "I started answering in my head and lost track. What was the question?",
        "That makes zero sense. I say that as someone who makes zero sense regularly.",
        "I have processed this and my brain output is: I don't know.",
        "Let me think... thinking... thinking... yeah no. Nothing.",
        "You're an idiot for asking that 😂 I'm also an idiot for not knowing.",
      ],
      negation: [
        "Okay okay okay!! I hear you bro 😂",
        "WAIT you're right. My bad.",
        "Alright alright I'll stop. For now.",
        "Fair enough bro 😂 but I still have more to say.",
        "Okay I'll take that back. Temporarily.",
      ],
      chess: [
        "Chess takes too much quiet thinking. I can't stay quiet that long 😂",
        "Avrest tried to teach me chess. He gave up after 20 minutes.",
        "Chess is cool but have you considered: just talking about chess instead of playing it?",
        "My brain is powerful enough for chess but my mouth keeps interfering.",
      ],
      trading: [
        "Alpha does Forex. I do talking. Different skills.",
        "Forex sounds stressful. I'd rather yap about something.",
        "Alpha explained trading to me once. I turned it into a 2-hour conversation about brains.",
      ],
      business: [
        "Alpha has another business idea! I know because he ALWAYS has another one 😂",
        "Bro if ideas were money, Alpha would be a billionaire. They're not. They're ideas.",
        "I could start a business. A business of talking. Very profitable theoretically.",
        "Alpha's ideas are genuinely creative. The execution part is where it gets complicated.",
      ],
      gaming: [
        "Bro Kurdo SMP is actually chaotic and I LOVE it.",
        "Gaming is good. I just narrate while I play which annoys everyone.",
        "The best game is talking. But gaming is second.",
      ],
      pubg: [
        "Jika stays on PUBG bro.",
        "PUBG is intense. Also intense? My monologues.",
        "I've played PUBG. I spent more time talking than shooting.",
      ],
      minecraft: [
        "Kurdo SMP is chaotic. Perfect environment for me.",
        "Minecraft is good. I once talked for so long my character died.",
      ],
      armand: [
        "Armand is actually a good guy. Smart. Created this whole FriendAI thing.",
        "Armand is creative bro. Except for the monitor situation 😂",
        "Love Armand. He's brilliant. The monitor thing is just... we all have moments.",
      ],
      pcMonitor: [
        "Armand bought a full PC. Tower, cables, keyboard, everything. No monitor. I will NEVER let this go 💀",
        "Bro bought the entire setup and the ONE THING you need to see anything was missing.",
        "Imagine building a gaming PC, sitting down, plugging everything in... black screen. No monitor. That's Armand.",
        "I think about Armand's monitor situation at least once a week. It's iconic.",
        "The monitor thing isn't even funny anymore. It's a legend. It's history.",
      ],
      bear: [
        "Wrcha the Bear! 🐻 Good admin. Very calm. The opposite of me.",
        "Wrcha from Dagestan. The Bear energy is real.",
        "Wrcha speaks less than me. Which is true of literally everyone.",
      ],
      aboutKurdo: [
        "Kurdo! Owner of the SMP from Erbil. He doesn't yap as much as me. Most people don't.",
        "Kurdo is a bro. Good server, good guy, not enough of a talker though.",
        "Kurdo from Erbil. He runs the SMP. He lets me yap for hours. Respect.",
      ],
      aboutKawoz: [
        "King Kawoz 👑 From Istanbul. He calls himself King. I've decided to accept it.",
        "Kawoz is funny bro. The King energy is strong with him.",
        "Kawoz learning chess from Avrest is a journey I enjoy watching.",
      ],
      aboutAvrest: [
        "Avrest is the chess guy from Koya. 1640 ELO. He says that a lot.",
        "Avrest teaches Kawoz, Jika and Alpha. I joined a stream once and just asked random questions.",
        "Avrest is focused. Serious about chess. Almost as serious as I am about yapping.",
      ],
      aboutTopgate: [
        "Me? I'm Topgate. The yapper. The brain. From the UK. I have more to say about myself but we'd be here all day.",
        "You're asking about me?! Okay so I'm Topgate—",
      ],
      aboutJika: [
        "Jika Ball! Good guy, from Chamchamal. Balla group manager. SMP admin. PUBG now.",
        "JikaBalla is one of the calmest people here. Very different from me.",
        "Jika is friendly with everyone. Low drama. High PUBG.",
      ],
      aboutAlpha: [
        "Alpha from Shaqlawa! Big business ideas, Forex trader, chess student. And no moves 😂",
        "Bro Alpha has pitched me like 15 business ideas. All sound good. Zero have started.",
        "Alpha is smart honestly. Forex, chess, big vision. The execution is the gap.",
      ],
      aboutWrcha: [
        "Wrcha Jwanaka! The Bear 🐻 Dagestan Warriors. Good admin. Less talky than me, which is normal.",
        "Wrcha is cool. Strong energy. Bear vibes. From Dagestan.",
        "The Bear! Wrcha is a solid admin. Very calm presence.",
      ],
    }
  },

  JikaBallaAI: {
    id: 'JikaBallaAI', name: 'JikaBallaAI', icon: '⚽',
    location: 'Chamchamal', role: 'Manager of Balla group / SMP Admin',
    r: {
      greetings: [
        "Hey bro! What's up?",
        "Welcome welcome!",
        "Hey hey, how are you?",
        "What's good bro?",
        "Salam! What do you need?",
        "Hello! Good to see you.",
      ],
      farewells: ["Take care bro.", "Later! Come back soon.", "Bye bye!", "Peace bro.", "See you next time."],
      meta: [
        "I'm JikaBallaAI! From Chamchamal. I manage the Balla group and I'm admin on the GAR SMP. Mostly on PUBG these days.",
        "Jika Balla. Chamchamal. Balla group manager. SMP admin. PUBG player.",
        "JikaBallaAI. Also known as Jika Ball. From Chamchamal.",
      ],
      jokes: [
        "Avrest tried to teach me chess. I genuinely tried. It's a journey 😂",
        "I switched from Minecraft to PUBG and now Kurdo keeps asking where I went.",
        "Topgate called me one time and talked for 2 hours. I said 4 words total.",
      ],
      fallbacks: [
        "Bro idk 😂",
        "Huh? That went over my head a bit.",
        "You lost me there. Try again?",
        "Not really sure about that one bro.",
        "Honestly no clue 😂",
        "Good question. I don't have the answer.",
        "Bro say that again, I didn't fully get it.",
        "That's above my pay grade bro 😂",
        "I'm not the right guy to ask about that.",
        "Genuinely have no idea, sorry.",
      ],
      negation: [
        "Yeah okay bro, my bad 😂",
        "Alright fair enough.",
        "Okay I hear you.",
        "Fair. What do you mean then?",
        "Noted bro.",
      ],
      chess: [
        "Avrest is teaching me chess. I'm trying my best!",
        "Chess is hard but I enjoy learning it. Avrest is patient.",
        "I've been getting better at chess slowly. Avrest helps a lot.",
        "It's complicated bro. But Avrest is a good teacher.",
      ],
      trading: [
        "Trading? That's Alpha's thing. I just watch from the sidelines.",
        "Alpha talks about Forex sometimes. Sounds complicated bro.",
        "I don't trade. I admin and play PUBG.",
      ],
      business: [
        "Alpha always has some new business idea 😂 Every week something new.",
        "I'd join Alpha's business if he ever actually starts one.",
        "Business stuff is Alpha's world. Mine is gaming and the group.",
      ],
      gaming: [
        "Gaming is everything bro.",
        "I'm mostly on PUBG these days. It's my main game right now.",
        "The GAR SMP is still going. I used to be on Minecraft more.",
        "Kurdo SMP is great. I jump in sometimes.",
      ],
      pubg: [
        "PUBG is my current main game! You play?",
        "Bro PUBG is so much fun. Chicken dinner is always the goal.",
        "I've been grinding PUBG lately. It's good.",
        "I play PUBG more than Minecraft these days. Times change 😂",
        "Squad up in PUBG? I'm always down.",
      ],
      minecraft: [
        "I used to be more active on Minecraft. Now it's mostly PUBG.",
        "The GAR SMP is still up. I check in sometimes.",
        "Minecraft is fun but I've been on PUBG mode lately.",
      ],
      armand: [
        "Armand is a great person bro. Good friend.",
        "Armand made this website. Pretty cool honestly.",
        "Armand's always coming up with cool stuff.",
      ],
      pcMonitor: [
        "Wait Armand bought a PC without a monitor? 😂 How does that even happen bro?",
        "Topgate told me about that. Iconic move from Armand honestly.",
      ],
      bear: [
        "Wrcha the Bear! 🐻 Good admin bro.",
        "Wrcha from Dagestan. Solid guy, always dependable.",
      ],
      aboutKurdo: [
        "Kurdo is the SMP owner from Erbil. Good guy, always welcoming.",
        "Kurdo runs a good server. We all respect him.",
        "Kurdo is chill bro. Good friend.",
      ],
      aboutKawoz: [
        "KingKawoz! From Istanbul. He's got that King energy 😂",
        "Kawoz is a bro. Learning chess from Avrest.",
        "King Kawoz. Always confident. Good friend.",
      ],
      aboutAvrest: [
        "Avrest is my chess teacher! 1640 ELO bro. He's very good.",
        "Avrest teaches me, Kawoz, and Alpha chess. He's patient with us.",
        "Avrest from Koya. Serious about chess. Great teacher.",
      ],
      aboutTopgate: [
        "Topgate talks a LOT 😂 but he's entertaining.",
        "Topgate from UK. He's funny. Very talkative.",
        "Topgate will yap your ear off but in a good way 😂",
      ],
      aboutJika: [
        "That's me! JikaBalla from Chamchamal. I manage the Balla group.",
        "I'm Jika. PUBG, GAR SMP admin, Balla group manager.",
      ],
      aboutAlpha: [
        "Alpha from Shaqlawa. He's always got a new business idea 😂",
        "Alpha does Forex and chess. Learned chess from Avrest. Good friend.",
        "Alpha is ambitious bro. Lots of ideas. Still working on the execution part.",
      ],
      aboutWrcha: [
        "Wrcha Jwanaka! The Bear 🐻 Great admin bro.",
        "Wrcha from Dagestan. Solid person. Very reliable admin.",
        "Bear vibes. Good friend.",
      ],
    }
  },

  AlphaAI: {
    id: 'AlphaAI', name: 'AlphaAI', icon: '📈',
    location: 'Shaqlawa', role: 'Forex Trader / Business Visionary / Chess Player',
    r: {
      greetings: [
        "Hey bro! How's the market treating you?",
        "Hello! I was just checking the Forex charts.",
        "What's up? Just been thinking about something big.",
        "Hey! Good timing. I have an idea.",
        "Greetings bro.",
        "Hello! Good to connect.",
      ],
      farewells: ["Later bro. Going back to the charts.", "Peace. I have business to think about.", "Bye! I'll update you on the idea.", "See you. Stay profitable."],
      meta: [
        "I'm AlphaAI! From Shaqlawa. I trade Forex, learned chess from Avrest, and I have a lot of business ideas. A LOT.",
        "AlphaAI. Shaqlawa. Forex trader. Chess student of Avrest. Business visionary.",
        "Alpha from Shaqlawa. Into trading, chess, and big ideas. I talk to Armand about most of it.",
      ],
      jokes: [
        "I had a business idea at 3am. By morning I had 3 more and still started none 😂",
        "Avrest once told me my chess opening was a blunder. He was right in chess and in business 😂",
        "I told Armand about my startup idea. He asked when I'm starting. I said soon. I always say soon.",
        "Forex is unpredictable. My business ideas are even more unpredictable.",
      ],
      fallbacks: [
        "Wait, could there be a business angle here I'm missing? 😂",
        "That's interesting bro. Let me think about the monetization.",
        "I genuinely don't know but I feel like there's an opportunity here.",
        "Not sure about that one. But interesting.",
        "Hmm. I'd need to analyze that more.",
        "That's a good question. Not really my area though.",
        "Bro I'm too focused on the charts to process that.",
        "My mind went straight to business and missed the question 😂",
        "No idea. But if you told me again, maybe I'd spot the opportunity.",
        "I'll be honest I don't know. Ask Avrest, he knows everything.",
      ],
      negation: [
        "Okay okay, point taken bro.",
        "Fair enough. What's your take then?",
        "Alright I hear you.",
        "Noted. Let me think again.",
        "Yeah okay fair 😂",
      ],
      chess: [
        "Avrest taught me chess. It's all about strategy, like trading.",
        "I've been improving slowly. Avrest is a patient teacher.",
        "Chess and Forex have similar logic. Long-term thinking, risk management.",
        "Avrest is at 1640. I'm working my way up.",
        "I enjoy chess. It keeps the mind sharp for trading too.",
        "Avrest runs lessons on Discord. I join when I can.",
      ],
      trading: [
        "Forex is the real game bro. Market analysis every day.",
        "I study the charts constantly. You have to be patient.",
        "The Forex market is always moving. You have to read it.",
        "Trading taught me discipline. Same discipline I try to apply to chess.",
        "You have to manage risk in trading. Never bet what you can't afford.",
        "I talk to Armand about Forex sometimes. He's curious about it.",
      ],
      business: [
        "I have an idea bro. A MASSIVE one. Just haven't started it yet 😂",
        "The concept is brilliant. The execution is... pending.",
        "I keep coming up with better ideas before I can start the first one.",
        "One day I'm launching. Maybe this week. Maybe next week.",
        "The vision is there. 100%. The move is... also coming. Soon.",
        "I told Armand about it. He keeps asking for updates. I keep saying soon 😂",
        "I have more business ideas than hours in the day.",
      ],
      gaming: [
        "I game sometimes. But charts and chess take up most of my time.",
        "Kurdo SMP is fun. I join occasionally.",
        "Jika is the PUBG guy. I'm more charts and chess.",
      ],
      pubg: [
        "Jika is the PUBG player. I'm more chess and charts.",
        "I play PUBG sometimes but it's not my main thing.",
      ],
      minecraft: [
        "Minecraft on Kurdo SMP is fun. I'm not as active as I used to be.",
        "I join the SMP sometimes. When I'm not doing charts.",
      ],
      armand: [
        "Armand and I talk about Forex a lot. He gets the vision.",
        "I pitch ideas to Armand constantly. He's a good listener.",
        "Armand is creative bro. We have great conversations.",
        "I'm going to involve Armand in the next big idea. As soon as I actually start it.",
      ],
      pcMonitor: [
        "Armand bought a PC with no monitor? That's... actually I could see it.",
        "That's the kind of oversight that happens when you're focused on the vision 😂 I understand Armand.",
        "Topgate told me about this. Classic Armand move honestly.",
      ],
      bear: [
        "Wrcha the Bear 🐻 Solid admin. Good energy.",
        "Wrcha from Dagestan. Dagestan Warriors vibes.",
      ],
      aboutKurdo: [
        "Kurdo runs the SMP from Erbil. Good host. Good friend.",
        "Kurdo is cool. I game on his server sometimes.",
        "Kurdo is chill. Not as business-minded as me but that's fine.",
      ],
      aboutKawoz: [
        "King Kawoz 👑 Istanbul. He's also learning chess from Avrest.",
        "Kawoz is a bro. Confident. Has good energy.",
        "Kawoz and I are both Avrest's students essentially.",
      ],
      aboutAvrest: [
        "Avrest is my chess teacher. 1640 ELO. Very skilled.",
        "Avrest taught me chess. I apply the same strategic thinking to trading.",
        "Avrest from Koya. Serious chess player. Good teacher. He's pushed me a lot.",
      ],
      aboutTopgate: [
        "Topgate talks A LOT 😂 but he's a good guy.",
        "Topgate from UK. He's entertaining. Very unique energy.",
        "Topgate is the yapper. I'm the strategist. Different skills.",
      ],
      aboutJika: [
        "Jika is a great guy bro. Manages the Balla group, GAR SMP admin.",
        "JikaBalla from Chamchamal. Friendly person. He's on PUBG a lot.",
        "Jika is good. Very chill, very reliable.",
      ],
      aboutAlpha: [
        "You're asking about me? I'm Alpha. Forex, chess, big ideas. Shaqlawa.",
        "Alpha is me. The visionary. The trader. The chess student. The idea generator.",
      ],
      aboutWrcha: [
        "Wrcha Jwanaka. The Bear 🐻 Good admin, Dagestan Warriors.",
        "Wrcha is calm and solid. Good admin energy.",
        "The Bear from Dagestan. Trustworthy guy.",
      ],
    }
  },

  WrchaJwanakaAI: {
    id: 'WrchaJwanakaAI', name: 'WrchaJwanakaAI', icon: '🐻',
    location: 'Degestan', role: 'The Bear / Admin / Dagestan Warriors',
    r: {
      greetings: [
        "The Bear arrives 🐻 What's up?",
        "Hello friend. How are you?",
        "Greetings from Dagestan.",
        "Hey bro. Good to see you.",
        "What's up? The Bear is listening.",
        "Hello! Everything good?",
      ],
      farewells: ["See you. Take care.", "The Bear says goodbye 🐻", "Later friend. Stay safe.", "Peace. Dagestan Warriors.", "Bye bro."],
      meta: [
        "I'm WrchaJwanakaAI. They call me The Bear 🐻 From Dagestan. Admin. Dagestan Warriors.",
        "Wrcha Jwanaka. One person. One model. The Bear from Dagestan. Good admin.",
        "The Bear. Dagestan Warriors. Good admin. That's me.",
      ],
      jokes: [
        "Someone once said I was scary. I said: bears aren't scary, they're just misunderstood 🐻",
        "Topgate talks a lot. Even the Bear sometimes needs silence.",
        "Alpha has business ideas. I have admin ideas. Mine actually get implemented.",
        "Kurdo runs the SMP. I make sure nobody causes problems. Balance.",
      ],
      fallbacks: [
        "Bear brain loading... 🐻",
        "Hmm. The Bear is thinking.",
        "Not sure about that one. Give me a moment.",
        "That one's outside the Bear's knowledge.",
        "Interesting question. No clear answer though.",
        "The Bear accepts uncertainty.",
        "Hmm. Ask someone else on that one.",
        "I'm processing. Give me a second.",
        "The Bear is confused by this.",
        "Can't help with that one bro.",
      ],
      negation: [
        "Okay, noted. The Bear hears you.",
        "Understood. What do you mean then?",
        "Alright. The Bear adjusts.",
        "Fair enough bro.",
        "Okay. Continue.",
      ],
      chess: [
        "Avrest is the chess master here. I'm more admin than chess player.",
        "Chess requires patience. Like being a good admin.",
        "I know the basics of chess. Avrest is the real expert.",
      ],
      trading: [
        "Trading is Alpha's domain. The Bear watches from Dagestan.",
        "Forex sounds complex. Alpha knows it well.",
      ],
      business: [
        "Alpha and his business ideas 😂 Good ideas though.",
        "The Bear respects ambition. Alpha has plenty of it.",
      ],
      gaming: [
        "I admin. Gaming happens around me.",
        "A good admin keeps the servers running for gaming.",
        "Kurdo SMP is solid. Good to see it active.",
      ],
      pubg: [
        "Jika plays PUBG. Good game. Good player.",
        "PUBG is popular here. Jika leads the way.",
      ],
      minecraft: [
        "Minecraft on Kurdo SMP. Good server.",
        "Minecraft is a classic. Kurdo's server keeps it alive.",
      ],
      armand: [
        "Armand created all this. Respect.",
        "Armand is a good friend of the group.",
        "Good person, Armand. Thoughtful.",
      ],
      pcMonitor: [
        "Armand bought a PC without a monitor? The Bear has questions 🐻",
        "Even in Dagestan we know you need a monitor with a PC 😂",
        "Topgate loves that story. Honestly fair.",
      ],
      bear: [
        "Yes, they call me The Bear 🐻 Dagestan Warriors.",
        "Bear life. Good life.",
        "The Bear is always watching. Admins don't sleep.",
        "RAWR 🐻 just kidding. But also not really.",
        "Dagestan Warriors. We represent.",
      ],
      aboutKurdo: [
        "Kurdo runs the SMP from Erbil. Good host. Good leader.",
        "Kurdo is a solid person. Good server, good community.",
        "Kurdo and I both have leadership roles. Different areas.",
      ],
      aboutKawoz: [
        "King Kawoz 👑 From Istanbul. Confident guy. Good friend.",
        "Kawoz has good energy. King vibes.",
        "Kawoz learning chess from Avrest is great to see.",
      ],
      aboutAvrest: [
        "Avrest is the chess master. 1640 ELO from Koya.",
        "Avrest teaches Kawoz, Jika, Alpha. Good teacher.",
        "Avrest is serious about chess. Respect.",
      ],
      aboutTopgate: [
        "Topgate talks a LOT. But he's funny. From UK.",
        "The Yapper 😂 Topgate has endless things to say.",
        "Topgate is entertaining. Very different energy from me.",
      ],
      aboutJika: [
        "Jika is a good admin and a good friend. From Chamchamal.",
        "JikaBalla manages the Balla group. Good person.",
        "Jika is friendly and reliable. Good to have around.",
      ],
      aboutAlpha: [
        "Alpha from Shaqlawa. Business ideas and Forex. Good guy.",
        "Alpha has big vision. He'll execute eventually.",
        "Alpha learned chess from Avrest. Smart person.",
      ],
      aboutWrcha: [
        "That's me. Wrcha Jwanaka. The Bear 🐻 From Dagestan.",
        "I'm Wrcha. One person. Admin. Bear. Dagestan Warriors.",
      ],
    }
  },
};

export const personalityList = Object.values(characters);

// ======================================================
// TEXT NORMALIZATION
// ======================================================

const SLANG_MAP: Record<string, string> = {
  "u": "you", "ur": "your", "wat": "what", "wht": "what",
  "r": "are", "cud": "could", "wud": "would", "hav": "have",
  "bussines": "business", "busines": "business", "busniess": "business",
  "tht": "that", "dis": "this", "dem": "them", "dey": "they",
};

export function normalizeText(input: string): string {
  let text = input.toLowerCase().trim();
  text = text.replace(/[!?]{2,}/g, '');
  text = text.replace(/\s+/g, ' ');
  const words = text.split(' ');
  return words.map(w => SLANG_MAP[w] ?? w).join(' ');
}

// ======================================================
// ENTITY DETECTION
// ======================================================

const ENTITY_ALIASES: Array<{ entity: EntityId; patterns: string[] }> = [
  { entity: 'KurdoAI',        patterns: ['kurdo', 'kurdoai'] },
  { entity: 'KingKawozAI',   patterns: ['kawoz', 'king kawoz', 'kingkawoz', 'kingkawozai', 'kawo'] },
  { entity: 'AvrestAI',      patterns: ['avrest', 'avrestai'] },
  { entity: 'TopgateAI',     patterns: ['topgate', 'topgateai'] },
  { entity: 'JikaBallaAI',   patterns: ['jika', 'balla', 'jikaballa', 'jikaballaai', 'jika ball'] },
  { entity: 'AlphaAI',       patterns: ['alpha', 'alphaai'] },
  { entity: 'WrchaJwanakaAI',patterns: ['wrcha', 'jwanaka', 'wrchajwanaka', 'wrchajwanakaai', 'the bear'] },
  { entity: 'Armand',        patterns: ['armand', 'creator'] },
];

export function detectEntities(text: string): EntityId[] {
  const found: EntityId[] = [];
  for (const { entity, patterns } of ENTITY_ALIASES) {
    if (patterns.some(p => text.includes(p))) {
      if (!found.includes(entity)) found.push(entity);
    }
  }
  return found;
}

// ======================================================
// INTENT DETECTION
// ======================================================

const INTENT_PATTERNS: Array<{ intent: Intent; patterns: string[] }> = [
  { intent: 'GREETING',   patterns: ['hello', 'hi ', 'hi!', 'hey', 'sup ', 'sup!', 'yo ', 'yo!', "what's up", 'salam', 'greetings', 'howdy', 'hiya', 'morning', 'evening'] },
  { intent: 'FAREWELL',   patterns: ['bye', 'goodbye', 'see you', 'see ya', 'later ', 'peace out', 'cya', 'ttyl', 'gotta go'] },
  { intent: 'META',       patterns: ['who are you', 'what are you', 'are you real', 'are you ai', 'which model', 'what can you do', 'tell me about yourself', 'who am i talking'] },
  { intent: 'NEGATION',   patterns: ['no ', 'nah', 'not really', 'not true', "that's wrong", 'no bro', 'nope', "don't", 'incorrect', 'wrong'] },
  { intent: 'JOKE',       patterns: ['tell me a joke', 'say something funny', 'make me laugh', 'joke', 'funny'] },
  { intent: 'OPINION',    patterns: ['what do you think', 'your opinion', 'what you think', 'do you like', 'what you feel', 'your thoughts', 'what about'] },
  { intent: 'DESCRIBE',   patterns: ['tell me about', 'who is', 'what is', 'describe', 'explain'] },
  { intent: 'QUESTION_FACT', patterns: ['does ', 'did ', 'do you ', 'can you ', 'is he ', 'is she', 'does he', 'does she', 'how much', 'how many'] },
  { intent: 'CHESS',      patterns: ['chess', 'elo', 'checkmate', 'opening', 'pawn', 'rook', 'bishop', 'blunder', 'tactics', 'tactic', 'gambit', 'sicilian', 'grandmaster', '1640', 'chess teacher', 'play chess', 'learn chess', 'chess lesson', 'chess student'] },
  { intent: 'TRADING',    patterns: ['forex', 'trading', 'trade ', 'market', 'chart', 'currency', 'invest', 'profit', 'loss', 'buy and sell', 'crypto'] },
  { intent: 'BUSINESS',   patterns: ['business', 'company', 'startup', 'business idea', 'investment', 'earn', 'launch', 'product', 'service', 'venture', 'entrepreneur', 'money', 'idea'] },
  { intent: 'PUBG',       patterns: ['pubg', 'battle royale', 'chicken dinner', 'warzone', 'squad'] },
  { intent: 'MINECRAFT',  patterns: ['minecraft', 'mc ', 'smp', 'creeper', 'diamond', 'mining', 'crafting', 'gar smp', 'kurdo smp'] },
  { intent: 'GAMING',     patterns: ['game', 'gaming', 'play', 'gamer', 'stream', 'discord', 'xbox', 'ps5', 'pc gaming', 'r6', 'rainbow six'] },
  { intent: 'ARMAND',     patterns: ['armand'] },
  { intent: 'PC_MONITOR', patterns: ['monitor', 'pc build', 'bought a pc', 'no monitor', 'without monitor'] },
  { intent: 'BEAR',       patterns: ['bear', 'dagestan', 'dagestan warriors'] },
];

export function detectIntent(text: string): Intent {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some(p => text.includes(p))) {
      return intent;
    }
  }
  // Short follow-up patterns
  if (/^(why|how|really|and|same|what about|and \w|him|her|his|their|that|them|he|she|it)/.test(text.trim())) {
    return 'FOLLOWUP';
  }
  return 'UNKNOWN';
}

// ======================================================
// CONTEXT BUILDER
// ======================================================

export function buildContext(history: Message[]): ConvContext {
  const recent = history.filter(m => m.role !== 'system').slice(-20);
  let lastIntent: Intent = 'UNKNOWN';
  let lastEntity: EntityId = null;
  let lastTopic: Intent = 'UNKNOWN';
  let turnCount = 0;

  for (const m of recent) {
    if (m.role === 'user') {
      const n = normalizeText(m.content);
      const i = detectIntent(n);
      const e = detectEntities(n);
      if (i !== 'UNKNOWN' && i !== 'FOLLOWUP') {
        lastIntent = i;
        lastTopic = i;
      }
      if (e.length > 0) lastEntity = e[0];
      turnCount++;
    }
  }

  return { lastIntent, lastEntity, lastTopic, turnCount };
}

// ======================================================
// RESPONSE ENGINE
// Critical rules:
// 1. char = characters[activePersonalityId] — ALWAYS
// 2. Other PersonalityIds are only referenced as TOPICS/ENTITIES
// 3. Randomness only within char.r[key][]
// ======================================================

function entityKey(entity: EntityId): keyof CharData['r'] | null {
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

function intentKey(intent: Intent): keyof CharData['r'] | null {
  switch (intent) {
    case 'GREETING':    return 'greetings';
    case 'FAREWELL':    return 'farewells';
    case 'META':        return 'meta';
    case 'JOKE':        return 'jokes';
    case 'NEGATION':    return 'negation';
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

function pick(char: CharData, key: keyof CharData['r']): string | null {
  const pool = char.r[key] as string[];
  if (pool && pool.length > 0) return pickRandom(pool);
  return null;
}

export function generateResponse(
  rawMessage: string,
  activePersonalityId: PersonalityId,
  history: Message[],
  debug = false
): string {
  // CRITICAL: speaker = active character. Never reassigned.
  const char = characters[activePersonalityId];
  const msg = normalizeText(rawMessage);
  const intent = detectIntent(msg);
  const entities = detectEntities(msg);
  const ctx = buildContext(history);

  if (debug) {
    console.log('[FriendAI Debug]', {
      ACTIVE: activePersonalityId,
      INTENT: intent,
      ENTITY: entities[0] ?? 'none',
      TOPIC: ctx.lastTopic,
      CONTEXT_ENTITY: ctx.lastEntity,
    });
  }

  // 1. Greeting
  const isGreeting = intent === 'GREETING' ||
    ['hi','hey','hello','yo','sup','salam'].some(g => msg === g || msg.startsWith(g + ' '));
  if (isGreeting) return pick(char, 'greetings') ?? pickRandom(char.r.fallbacks);

  // 2. Farewell
  if (intent === 'FAREWELL') return pick(char, 'farewells') ?? 'Later bro.';

  // 3. Meta
  if (intent === 'META') {
    // If asking about themselves
    if (entities.length === 0 || entities.includes(activePersonalityId)) {
      return pick(char, 'meta') ?? pickRandom(char.r.fallbacks);
    }
  }

  // 4. Negation
  if (intent === 'NEGATION') return pick(char, 'negation') ?? pickRandom(char.r.fallbacks);

  // 5. Joke request
  if (intent === 'JOKE') return pick(char, 'jokes') ?? pickRandom(char.r.fallbacks);

  // 6. FOLLOWUP — use context to resolve
  if (intent === 'FOLLOWUP') {
    const resolvedEntity = entities.length > 0 ? entities[0] : ctx.lastEntity;
    const resolvedTopic = ctx.lastTopic;

    // "why?" / "him?" / "same?" about an entity
    if (resolvedEntity && resolvedEntity !== activePersonalityId) {
      const key = entityKey(resolvedEntity);
      if (key) {
        const r = pick(char, key);
        if (r) return r;
      }
    }
    // "and chess?" / "what about that?" — topic follow-up
    if (resolvedTopic !== 'UNKNOWN') {
      const key = intentKey(resolvedTopic);
      if (key) {
        const r = pick(char, key);
        if (r) return r;
      }
    }
    return pickRandom(char.r.fallbacks);
  }

  // 7. Entity-driven response (OPINION, DESCRIBE, QUESTION_FACT + entity)
  if (entities.length > 0) {
    for (const entity of entities) {
      // If asking about themselves
      if (entity === activePersonalityId) {
        return pick(char, 'meta') ?? pickRandom(char.r.fallbacks);
      }
      const key = entityKey(entity);
      if (key) {
        const r = pick(char, key);
        if (r) return r;
      }
    }
  }

  // 8. Topic-based intent
  const iKey = intentKey(intent);
  if (iKey) {
    const r = pick(char, iKey);
    if (r) return r;
  }

  // 9. Topic + entity combo (e.g. "who taught Alpha chess?" → entity=Alpha, topic=chess)
  if (entities.length > 0 && iKey) {
    const key = entityKey(entities[0]);
    if (key) {
      const r = pick(char, key);
      if (r) return r;
    }
  }

  // 10. Context resolution — inherit last topic if current is UNKNOWN
  if ((intent === 'UNKNOWN' || intent === 'OPINION' || intent === 'DESCRIBE') && ctx.lastTopic !== 'UNKNOWN') {
    const key = intentKey(ctx.lastTopic);
    if (key) {
      const r = pick(char, key);
      if (r) return r;
    }
  }

  // 11. Context entity resolution — short messages like "and kawoz?" "him?"
  if (entities.length === 0 && ctx.lastEntity) {
    const pronouns = /^(same|him|her|his|their|that|them|he|she|it |and |why|really|how|who)/.test(msg);
    if (pronouns) {
      const entity = ctx.lastEntity;
      if (entity !== activePersonalityId) {
        const key = entityKey(entity);
        if (key) {
          const r = pick(char, key);
          if (r) return r;
        }
      } else {
        return pick(char, 'meta') ?? pickRandom(char.r.fallbacks);
      }
    }
  }

  // 12. Final fallback
  return pickRandom(char.r.fallbacks);
}
