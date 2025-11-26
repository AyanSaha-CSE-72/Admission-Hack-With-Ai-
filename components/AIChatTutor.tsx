import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateAIResponse } from '../services/geminiService';

const AIChatTutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'নমস্কার! আমি তোমার এআই টিউটর। পদার্থবিজ্ঞান, রসায়ন বা গণিত নিয়ে কোনো প্রশ্ন থাকলে আমাকে করতে পারো।',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateAIResponse(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Handle error gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "ভেক্টর ও স্কেলার রাশির পার্থক্য কী?",
    "Organic Chemistry পড়ার সহজ উপায়?",
    "নিউটনের ৩য় সূত্র ব্যাখ্যা করো"
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-primary-50 dark:bg-gray-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-purple-600 flex items-center justify-center text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white">AI শিক্ষা সহকারী</h3>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`
                flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2
                ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary-100 dark:bg-primary-900'}
              `}>
                {msg.role === 'user' ? <User className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <Sparkles className="h-5 w-5 text-primary-600" />}
              </div>
              
              <div className={`
                p-3 rounded-2xl shadow-sm font-bangla text-sm md:text-base leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}
              `}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="ml-12 bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {messages.length < 3 && (
          <div className="flex overflow-x-auto gap-2 mb-3 pb-2 no-scrollbar">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="আপনার প্রশ্ন এখানে লিখুন..."
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-bangla"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatTutor;