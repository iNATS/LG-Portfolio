import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { GlassPane } from './GlassPane';
import { generateResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am the AI assistant for this portfolio. Ask me anything about Alex\'s work or skills.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const replyText = await generateResponse(input);
    const modelMsg: ChatMessage = { role: 'model', text: replyText, timestamp: Date.now() };
    
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {isOpen && (
        <GlassPane className="w-[360px] h-[600px] flex flex-col !rounded-[32px] overflow-hidden animate-[float_6s_ease-in-out_infinite_reverse]" darker>
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg">
                 <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm block leading-tight">Vision Assistant</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Powered by Gemini</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-white text-black rounded-br-sm' 
                      : 'bg-white/10 text-white rounded-bl-sm border border-white/5 backdrop-blur-md'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-2 bg-white/10 rounded-[20px] px-2 py-2 border border-white/10 focus-within:bg-white/20 focus-within:border-white/30 transition-all shadow-inner">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything..."
                className="bg-transparent border-none outline-none text-[15px] w-full text-white placeholder-white/40 px-3"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-full bg-white text-black hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg"
              >
                <Send size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </GlassPane>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-center w-16 h-16 rounded-full 
          backdrop-blur-2xl border border-white/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
          transition-all duration-500 hover:scale-110 hover:border-white/40
          ${isOpen ? 'bg-white text-black rotate-90' : 'bg-white/10 text-white hover:bg-white/20'}
        `}
      >
        {isOpen ? <X size={28} /> : <Bot size={32} strokeWidth={1.5} />}
      </button>
    </div>
  );
};