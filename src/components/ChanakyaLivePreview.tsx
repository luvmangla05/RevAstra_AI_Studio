/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, MessageSquare, Mic, Volume2, Globe, Shield, Play, 
  ArrowRight, CheckCircle2, Check, User, Sparkles
} from 'lucide-react';

export default function ChanakyaLivePreview() {
  const [activeLang, setActiveLang] = useState<'english' | 'hindi' | 'hinglish'>('english');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot', text: string }>>([]);

  const promptOptions = [
    {
      id: 'ota',
      label: "Bypass Hotel OTA Fees",
      userQuery: {
        english: "How does Chanakya bypass hotel OTA commission fees?",
        hindi: "चाणक्य होटलों की OTA कमीशन फीस को कैसे कम करता है?",
        hinglish: "Chanakya hotel ki OTA commission fees ko kaise bypass karta hai?"
      },
      botResponse: {
        english: "By triggering direct-booking incentive workflows on WhatsApp the moment a traveler abandons their cart, answering room queries instantly and offering exclusive booking perks without platform commission overheads.",
        hindi: "जब कोई यात्री बुकिंग बीच में छोड़ता है, चाणक्य व्हाट्सएप पर डायरेक्ट बुकिंग इंसेंटिव तुरंत सक्रिय करता है, कमरे के सवालों का जवाब तुरंत देता है और कमीशन के बिना डायरेक्ट बुकिंग कन्फर्म करता है।",
        hinglish: "Jaise hi guest booking cart ko adha chhodta hai, Chanakya WhatsApp par direct incentives trigger karta hai. Guest queries ko instantly handle karke commission bypass booking confirm karvata hai."
      }
    },
    {
      id: 'real-estate',
      label: "Qualify Property Buyer",
      userQuery: {
        english: "Show me a real estate buyer qualification script.",
        hindi: "मुझे एक रियल एस्टेट खरीदार योग्यता स्क्रिप्ट दिखाएं।",
        hinglish: "Mujhe ek real estate buyer qualification script dikhao."
      },
      botResponse: {
        english: "Namaste! I have received your enquiry regarding Sovereign Crest. To route you to our executive, are you looking for a 2BHK or 3BHK? Also, is your budget above 1.5Cr or premium layout range?",
        hindi: "नमस्ते! मुझे सोवरेन क्रेस्ट के बारे में आपकी पूछताछ मिली है। आपको हमारे सही एग्जीक्यूटिव से जोड़ने के लिए, क्या आप 2BHK या 3BHK देख रहे हैं? आपका बजट क्या 1.5Cr से अधिक है?",
        hinglish: "Namaste! Sovereign Crest ke liye aapki enquiry mili hai. Sahi executive se connect karne ke liye, kya aap 2BHK ya 3BHK dekh rahe hain? Aur aapka budget kya 1.5Cr plus hai?"
      }
    },
    {
      id: 'greeting',
      label: "Draft WhatsApp Greeting",
      userQuery: {
        english: "Generate a premium clinic WhatsApp greeting script.",
        hindi: "एक प्रीमियम क्लिनिक व्हाट्सएप ग्रीटिंग स्क्रिप्ट जेनरेट करें।",
        hinglish: "Ek premium clinic WhatsApp greeting script generate karo."
      },
      botResponse: {
        english: "Welcome to Apex Dental. We have received your consultation enquiry. To book your specialist slot today, please tap 'Confirm Slot' below or select your treatment type.",
        hindi: "अपैक्स डेंटल में आपका स्वागत है। हमें आपकी परामर्श पूछताछ मिल गई है। आज ही अपना स्पेशलिस्ट स्लॉट बुक करने के लिए, नीचे 'कन्फर्म स्लॉट' पर टैप करें या अपना इलाज चुनें।",
        hinglish: "Apex Dental me aapka swagat hai. Humein aapki consultation enquiry mil gayi hai. Aaj hi specialized slot book karne ke liye, neeche 'Confirm Slot' par tap karein."
      }
    }
  ];

  const handleSelectPrompt = (promptId: string) => {
    const p = promptOptions.find(opt => opt.id === promptId);
    if (!p) return;

    setSelectedPrompt(promptId);
    setIsBotTyping(true);

    const userText = p.userQuery[activeLang];
    const botText = p.botResponse[activeLang];

    // Reset history and add user message
    setChatHistory([{ sender: 'user', text: userText }]);

    // Simulate bot delay
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'bot', text: botText }]);
      setIsBotTyping(false);
    }, 1200);
  };

  const handleLangChange = (lang: 'english' | 'hindi' | 'hinglish') => {
    setActiveLang(lang);
    if (selectedPrompt) {
      const p = promptOptions.find(opt => opt.id === selectedPrompt);
      if (p) {
        setChatHistory([
          { sender: 'user', text: p.userQuery[lang] },
          { sender: 'bot', text: p.botResponse[lang] }
        ]);
      }
    }
  };

  return (
    <section className="py-24 bg-white text-astra-navy" id="chanakya-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text & Audio details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-slate-50 border border-slate-200 px-3 py-1 rounded-full inline-flex items-center">
              <Bot className="w-3.5 h-3.5 mr-1.5 text-astra-gold animate-bounce" />
              Chanakya Live Conversation preview
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-astra-navy leading-tight">
              Humanised Intelligence. Multilingual Depth.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Chanakya is a premium AI growth agent. Instead of standard robotic templates, Chanakya speaks with nuanced characteristics, seamlessly balancing local context and professional delivery.
            </p>

            {/* Voice characteristics card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-3.5">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-astra-gold" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Voice Synthesis Characteristics</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-slate-100">
                  <span className="text-[9px] text-slate-400 block font-mono">ACOUSTIC PROFILE</span>
                  <span className="font-bold text-slate-700">Nuanced, warm baritone</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-100">
                  <span className="text-[9px] text-slate-400 block font-mono">DELIVERY MODE</span>
                  <span className="font-bold text-slate-700">Empathetic & authoritative</span>
                </div>
              </div>

              {/* Animated waveform placeholder */}
              <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-lg">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Live Voice Call State</span>
                <div className="flex space-x-1 items-center h-5">
                  <div className="w-1 bg-astra-gold rounded-full h-2 animate-pulse" />
                  <div className="w-1 bg-astra-gold rounded-full h-4 animate-pulse delay-75" />
                  <div className="w-1 bg-astra-gold rounded-full h-5 animate-pulse delay-150" />
                  <div className="w-1 bg-astra-gold rounded-full h-3 animate-pulse delay-100" />
                  <div className="w-1 bg-astra-gold rounded-full h-1 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Chat Simulation Box (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between min-h-[480px]">
            
            {/* Header with language selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-astra-navy text-[#C5A880] flex items-center justify-center font-bold">
                  C
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 flex items-center">
                    Chanakya Core Simulator
                    <Sparkles className="w-3 h-3 text-astra-gold ml-1 animate-pulse" />
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-600 block uppercase font-bold tracking-wider">
                    ● ACTIVE INSTANT LISTENER
                  </span>
                </div>
              </div>

              {/* Language toggle row */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60">
                {[
                  { id: 'english', label: 'English' },
                  { id: 'hindi', label: 'हिन्दी' },
                  { id: 'hinglish', label: 'Hinglish' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => handleLangChange(lang.id as any)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                      activeLang === lang.id
                        ? 'bg-white text-astra-navy shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated chat thread sandbox */}
            <div className="flex-grow min-h-[180px] bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-end space-y-3">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Select one of the query prompts below to test the response logic...
                </div>
              ) : (
                <div className="space-y-3 max-h-[220px] overflow-y-auto">
                  {chatHistory.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-3 rounded-xl max-w-[80%] text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-astra-navy text-white shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}

                  {isBotTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 px-4 py-3 rounded-xl flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prompt buttons row */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-semibold">
                Tap to Select Prompt Query
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {promptOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectPrompt(opt.id)}
                    className={`p-2.5 rounded-lg border text-left text-[11px] font-bold leading-tight transition ${
                      selectedPrompt === opt.id
                        ? 'bg-astra-navy text-white border-astra-navy'
                        : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
