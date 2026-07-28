/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, X, Send, Mic, MicOff, Volume2, VolumeX, ArrowRight, Sparkles, Check, PhoneCall,
  Search, MapPin, Brain, Zap, Phone, PhoneOff, Globe, ExternalLink
} from 'lucide-react';
import { ChanakyaMessage } from '../types';
import { floatTo16BitPCMBase64, AudioPlaybackQueue } from '../utils/audioHelper';

interface ChanakyaWidgetProps {
  inline?: boolean;
}

export default function ChanakyaWidget({ inline = false }: ChanakyaWidgetProps) {
  const [isOpen, setIsOpen] = useState(inline);
  const [messages, setMessages] = useState<ChanakyaMessage[]>([
    {
      id: 'init_msg',
      sender: 'chanakya',
      text: "Namaste, I’m Chanakya—RevAstra’s AI RevOps consultant. What are you trying to improve: lead generation, content, follow-up, appointments, sales visibility or automation?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice controls
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState<'english' | 'hinglish' | 'hindi'>('hinglish');
  
  // Progressive Lead Capture State
  const [step, setStep] = useState<'chatting' | 'capturing_name' | 'capturing_email' | 'capturing_phone' | 'done'>('chatting');
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', company: '', industry: 'builders' });
  const [isEscalated, setIsEscalated] = useState(false);

  // Advanced Gemini Configuration States
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  // Live WebSocket Voice Call States (Gemini Live API)
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callStatus, setCallStatus] = useState('Idle');
  const [callTranscript, setCallTranscript] = useState<Array<{ sender: string, text: string, timestamp: string }>>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Refs for Voice Call Audio & WebSocket
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<AudioPlaybackQueue | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const isMicMutedRef = useRef(false);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  const quickActions = [
    { text: "Generate more leads", handler: "I want to improve my lead generation." },
    { text: "Improve follow-up speed", handler: "Our lead follow-up is too slow." },
    { text: "Automate my sales", handler: "I need to set up automated pipelines and CRMs." },
    { text: "Build a growth system", builderLink: true },
    { text: "Talk to a human", escalate: true }
  ];

  // Speech synthesis configuration (standard text synthesis fallback)
  const speakText = (text: string) => {
    if (!text || isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Clean up text to speak nicely (remove markdown asterisks etc)
    const cleanedText = text.replace(/\*+/g, '').replace(/_/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    const voices = window.speechSynthesis.getVoices();
    let targetVoice = null;
    
    if (voiceStyle === 'hindi') {
      utterance.lang = 'hi-IN';
      targetVoice = voices.find(v => v.lang.startsWith('hi-IN'));
    } else if (voiceStyle === 'english') {
      utterance.lang = 'en-GB';
      targetVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US') || v.lang.startsWith('en-IN'));
    } else { // hinglish
      utterance.lang = 'en-IN';
      targetVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-GB'));
    }
    
    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    
    // Confident, relaxed, low-pitch settings
    utterance.rate = voiceStyle === 'hindi' ? 0.85 : 0.88; // Relaxed composed tempo
    utterance.pitch = 0.9; // Lower pitch, confident and professional tone
    
    window.speechSynthesis.speak(utterance);
  };

  // Browser speech recognition setup
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Web Speech recognition is not fully supported in this browser. Please try Chrome/Safari.");
      return;
    }

    if (isVoiceActive) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsVoiceActive(false);
    } else {
      const SpeechReg = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechReg();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Indian-English context supports hinglish and pronunciations beautifully

      rec.onstart = () => {
        setIsVoiceActive(true);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputMessage(transcript);
        sendMessage(transcript);
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error: ", err);
        setIsVoiceActive(false);
      };

      rec.onend = () => {
        setIsVoiceActive(false);
      };

      recognitionRef.current = rec;
      rec.start();
    }
  };

  const handleSearchToggle = () => {
    const nextSearch = !useSearch;
    setUseSearch(nextSearch);
    if (nextSearch) {
      setUseMaps(false); // mutually exclusive
      setLocation(null);
    }
  };

  const handleMapsToggle = () => {
    const nextMaps = !useMaps;
    setUseMaps(nextMaps);
    if (nextMaps) {
      setUseSearch(false); // mutually exclusive
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
          },
          (err) => {
            console.warn("Geolocation access denied or failed:", err);
          }
        );
      }
    } else {
      setLocation(null);
    }
  };

  const startVoiceCall = async () => {
    try {
      setCallStatus('Connecting...');
      setCallTranscript([]);
      setIsCallActive(true);
      setIsMicMuted(false);

      // 4. Request microphone access first - do not open WebSocket until permission has been granted
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // Initialize the 24kHz audio playback queue for Chanakya's response
      audioQueueRef.current = new AudioPlaybackQueue(24000);

      // Create WebSocket to the backend Live API route only after mic access is successful
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/chanakya/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setCallStatus('Connected - Speak to Chanakya');
        ws.send(JSON.stringify({
          type: "start",
          config: {
            voiceName: voiceStyle === 'hindi' ? 'Charon' : (voiceStyle === 'english' ? 'Kore' : 'Zephyr'),
            sessionLimitSeconds: 180,
            costLimitDollars: 0.20
          }
        }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          if (payload.type === 'audio' && payload.audio) {
            audioQueueRef.current?.playChunk(payload.audio);
          } else if (payload.type === 'transcript') {
            // Add or update live transcription log
            setCallTranscript(prev => {
              if (prev.length > 0 && prev[prev.length - 1].sender === payload.sender && !payload.isFinal) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  sender: payload.sender,
                  text: payload.text,
                  timestamp: new Date().toISOString()
                };
                return updated;
              } else {
                return [...prev, {
                  sender: payload.sender,
                  text: payload.text,
                  timestamp: new Date().toISOString()
                }];
              }
            });
          } else if (payload.type === 'status') {
            setCallStatus(payload.text);
          } else if (payload.type === 'interrupted') {
            audioQueueRef.current?.stop();
          } else if (payload.type === 'limit') {
            setCallStatus(`Session ended: limit reached.`);
            setTimeout(() => endVoiceCall(), 3000);
          } else if (payload.type === 'error') {
            setCallStatus(`Error: ${payload.text}`);
          }
        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setCallStatus('Voice connection failed.');
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed.");
      };

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN && !isMicMutedRef.current) {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64PCM = floatTo16BitPCMBase64(inputData);
          wsRef.current.send(JSON.stringify({
            type: "audio",
            audio: base64PCM
          }));
        }
      };

    } catch (err: any) {
      console.error("Microphone or Voice initialization failed:", err);
      setCallStatus(`Error: ${err.message || "Microphone access denied"}`);
      setIsCallActive(false);
    }
  };

  const endVoiceCall = () => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ type: "end" }));
        } catch (e) {}
      }
      try { wsRef.current.close(); } catch (e) {}
      wsRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    if (scriptProcessorRef.current) {
      try { scriptProcessorRef.current.disconnect(); } catch (e) {}
      scriptProcessorRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      try { inputAudioCtxRef.current.close(); } catch (e) {}
      inputAudioCtxRef.current = null;
    }

    if (audioQueueRef.current) {
      audioQueueRef.current.close();
      audioQueueRef.current = null;
    }

    setIsCallActive(false);
    setCallStatus('Idle');
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      endVoiceCall();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async (customText?: string) => {
    if (isTyping) return;
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    // Create user message
    const userMsg: ChanakyaMessage = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // If capturing lead contact details progressively
    if (step !== 'chatting') {
      handleProgressiveLead(textToSend);
      return;
    }

    // Call server API for Chanakya completion
    try {
      const response = await fetch("/api/chanakya/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          useSearch,
          useMaps,
          useThinking,
          speed,
          location,
          visitorInfo: {
            step,
            leadData,
            url: window.location.pathname
          }
        })
      });

      if (response.status === 429) {
        setIsTyping(false);
        console.error("Chanakya API Rate Limit Exceeded (Safe logged: HTTP 429 status response)");
        const rateLimitMsg: ChanakyaMessage = {
          id: "rl_" + Math.random().toString(36).substr(2, 9),
          sender: 'chanakya',
          text: "Chanakya is receiving unusually high traffic. Continue in text mode or try again shortly.",
          timestamp: new Date().toISOString(),
          isRateLimited: true
        };
        setMessages(prev => [...prev, rateLimitMsg]);
        return;
      }

      const data = await response.json();
      setIsTyping(false);

      if (data.error === "RESOURCE_EXHAUSTED") {
        const rateLimitMsg: ChanakyaMessage = {
          id: "rl_" + Math.random().toString(36).substr(2, 9),
          sender: 'chanakya',
          text: "Chanakya is receiving unusually high traffic. Continue in text mode or try again shortly.",
          timestamp: new Date().toISOString(),
          isRateLimited: true
        };
        setMessages(prev => [...prev, rateLimitMsg]);
        return;
      }

      const replyText = data.text || "I am reflecting deeply on your requirements. It appears our reasoning engine is temporarily busy. Could you tell me more about your current biggest business obstacle?";

      const chanakyaMsg: ChanakyaMessage = {
        id: "c_" + Math.random().toString(36).substr(2, 9),
        sender: 'chanakya',
        text: replyText,
        timestamp: new Date().toISOString(),
        groundingMetadata: data.groundingMetadata
      };

      setMessages(prev => [...prev, chanakyaMsg]);
      speakText(replyText);

      // Trigger progressive lead capture if user is highly engaged (e.g. conversation is > 4 messages)
      if (messages.length >= 4 && step === 'chatting' && !leadData.name) {
        setTimeout(() => {
          setStep('capturing_name');
          const capturePrompt: ChanakyaMessage = {
            id: "cap_name_prompt",
            sender: 'chanakya',
            text: "To structure a precise strategic growth plan for you, may I know your full name?",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, capturePrompt]);
          speakText(capturePrompt.text);
        }, 1500);
      }

    } catch (err) {
      console.error("Standard Chat request failed safely: ", err);
      setIsTyping(false);
      // fallback message
      const errorMsg: ChanakyaMessage = {
        id: "c_err",
        sender: 'chanakya',
        text: "I am reflecting deeply on your requirements. It appears our server is heavily loaded, but I recommend exploring our Growth System Builder at /growth-system-builder to calculate an optimized plan.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleProgressiveLead = (text: string) => {
    setIsTyping(false);
    if (step === 'capturing_name') {
      setLeadData(prev => ({ ...prev, name: text }));
      setStep('capturing_email');
      const nextPrompt: ChanakyaMessage = {
        id: "cap_email_prompt",
        sender: 'chanakya',
        text: `Pleasure connecting, ${text}. What is your professional corporate email address?`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, nextPrompt]);
      speakText(nextPrompt.text);
    } else if (step === 'capturing_email') {
      setLeadData(prev => ({ ...prev, email: text }));
      setStep('capturing_phone');
      const nextPrompt: ChanakyaMessage = {
        id: "cap_phone_prompt",
        sender: 'chanakya',
        text: "Understood. Please share your phone number so we can forward immediate updates and brochures on WhatsApp.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, nextPrompt]);
      speakText(nextPrompt.text);
    } else if (step === 'capturing_phone') {
      const finalData = { ...leadData, phone: text };
      setLeadData(finalData);
      setStep('done');

      // POST final lead details to DB
      fetch('/api/db/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalData.name,
          email: finalData.email,
          phone: finalData.phone,
          company: finalData.company || 'Chanakya Captured',
          industry: finalData.industry,
          source: 'Chanakya Progressive Chat'
        })
      });

      const nextPrompt: ChanakyaMessage = {
        id: "cap_done_prompt",
        sender: 'chanakya',
        text: `Dhanyavaad (Thank you), ${finalData.name}. I have registered your parameters in our secure pipeline. A senior growth strategist from RevAstra will reach out directly on WhatsApp within 15 minutes.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, nextPrompt]);
      speakText(nextPrompt.text);
    }
  };

  const triggerEscalation = () => {
    setIsEscalated(true);
    const escMsg: ChanakyaMessage = {
      id: "esc_msg",
      sender: 'chanakya',
      text: "🚨 I have flagged this session for high-priority human intervention. An expert RevOps counselor is analyzing this conversation and will take over immediately. If you'd like to bypass waiting, you can book a direct calendar call below.",
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, escMsg]);
    speakText(escMsg.text);

    // Save escalated status to conversation DB
    fetch('/api/db/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadData.name || "Anonymous Engaged",
        email: leadData.email || "no-email@engaged.com",
        phone: leadData.phone || "no-phone",
        company: "Escalated Session",
        industry: "builders",
        status: "contacted",
        source: "Chanakya Escalation Alert"
      })
    });
  };

  return (
    <>
      {/* Floating Button (Not shown if inline render) */}
      {!inline && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-astra-navy hover:bg-astra-gold text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 border border-white/10 transition-all duration-300 hover:scale-105"
        >
          <Bot className="w-6 h-6 text-astra-gold animate-bounce" />
          <span className="font-display font-bold text-xs tracking-wider uppercase pr-1">Chanakya Live</span>
        </button>
      )}

      {/* Main Chanakya panel */}
      {isOpen && (
        <div
          className={`${
            inline
              ? 'w-full h-[600px] border border-slate-100'
              : 'fixed bottom-6 right-6 z-50 w-full sm:w-[420px] h-[640px] border border-white/20'
          } bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all-300 animate-fade-in`}
        >
          {/* Header */}
          <div className="bg-astra-navy p-4 flex justify-between items-center text-white border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Bot className="w-8 h-8 text-astra-gold" />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-astra-navy" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm tracking-tight flex items-center">
                  Chanakya
                  <span className="ml-1.5 text-[8px] bg-astra-gold text-astra-navy px-1 py-0.2 rounded uppercase font-mono font-bold">
                    Advisor
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Live AI Growth Strategist</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Voice Live Call Button */}
              <button
                onClick={isCallActive ? endVoiceCall : startVoiceCall}
                className={`p-1.5 rounded transition flex items-center space-x-1 ${
                  isCallActive
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={isCallActive ? "End Voice Call" : "Start Live Voice Call with Chanakya"}
              >
                {isCallActive ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                {isCallActive && <span className="text-[8px] font-mono uppercase tracking-widest font-bold pr-0.5">Live</span>}
              </button>

              {/* Mute toggle button */}
              <button
                onClick={() => {
                  const newMuted = !isMuted;
                  setIsMuted(newMuted);
                  if (newMuted) window.speechSynthesis.cancel();
                }}
                className="p-1 rounded text-slate-400 hover:text-white transition"
                title={isMuted ? "Unmute" : "Mute audio synthesis"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {!inline && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Model Parameters Selector Row */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-1.5 flex flex-wrap items-center justify-between text-[10px] gap-y-1">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-astra-gold" /> Parameters:
            </span>
            <div className="flex items-center space-x-1.5">
              {/* Search Grounding toggle */}
              <button
                onClick={handleSearchToggle}
                className={`px-1.5 py-0.5 rounded text-[8px] font-semibold flex items-center space-x-0.5 transition ${
                  useSearch
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                }`}
                title="Toggle Google Search Grounding"
              >
                <Search className="w-2 h-2" />
                <span>Search</span>
              </button>

              {/* Maps Grounding toggle */}
              <button
                onClick={handleMapsToggle}
                className={`px-1.5 py-0.5 rounded text-[8px] font-semibold flex items-center space-x-0.5 transition ${
                  useMaps
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                }`}
                title="Toggle Google Maps Grounding"
              >
                <MapPin className="w-2 h-2" />
                <span>Maps</span>
              </button>

              {/* High Thinking toggle */}
              <button
                onClick={() => {
                  const nextThinking = !useThinking;
                  setUseThinking(nextThinking);
                  if (nextThinking) {
                    setSpeed('normal');
                  }
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-semibold flex items-center space-x-0.5 transition ${
                  useThinking
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                }`}
                title="Use deep thinking model (gemini-3.1-pro-preview)"
              >
                <Brain className="w-2 h-2" />
                <span>Think</span>
              </button>

              {/* Speed Model toggle */}
              <button
                onClick={() => {
                  const nextSpeed = speed === 'fast' ? 'normal' : 'fast';
                  setSpeed(nextSpeed);
                  if (nextSpeed === 'fast') {
                    setUseThinking(false);
                  }
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-semibold flex items-center space-x-0.5 transition ${
                  speed === 'fast'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                }`}
                title="Use ultra-fast lite model (gemini-3.1-flash-lite)"
              >
                <Zap className="w-2 h-2" />
                <span>Lite</span>
              </button>
            </div>
          </div>

          {/* Voice Style Selector Row */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-1.5 flex items-center justify-between text-[10px]">
            <div className="flex items-center space-x-1 text-slate-500 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-astra-gold" />
              <span>Voice Tone:</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {[
                { id: 'english', label: 'English (Formal)' },
                { id: 'hinglish', label: 'Hinglish' },
                { id: 'hindi', label: 'Hindi (Authentic)' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setVoiceStyle(style.id as any);
                    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                  }}
                  className={`px-2 py-0.5 rounded text-[9px] font-semibold transition ${
                    voiceStyle === style.id
                      ? 'bg-astra-navy text-white shadow-xs'
                      : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list / Active Voice Call Layout */}
          {isCallActive ? (
            <div className="flex-1 flex flex-col justify-between p-5 bg-slate-900 text-white overflow-hidden">
              {/* Call Status & Wave visualizer */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-astra-gold/20 rounded-full animate-ping absolute top-0 left-0" />
                  <div className="w-20 h-20 bg-astra-gold/30 rounded-full animate-pulse absolute top-0 left-0" />
                  <div className="w-20 h-20 bg-slate-800 border-2 border-astra-gold rounded-full flex items-center justify-center relative z-10">
                    <Bot className="w-10 h-10 text-astra-gold" />
                  </div>
                </div>

                <div className="text-center">
                  <h5 className="font-display font-bold text-sm text-white">Chanakya Voice Session</h5>
                  <p className="text-[10px] text-astra-gold mt-0.5 animate-pulse font-mono tracking-wide">{callStatus}</p>
                </div>

                {/* Animated wave */}
                <div className="flex items-center justify-center space-x-1 h-6">
                  <span className="w-0.5 bg-astra-gold rounded-full h-2 animate-[pulse_1s_infinite]" />
                  <span className="w-0.5 bg-astra-gold rounded-full h-4 animate-[pulse_0.8s_infinite]" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-astra-gold rounded-full h-5 animate-[pulse_1.2s_infinite]" style={{ animationDelay: '300ms' }} />
                  <span className="w-0.5 bg-astra-gold rounded-full h-3 animate-[pulse_0.9s_infinite]" style={{ animationDelay: '450ms' }} />
                  <span className="w-0.5 bg-astra-gold rounded-full h-1 animate-[pulse_1.1s_infinite]" style={{ animationDelay: '600ms' }} />
                </div>
              </div>

              {/* Real-time transcription */}
              {callTranscript.length > 0 && (
                <div className="h-32 overflow-y-auto bg-slate-850 border border-slate-800 rounded-xl p-3 space-y-2 text-[11px] font-mono text-slate-300">
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1 mb-1">Dialogue Transcript</p>
                  {callTranscript.map((t, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className={`font-bold uppercase text-[8px] ${t.sender === 'user' ? 'text-blue-400' : 'text-astra-gold'}`}>
                        {t.sender === 'user' ? 'You' : 'Chanakya'}:
                      </span>
                      <p className="leading-relaxed whitespace-pre-wrap">{t.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Call Control Center */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-center space-x-3">
                <button
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-2.5 rounded-full border transition ${
                    isMicMuted
                      ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={endVoiceCall}
                  className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-full shadow-lg transition transform hover:scale-105 flex items-center justify-center"
                  title="Disconnect Voice Call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50" ref={chatContainerRef}>
              <div className="bg-amber-50/70 border border-amber-200/50 p-2.5 rounded-xl text-center">
                <p className="text-[10px] text-[#7A6242] leading-relaxed font-medium">
                  Chanakya is an authorized, clearly disclosed AI business consultant trained on RevAstra parameters, frameworks, packages, and workflows.
                </p>
              </div>

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
                  {m.sender === 'chanakya' && (
                    <Bot className="w-6 h-6 text-astra-gold flex-shrink-0 mt-1" />
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      m.isRateLimited
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-none'
                        : m.sender === 'user'
                        ? 'bg-astra-navy text-white rounded-tr-none'
                        : 'bg-white text-astra-navy rounded-tl-none border border-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {m.isRateLimited && (
                      <div className="mt-3 pt-2.5 border-t border-red-200 flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            // Find the last user message to retry
                            const userMsgs = messages.filter(msg => msg.sender === 'user');
                            const lastUserMsg = userMsgs[userMsgs.length - 1];
                            if (lastUserMsg) {
                              sendMessage(lastUserMsg.text);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-1 px-2.5 rounded transition uppercase tracking-wider"
                        >
                          Retry
                        </button>
                        <button
                          onClick={() => {
                            const fallbackMsg: ChanakyaMessage = {
                              id: "fb_" + Math.random().toString(36).substr(2, 9),
                              sender: 'chanakya',
                              text: "Namaste. I have secured our communications over text-only channels. How can I help map your business growth systems today?",
                              timestamp: new Date().toISOString(),
                              isTextFallback: true
                            };
                            setMessages(prev => [...prev, fallbackMsg]);
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold py-1 px-2.5 rounded transition uppercase tracking-wider"
                        >
                          Continue in text
                        </button>
                        <a
                          href="/growth-system-builder"
                          className="bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy text-[10px] font-bold py-1 px-2.5 rounded text-center transition uppercase tracking-wider"
                        >
                          Book a Strategy Call
                        </a>
                      </div>
                    )}
                    
                    {/* Render Grounding sources if present */}
                    {m.groundingMetadata?.groundingChunks?.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-100 text-[9px] space-y-1 text-slate-500">
                        <div className="flex items-center text-[8px] font-semibold text-slate-700 uppercase tracking-wider gap-0.5">
                          <Globe className="w-2.5 h-2.5 text-blue-500" />
                          <span>Sources Verified:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {m.groundingMetadata.groundingChunks.map((chunk: any, cidx: number) => {
                            const url = chunk.web?.uri;
                            const title = chunk.web?.title || "Web Link";
                            if (!url) return null;
                            return (
                              <a
                                key={cidx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-0.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 px-1 py-0.5 rounded font-medium max-w-[110px] truncate"
                                title={title}
                              >
                                <span>{title}</span>
                                <ExternalLink className="w-2 h-2 text-slate-400 flex-shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className={`text-[8px] mt-1 text-right ${m.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <Bot className="w-6 h-6 text-astra-gold animate-bounce" />
                  <div className="flex space-x-1 py-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quick Actions (only when chatting and voice call is not active) */}
          {step === 'chatting' && !isCallActive && (
            <div className="p-3 border-t border-slate-100 bg-white flex flex-wrap gap-1.5 overflow-x-auto max-h-24">
              {quickActions.map((qa, index) => {
                if (qa.builderLink) {
                  return (
                    <a
                      key={index}
                      href="/growth-system-builder"
                      className="text-[11px] font-medium bg-astra-gold/10 hover:bg-astra-gold text-astra-gold hover:text-astra-navy border border-astra-gold/20 px-2.5 py-1 rounded-full transition"
                    >
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {qa.text}
                    </a>
                  );
                }
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (qa.escalate) {
                        triggerEscalation();
                      } else if (qa.handler) {
                        setInputMessage('');
                        sendMessage(qa.handler);
                      }
                    }}
                    className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition"
                  >
                    {qa.text}
                  </button>
                );
              })}
            </div>
          )}

          {/* Form / Text Input Controls (only when voice call is not active) */}
          {!isCallActive && (
            <div className="p-3 border-t border-slate-100 bg-white">
              {isEscalated ? (
                <div className="p-2 bg-astra-gold/10 border border-astra-gold/20 rounded-lg text-xs space-y-2 text-center text-slate-800">
                  <p className="font-semibold text-astra-navy flex items-center justify-center">
                    <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-astra-gold" />
                    Strategy Call Booking Active
                  </p>
                  <p>Would you like to reserve a 30-minute growth diagnostic session directly with our senior consultant?</p>
                  <a
                    href="/book-strategy-call"
                    className="inline-block w-full bg-astra-navy text-white font-medium py-1.5 rounded hover:bg-astra-gold hover:text-astra-navy transition"
                  >
                    Confirm Strategy Call Slot
                  </a>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Voice Record Mic Trigger */}
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`p-2.5 rounded-lg border transition ${
                      isVoiceActive
                        ? 'bg-red-500 border-red-500 text-white animate-pulse'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-astra-navy'
                    }`}
                    title={isVoiceActive ? "Speak now - click to stop" : "Speak to Chanakya (Voice mode)"}
                  >
                    {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={
                      step === 'capturing_name'
                        ? "Enter your full name..."
                        : step === 'capturing_email'
                        ? "Enter your corporate email..."
                        : step === 'capturing_phone'
                        ? "Enter your whatsapp phone..."
                        : "Type your query here..."
                    }
                    className="flex-1 text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-astra-gold focus:bg-white px-3.5 py-2 rounded-lg text-slate-800"
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim()}
                    className="bg-astra-navy hover:bg-astra-gold disabled:bg-slate-100 text-white disabled:text-slate-400 p-2.5 rounded-lg transition shadow hover:shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
