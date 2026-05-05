import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Zap, Activity, Loader2, Cpu, BrainCircuit, History, Plus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface ChatSession {
    id: number;
    title: string;
    created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800';

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
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('chatbot_isOpen');
    return saved ? JSON.parse(saved) : false;
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [provider] = useState<'openai' | 'gemini'>('gemini');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();

  // Load initial state or history sessions
  useEffect(() => {
    if (isOpen && token && user?.role === 'VIP') {
        fetchSessions();
    }
  }, [isOpen, token, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist isOpen state
  useEffect(() => {
    localStorage.setItem('chatbot_isOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const fetchSessions = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/chat/sessions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSessions(response.data);
    } catch (error) {
        console.error("Failed to fetch chat sessions", error);
    }
  };

  const loadSession = async (sessionId: number) => {
    setIsTyping(true);
    setCurrentSessionId(sessionId);
    setShowHistory(false);
    try {
        const response = await axios.get(`${API_URL}/api/chat/sessions/${sessionId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const mapped = response.data.map((m: any) => ({
            id: m.id.toString(),
            sender: m.role.toLowerCase() === 'user' ? 'user' : 'bot',
            text: m.content,
            timestamp: new Date(m.timestamp).getTime(),
            isStreaming: false
        }));
        setMessages(mapped);
    } catch (error) {
        console.error("Failed to load session messages", error);
        toast.error("Failed to load conversation history.");
    } finally {
        setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([{
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Hi there! I am your UBAK assistant. How can I help you with your finances today?',
        timestamp: Date.now(),
        isStreaming: true
    }]);
    setShowHistory(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping || messages.some(m => m.isStreaming)) return;

    if (user && user.role !== 'VIP') {
      toast.error('This feature is for VIP users only.');
      return;
    }

    const userMsgText = inputValue.trim();
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: Date.now(),
      isStreaming: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
        const history = messages.slice(-10).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        }));

        const response = await axios.post(`${API_URL}/api/chat/`, {
            message: userMsgText,
            history: history,
            provider: provider,
            session_id: currentSessionId
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const botResponseText = response.data.response;
        const newSessionId = response.data.session_id;

        if (!currentSessionId && newSessionId) {
            setCurrentSessionId(newSessionId);
            fetchSessions(); // Refresh session list
        }

        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: botResponseText,
            timestamp: Date.now() + 1,
            isStreaming: true
        };

        setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
        console.error("Chatbot API Error:", error);
        setIsTyping(false);
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
            timestamp: Date.now() + 1,
            isStreaming: false
        };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
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
        <div className="fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-full sm:h-[550px] sm:max-h-[85vh] bg-white dark:bg-[#0a0a0a] sm:rounded-[2.5rem] shadow-2xl flex flex-col z-[10000] border-t sm:border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-3xl">
          {/* Header */}
          <div className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-4 flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 dark:bg-cyan-500/10 blur-2xl rounded-full pointer-events-none"></div>
            <div className="flex flex-col gap-1 relative z-10">
                <div className="font-black text-[10px] flex items-center gap-2 text-slate-900 dark:text-white uppercase tracking-widest">
                <div className="w-6 h-6 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-lg flex items-center justify-center border border-cyan-500/20">
                    <Activity size={12} />
                </div>
                UBAK AI
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-1.5 rounded-lg transition-all ${showHistory ? 'bg-cyan-500 text-white' : 'bg-slate-200/50 dark:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                        title="History"
                    >
                        <History size={14} />
                    </button>
                    
                    <div className="flex bg-slate-200/50 dark:bg-white/5 p-0.5 rounded-lg border border-slate-300/50 dark:border-white/10 w-fit">
                        <button 
                            disabled
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all opacity-40 cursor-not-allowed`}
                        >
                            <BrainCircuit size={10} /> OpenAI
                        </button>
                        <button 
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all bg-white dark:bg-white/10 text-violet-600 dark:text-violet-400 shadow-sm`}
                        >
                            <Cpu size={10} /> Gemini
                        </button>
                    </div>
                </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white relative z-10 self-start"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 relative overflow-hidden flex flex-col">
            {/* History Sidebar/Overlay */}
            {showHistory && (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl animate-in slide-in-from-left duration-300 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">CONVERSATIONS</h3>
                        <button onClick={startNewChat} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20">
                            <Plus size={12} /> NEW CHAT
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                        {sessions.length > 0 ? sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => loadSession(session.id)}
                                className={`w-full text-left p-4 rounded-2xl border transition-all text-[11px] font-bold uppercase tracking-tight group ${currentSessionId === session.id ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-600 dark:text-cyan-400' : 'bg-slate-50 dark:bg-white/5 border-transparent text-slate-500 hover:border-slate-200 dark:hover:border-white/10 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <p className="truncate mb-1">{session.title}</p>
                                <p className="text-[8px] opacity-50 tracking-widest">
                                    {new Date(session.created_at).toLocaleDateString()}
                                </p>
                            </button>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                                <History size={32} />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No history yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 dark:bg-[#030303]/50 scroll-smooth">
                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                    className={`max-w-[85%] rounded-2xl p-4 text-[11px] md:text-xs font-bold leading-relaxed shadow-sm dark:shadow-lg ${
                        msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-cyan-600 to-violet-600 dark:from-cyan-400 dark:to-violet-600 text-white rounded-tr-none shadow-md dark:shadow-[0_0_20px_rgba(34,211,238,0.1)]' 
                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-tl-none border border-slate-200 dark:border-white/10'
                    }`}
                    >
                    {msg.sender === 'bot' && msg.isStreaming ? (
                        <TypewriterMessage 
                        text={msg.text} 
                        onComplete={() => handleStreamingComplete(msg.id)} 
                        speed={35} 
                        />
                    ) : (
                        msg.text
                    )}
                    </div>
                </div>
                ))}
                
                {isTyping && (
                <div className="flex justify-start animate-in fade-in">
                    <div className="bg-white dark:bg-white/5 text-cyan-600 dark:text-cyan-400 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/10 p-4 shadow-sm dark:shadow-lg flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            AI is thinking...
                        </span>
                    </div>
                </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-5 bg-white dark:bg-white/5 border-t border-slate-100 dark:border-white/5 shrink-0">
            <div className="flex gap-3">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping || messages.some(m => m.isStreaming)}
                placeholder="TYPE A MESSAGE..."
                className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl px-5 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all uppercase tracking-widest placeholder:text-slate-400 dark:placeholder:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || messages.some(m => m.isStreaming)}
                className={`p-3 rounded-xl hover:scale-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-lg bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && user?.setup_completed && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-400 to-violet-600 text-white rounded-2xl shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center active:scale-95 transition-all z-[10000] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group"
          aria-label="Open chat"
        >
           <Zap size={24} fill="currentColor" className="group-hover:scale-110 transition-transform" />
        </button>
      )}
    </>
  );
};

export default Chatbot;
