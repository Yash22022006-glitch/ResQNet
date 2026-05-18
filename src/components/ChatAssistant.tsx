import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Camera, 
  Mic, 
  AlertCircle,
  ChevronDown,
  Languages
} from 'lucide-react';
import { cn } from '../lib/utils';
import { generateSurvivalGuidance } from '../lib/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello, I am RESQNET AI. I am here to provide survival guidance and emergency assistance. What is your current situation?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateSurvivalGuidance(input, `Language: ${language}`);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't generate a response. Please stay safe.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      showFeedback("Connection error. Using offline cache.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full hardware-panel relative">
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-warning text-black text-[10px] font-bold rounded-full shadow-lg"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hardware-header">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emergency/20 rounded">
            <Bot className="w-4 h-4 text-emergency" />
          </div>
          <div>
            <span className="lcd-text">Gemma 4 Assistant</span>
            <div className="flex items-center gap-1">
              <div className="status-dot status-dot-active w-1.5 h-1.5" />
              <span className="text-[8px] opacity-50 uppercase tracking-tighter">Ready for inference</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const nextLang = language === 'English' ? 'Tamil' : language === 'Tamil' ? 'Hindi' : 'English';
              setLanguage(nextLang);
              showFeedback(`Language set to ${nextLang}`);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Languages className="w-3 h-3 text-white/50" />
            <span className="text-[10px] font-mono">{language}</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2 lg:gap-3 max-w-[92%] lg:max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-7 h-7 lg:w-8 lg:h-8 rounded flex items-center justify-center shrink-0",
                msg.role === 'assistant' ? "bg-emergency/20 text-emergency" : "bg-white/10 text-white/70"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> : <User className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
              </div>
              <div className={cn(
                "p-2.5 lg:p-3 rounded-lg text-xs lg:text-sm leading-relaxed",
                msg.role === 'assistant' 
                  ? "bg-white/5 border border-white/10 text-white/90" 
                  : "bg-emergency text-white font-medium shadow-lg"
              )}>
                {msg.content}
                <div className={cn(
                  "text-[7px] lg:text-[8px] mt-1.5 lg:mt-2 opacity-40 font-mono",
                  msg.role === 'user' ? "text-right" : ""
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded bg-emergency/20 text-emergency flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
              <span className="lcd-text animate-pulse">Analyzing situation...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 lg:p-4 border-t border-hardware-line bg-black/20">
        <div className="flex items-center gap-2 mb-2 lg:mb-3">
          <button 
            onClick={() => showFeedback('Camera restricted in Edge mode')}
            className="p-1.5 lg:p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <Camera className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <button 
            onClick={() => showFeedback('Mic restricted in Edge mode')}
            className="p-1.5 lg:p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <Mic className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
          <div className="h-4 w-px bg-hardware-line mx-0.5 lg:mx-1" />
          <div className="flex-1 flex gap-1.5 lg:gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['Flood help', 'First aid', 'Safe routes', 'SOS'].map(tag => (
              <button 
                key={tag}
                onClick={() => setInput(tag)}
                className="whitespace-nowrap px-2 py-0.5 lg:py-1 bg-white/5 border border-white/10 rounded text-[9px] lg:text-[10px] text-white/50 hover:bg-white/10 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe emergency..."
            className="w-full bg-black/40 border border-hardware-line rounded-xl p-3 lg:p-4 pr-10 lg:pr-12 text-xs lg:text-sm focus:outline-none focus:border-emergency/50 transition-colors resize-none h-16 lg:h-20"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 lg:right-3 bottom-2 lg:bottom-3 p-1.5 lg:p-2 bg-emergency rounded-lg text-white shadow-lg hover:bg-emergency/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
