'use client';

import { useState, useRef, useEffect } from 'react';
import { personalityList, personalities, PersonalityId, Message, generateResponse } from '@/lib/engine';
import { Send, Trash2, Bot, User } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activePersonality, setActivePersonality] = useState<PersonalityId>('KurdoAI');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('friendai-messages');
    const savedPersonality = localStorage.getItem('friendai-personality');
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
    
    if (savedPersonality && personalities[savedPersonality as PersonalityId]) {
      setActivePersonality(savedPersonality as PersonalityId);
    }
  }, []);

  // Save to local storage
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
    const p = personalities[id];
    
    // Add system message
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'system',
        content: `Switched to ${p.name}`
      }
    ]);
  };

  const handleClearChat = () => {
    if (confirm("Clear this conversation?")) {
      setMessages([]);
      localStorage.removeItem('friendai-messages');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Typing Delay Simulator
    const currentPersonality = personalities[activePersonality];
    
    // Yappers take longer to type
    let typingDelay = Math.floor(Math.random() * 1000) + 600; // 600ms - 1600ms
    if (activePersonality === 'TopgateAI') {
      typingDelay += 800; // Yapper penalty
    }

    setTimeout(() => {
      // Pass the updated messages history to the engine (including the new user message)
      const currentHistory = [...messages, userMessage];
      const replyContent = generateResponse(userMessage.content, activePersonality, currentHistory);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  const currentPersonality = personalities[activePersonality];

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-slate-50 font-sans">
      <div className="w-full max-w-4xl p-4 flex flex-col h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between py-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🤖</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Friend AI
            </h1>
          </div>
          <button 
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={20} />
          </button>
        </header>

        {/* Personality Selector */}
        <div className="py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {personalityList.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePersonalityChange(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activePersonality === p.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{p.icon}</span>
                <span className="font-medium text-sm">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center py-2 text-xs text-slate-400 border-b border-slate-800/50 mb-4">
          Currently chatting with <span className="ml-1 font-semibold text-blue-400 flex items-center gap-1">{currentPersonality.icon} {currentPersonality.name}</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="text-6xl">{currentPersonality.icon}</div>
              <p>Send a message to start chatting with {currentPersonality.name}!</p>
              <p className="text-xs max-w-xs text-center text-slate-600">
                Remember: {currentPersonality.role}
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : m.role === 'system' ? 'justify-center' : 'justify-start'}`}>
                {m.role === 'system' ? (
                  <div className="bg-slate-800/60 text-slate-400 text-xs px-4 py-1.5 rounded-full border border-slate-700/50">
                    {m.content}
                  </div>
                ) : (
                  <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700">
                      {m.role === 'user' ? <User size={16} className="text-blue-400" /> : <span>{currentPersonality.icon}</span>}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700">
                  <span>{currentPersonality.icon}</span>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-400 rounded-tl-sm border border-slate-700 flex items-center gap-1">
                  <span className="text-xs">{currentPersonality.name} is typing</span>
                  <span className="flex gap-0.5 ml-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative mt-auto">
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 text-slate-100"
            value={input}
            placeholder={`Message ${currentPersonality.name}...`}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-lg transition-colors text-white"
          >
            <Send size={18} />
          </button>
        </form>
        
        <div className="text-center mt-3 text-xs text-slate-600">
          FriendAI Offline Engine | No APIs Used
        </div>
      </div>
    </main>
  );
}
