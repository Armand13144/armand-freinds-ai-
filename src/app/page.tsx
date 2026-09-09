'use client';

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { personalityList, personalities, PersonalityId } from '@/lib/personalities';
import { Send, Trash2, Bot, User } from 'lucide-react';

export default function Chat() {
  const [activePersonality, setActivePersonality] = useState<PersonalityId>('KurdoAI');
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: {
      personalityId: activePersonality,
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSwitchModel = (id: PersonalityId) => {
    if (id === activePersonality) return;
    
    setActivePersonality(id);
    const newPersonality = personalities[id];
    
    // Inject a system message into the chat UI
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        role: 'system',
        content: `Switched to ${newPersonality.name}`
      }
    ]);
    
    // Focus input after switching
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const activeModel = personalities[activePersonality];

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header & Model Selector */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🤖</span> Friend AI
            </h1>
            <button 
              onClick={clearChat}
              className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-gray-800"
              title="Clear Chat"
            >
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center pb-2">
            {personalityList.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSwitchModel(p.id)}
                className={\`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  \${activePersonality === p.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                \`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className="hidden sm:inline">{p.name}</span>
                <span className="inline sm:hidden">{p.name.replace('AI', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Model Indicator */}
      <div className="bg-gray-800/50 py-2 px-4 text-center border-b border-gray-800 shadow-sm">
        <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
          Currently chatting with <span className="font-semibold text-blue-400">{activeModel.icon} {activeModel.name}</span>
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-gray-500 gap-4">
              <div className="text-5xl">{activeModel.icon}</div>
              <p className="text-lg">Say hi to {activeModel.name}!</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={\`flex \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                {m.role === 'system' ? (
                  <div className="w-full flex justify-center my-2">
                    <div className="bg-gray-800/80 text-gray-400 text-xs px-4 py-1.5 rounded-full border border-gray-700 shadow-sm backdrop-blur-sm">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div className={\`flex max-w-[85%] sm:max-w-[75%] gap-3 \${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}\`}>
                    <div className={\`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm
                      \${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}
                    \`}>
                      {m.role === 'user' ? <User size={16} /> : activeModel.icon}
                    </div>
                    <div className={\`px-4 py-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm
                      \${m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
                      }
                    \`}>
                      {m.content}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] sm:max-w-[75%] gap-3 flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm bg-gray-700 text-gray-200">
                  {activeModel.icon}
                </div>
                <div className="px-5 py-4 rounded-2xl bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700 flex items-center gap-1 shadow-sm">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700 placeholder-gray-400 shadow-sm"
            value={input}
            onChange={handleInputChange}
            placeholder={\`Message \${activeModel.name}...\`}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center"
          >
            <Send size={20} className={input.trim() ? "translate-x-0.5" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
