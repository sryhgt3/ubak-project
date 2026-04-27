import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Zap, Activity, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}

// Typewriter effect component for the streaming message
const TypewriterMessage: React.FC<{ text: string, onComplete: () => void, speed?: number }> = ({ text, onComplete, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span>{displayedText}<span className="animate-pulse opacity-50 ml-0.5">▋</span></span>;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatbot_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all loaded messages are fully streamed
        const cleanMessages = parsed.map((m: ChatMessage) => ({ ...m, isStreaming: false }));
        setMessages(cleanMessages);
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    } else {
      // Initial greeting
      setMessages([{
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Hi there! How can I help you today?',
        timestamp: Date.now(),
        isStreaming: true
      }]);
    }
  }, []);

  // Save history whenever it changes, but only if no message is currently streaming
  useEffect(() => {
    const hasStreaming = messages.some(m => m.isStreaming);
    if (!hasStreaming && messages.length > 0) {
      localStorage.setItem('chatbot_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping || messages.some(m => m.isStreaming)) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: Date.now(),
      isStreaming: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock bot response delay (simulating network request)
    setTimeout(() => {
      setIsTyping(false);
      
      // Determine response based on input
      let botResponseText = `You said: "${userMessage.text}". I am processing your request. I am a simple bot right now.`;
      
      const lowerInput = userMessage.text.toLowerCase();
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
         botResponseText = "Hello! I am your automated financial assistant. How can I optimize your wealth matrix today?";
      } else if (lowerInput.includes('balance') || lowerInput.includes('money')) {
         botResponseText = "To view your total balance and cash flow, please navigate to the main Dashboard. Your Total Balance is updated in real-time.";
      } else if (lowerInput.includes('transaction') || lowerInput.includes('expense')) {
         botResponseText = "You can add a new transaction using the 'Add Transaction' button in the sidebar or via the quick action on the dashboard.";
      } else if (botResponseText.length < 50) {
         // Create a longer response to show off the typewriter effect
         botResponseText = `I have received your input: "${userMessage.text}". Analyzing financial parameters... Cross-referencing data points... The operation has been logged into the temporary buffer. Please stand by for further instructions or provide a more specific query regarding your accounts or transactions.`;
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
        timestamp: Date.now() + 1,
        isStreaming: true // Mark as streaming so TypewriterMessage handles it
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1500); // 1.5s simulated network delay
  };

  const handleStreamingComplete = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isStreaming: false } : msg
    ));
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-96 h-full sm:h-[500px] sm:max-h-[80vh] bg-[#0a0a0a] sm:rounded-[2rem] shadow-2xl flex flex-col z-[10000] border-t sm:border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-3xl">
          {/* Header */}
          <div className="bg-white/5 border-b border-white/5 p-5 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none"></div>
            <div className="font-black text-xs flex items-center gap-3 text-white uppercase tracking-widest relative z-10">
              <div className="w-8 h-8 bg-cyan-500/10 text-cyan-400 rounded-lg flex items-center justify-center border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <Activity size={16} />
              </div>
              Support Chat
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white relative z-10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#030303]/50 scroll-smooth">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 text-[11px] md:text-xs font-bold leading-relaxed shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-cyan-400 to-violet-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                      : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/10'
                  }`}
                >
                  {msg.sender === 'bot' && msg.isStreaming ? (
                    <TypewriterMessage 
                      text={msg.text} 
                      onComplete={() => handleStreamingComplete(msg.id)} 
                      speed={35} // Configurable speed (ms per char)
                    />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isTyping && (
               <div className="flex justify-start animate-in fade-in">
                 <div className="bg-white/5 text-cyan-400 rounded-2xl rounded-tl-none border border-white/10 p-4 shadow-lg flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Processing...</span>
                 </div>
               </div>
            )}
            
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white/5 border-t border-white/5">
            <div className="flex gap-3">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping || messages.some(m => m.isStreaming)}
                placeholder="TYPE A MESSAGE..."
                className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-5 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all uppercase tracking-widest placeholder:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || messages.some(m => m.isStreaming)}
                className="bg-white text-black p-3 rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-400 to-violet-600 text-white rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center active:scale-95 transition-all z-[10000] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group"
          aria-label="Open chat"
        >
           <Zap size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
        </button>
      )}
    </>
  );
};

export default Chatbot;
