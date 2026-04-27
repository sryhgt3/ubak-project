import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatbot_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    } else {
      // Initial greeting
      setMessages([{
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Hi there! How can I help you today?',
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem('chatbot_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Mock bot response
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `You said: "${userMessage.text}". I'm a simple bot right now!`,
        timestamp: Date.now() + 1
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-xl shadow-xl flex flex-col z-[10000] border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-4 flex justify-between items-center">
            <div className="font-semibold text-base flex items-center gap-2">
              <MessageCircle size={20} />
              Support Chat
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-xl p-3 text-sm font-medium ${
                    msg.sender === 'user' 
                      ? 'bg-rose-500 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-2">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-rose-500 text-white rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-all z-[10000]"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default Chatbot;
