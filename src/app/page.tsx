'use client';

import { useState, useRef, useEffect } from 'react';
import { personalityList, characters, PersonalityId, Message, generateResponse, buildContext } from '@/lib/engine';
import { Send, Trash2, User } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activePersonality, setActivePersonality] = useState<PersonalityId>('KurdoAI');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('friendai-messages');
      const savedPersonality = localStorage.getItem('friendai-personality');
      if (savedMessages) setMessages(JSON.parse(savedMessages));
      if (savedPersonality && characters[savedPersonality as PersonalityId]) {
        setActivePersonality(savedPersonality as PersonalityId);
      }
    } catch (e) {
      console.error('Failed to restore session');
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('friendai-messages', JSON.stringify(messages));
    localStorage.setItem('friendai-personality', activePersonality);
  }, [messages, activePersonality]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handlePersonalityChange = (id: PersonalityId) => {
    if (id === activePersonality) return;
    setActivePersonality(id);
    const p = characters[id];
    const switchMsg: Message = {
      id: `switch-${Date.now()}`,
      role: 'system',
      content: `Switched to ${p.icon} ${p.name}`,
    };
    setMessages(prev => [...prev, switchMsg]);
  };

  const handleClearChat = () => {
    if (confirm('Clear this conversation?')) {
      setMessages([]);
      localStorage.removeItem('friendai-messages');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    // Typing delay: TopgateAI is a yapper so takes longer
    const delay = activePersonality === 'TopgateAI'
      ? 900 + Math.random() * 900
      : 500 + Math.random() * 800;

    setTimeout(() => {
      // generateResponse always reads from characters[activePersonality]
      // It logs debug info to console if 3rd arg debug=true
      const replyContent = generateResponse(userMessage.content, activePersonality, currentMessages, true);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        speaker: activePersonality,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };

  const currentChar = characters[activePersonality];

  // When showing a bot message, use the speaker at the time it was sent
  const getSpeakerChar = (msg: Message) => {
    if (msg.speaker && characters[msg.speaker]) return characters[msg.speaker];
    return currentChar;
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-slate-50 font-sans">
      <div className="w-full max-w-4xl p-4 flex flex-col h-screen">
        
        {/* Under-update banner */}
        <div className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-4 py-2.5 rounded-lg mb-3">
          <span className="animate-pulse">🔧</span>
          <span>AI engine is currently being upgraded — responses may vary. Updates coming soon!</span>
          <span className="animate-pulse">🔧</span>
        </div>

        {/* Header */}
        <header className="flex items-center justify-between py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Friend AI
            </h1>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">No API</span>
          </div>
          <button
            onClick={handleClearChat}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </header>

        {/* Personality Selector */}
        <div className="py-4 border-b border-slate-800/50">
          <div className="flex flex-wrap gap-2 justify-center">
            {personalityList.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePersonalityChange(p.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activePersonality === p.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active model indicator */}
        <div className="flex items-center justify-center py-2 text-xs text-slate-500 mb-3">
          Chatting with&nbsp;
          <span className="font-semibold text-blue-400 flex items-center gap-1 ml-1">
            {currentChar.icon} {currentChar.name}
          </span>
          <span className="ml-2 text-slate-600">· {currentChar.location}</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-1">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
              <div className="text-6xl">{currentChar.icon}</div>
              <p className="text-sm">Start chatting with <span className="text-blue-400">{currentChar.name}</span></p>
              <p className="text-xs text-slate-700 max-w-xs text-center">{currentChar.role}</p>
            </div>
          ) : (
            messages.map((m) => {
              if (m.role === 'system') {
                return (
                  <div key={m.id} className="flex justify-center">
                    <div className="bg-slate-800/50 text-slate-400 text-xs px-4 py-1.5 rounded-full border border-slate-700/40">
                      {m.content}
                    </div>
                  </div>
                );
              }

              const isUser = m.role === 'user';
              const speakerChar = isUser ? null : getSpeakerChar(m);

              return (
                <div key={m.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-sm">
                    {isUser ? <User size={14} className="text-blue-400" /> : <span>{speakerChar?.icon}</span>}
                  </div>

                  <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Speaker name for assistant */}
                    {!isUser && speakerChar && (
                      <span className="text-xs text-slate-500 px-1">{speakerChar.name}</span>
                    )}
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/60'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 flex-row">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-sm">
                <span>{currentChar.icon}</span>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <span className="text-xs text-slate-500 px-1">{currentChar.name}</span>
                <div className="px-4 py-3 rounded-2xl bg-slate-800 rounded-tl-sm border border-slate-700/60 flex items-center gap-2">
                  <span className="text-xs text-slate-400">typing</span>
                  <span className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <span
                        key={d}
                        className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative mt-auto">
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-100 text-sm"
            value={input}
            placeholder={`Message ${currentChar.name}...`}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg transition-colors text-white"
          >
            <Send size={16} />
          </button>
        </form>

        <p className="text-center mt-2 text-xs text-slate-700">
          FriendAI · Offline Engine · No APIs · Open DevTools console for debug info
        </p>
      </div>
    </main>
  );
}
