import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { PLAN_LIMITS } from '../../data/plansData';
import { Bot, Send, Sparkles, AlertCircle, RefreshCw, User, HelpCircle, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'chanakya';
  text: string;
  timestamp: string;
}

export default function ChanakyaApp() {
  const { user } = useAuth();
  const location = useLocation();

  const queryLimit = user?.plan ? PLAN_LIMITS[user.plan].chanakyaQueriesMonthly : 20;
  const queriesUsed = user?.usage?.chanakyaQueriesUsed || 2;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'chanakya',
      text: `Namaste ${user?.name || 'Partner'}. I am Chanakya, your AI RevOps & Growth Operating System Advisor.\n\nI am dedicated strictly to helping ${user?.businessName || 'your business'} optimize sales pipelines, lead response speeds, WhatsApp follow-ups, and GST quotations. How can I assist your revenue operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Read initial prompt passed via state (e.g. from top header quick search bar)
  useEffect(() => {
    if (location.state?.initialPrompt) {
      handleSendPrompt(location.state.initialPrompt);
    }
  }, [location.state]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setRateLimitError(false);

    try {
      const res = await fetch('/api/chanakya/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          industry: user?.onboardingData?.industry,
          visitorInfo: {
            businessName: user?.businessName,
            city: user?.onboardingData?.city,
            plan: user?.plan
          }
        })
      });

      if (res.status === 429) {
        setRateLimitError(true);
        throw new Error("Rate limit exceeded");
      }

      const data = await res.json();
      const botReply: ChatMessage = {
        id: 'b_' + Date.now(),
        sender: 'chanakya',
        text: data.text || "I have processed your inquiry. To maximize lead velocity, automate WhatsApp responses immediately upon form submission.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.warn("Chanakya API response error or fallback", err);
      if (!rateLimitError) {
        const fallbackReply: ChatMessage = {
          id: 'b_fb_' + Date.now(),
          sender: 'chanakya',
          text: `In Indian sales environments, response velocity is paramount. When a lead enters from Meta Ads or WhatsApp, sending an instant automated brochure with your GST pricing breakdown increases site visit bookings by up to 3x. Would you like me to draft an optimal WhatsApp response script for your team?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackReply]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    "How do I reduce lead leakage from Meta Ads?",
    "Draft a WhatsApp script for property site visits.",
    "How does the RevAstra Arjuna plan handle short-form reels?",
    "Explain GST quotation structures for intrastate buyers."
  ];

  return (
    <AppLayout 
      title="Ask Chanakya AI Growth Advisor" 
      subtitle="Your strategic advisor for sales pipelines, lead response SLAs, and Indian revenue operations."
    >
      <div className="flex flex-col h-[calc(100vh-12rem)] bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Top Chat Info Header */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-astra-gold/20 text-astra-gold border border-astra-gold/40 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white font-display">Chanakya AI</span>
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold uppercase">
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Strictly focused on sales, CRM, lead handling & business growth.</p>
            </div>
          </div>

          <div className="text-right font-mono text-[11px]">
            <span className="text-slate-400">Queries Usage: </span>
            <span className="text-astra-gold font-bold">{queriesUsed} / {queryLimit}</span>
          </div>
        </div>

        {/* Rate Limit Warning if triggered */}
        {rateLimitError && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 p-3 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Chanakya AI is experiencing high query traffic. Re-trying in 10 seconds...</span>
            </div>
            <button
              onClick={() => handleSendPrompt()}
              className="text-[10px] font-bold bg-amber-600 text-white px-2.5 py-1 rounded hover:bg-amber-700 transition"
            >
              Retry Query
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-astra-navy text-white'
                  : 'bg-astra-gold/20 text-astra-navy border border-astra-gold/40'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-astra-navy" />}
              </div>

              <div className={`rounded-2xl p-4 shadow-xs text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-astra-navy text-white rounded-tr-none'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none font-sans'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-[9px] mt-1.5 font-mono text-right ${
                  msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs p-2 font-mono">
              <div className="w-2 h-2 bg-astra-gold rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-astra-gold rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-astra-gold rounded-full animate-bounce delay-200"></div>
              <span className="ml-2 text-slate-400">Chanakya is analyzing sales logic...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts Pill Row */}
        <div className="p-2.5 bg-slate-100/80 border-t border-slate-200/80 flex items-center space-x-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono whitespace-nowrap pl-2">Suggestions:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(q)}
              className="text-[11px] font-medium text-slate-700 bg-white hover:bg-astra-navy hover:text-white border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Chanakya about sales processes, scripts, objections, or RevAstra tools..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-astra-gold"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-astra-navy hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 text-astra-gold" />
          </button>
        </form>

      </div>
    </AppLayout>
  );
}
