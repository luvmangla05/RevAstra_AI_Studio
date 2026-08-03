/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bot, Sparkles, ArrowRight, Mic, MicOff, Volume2, VolumeX, Send, 
  ChevronRight, RefreshCw, CheckCircle2, ShieldCheck, 
  HelpCircle, Sliders, Play, Settings, AlertTriangle, ArrowUpRight,
  Mail, Phone, PhoneOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './StrategicChanakyaHero.css';

interface Message {
  id: string;
  sender: 'user' | 'chanakya';
  text: string;
  timestamp: string;
}

// Q-index mapping
const QUESTIONS = [
  {
    id: 'industry',
    text: "Pranaam. Welcome to your Live Business Systems Consultation. Let's understand your context first: What industry do you operate in (e.g., Real Estate, Builders, Clinics, Hotels, Gyms, B2B) and what is your specific business type?",
    placeholder: "e.g., Property Developer in Mumbai or Gym in Delhi..."
  },
  {
    id: 'leadSources',
    text: "An honorable starting point. Where do you currently get your leads? (e.g. Facebook/Meta Ads, Google Search, property portals, walk-ins, offline organic)?",
    placeholder: "e.g., Mostly Meta Ads and Google Search..."
  },
  {
    id: 'enquiryVolume',
    text: "Excellent. Approximately how many leads or enquiries does your business receive weekly or monthly?",
    placeholder: "e.g., Around 150 leads per month..."
  },
  {
    id: 'responseSpeed',
    text: "Speed is the currency of modern growth. When a new prospect inquires, how quickly does your sales team respond? (e.g. within 5 minutes, 30 minutes, same day, next day, or delayed)?",
    placeholder: "e.g., Usually within 2 to 3 hours, manually..."
  },
  {
    id: 'crm',
    text: "Understood. Where do these leads get recorded first? Do you use a CRM like HubSpot, Salesforce, Zoho, or organize them in Google Sheets / Excel spreadsheets?",
    placeholder: "e.g., Google Sheets, copy-pasting manually..."
  },
  {
    id: 'followUpProcess',
    text: "If a lead doesn't pick up the first call, what is your follow-up process? Do you have active automated WhatsApp/email drip campaigns, or is it done manually by reps?",
    placeholder: "e.g., Manual follow-up, reps call back when they have time..."
  },
  {
    id: 'teamSize',
    text: "To size the operational complexity correctly: How many sales agents or representatives are active in your team?",
    placeholder: "e.g., We have 6 sales executives..."
  },
  {
    id: 'desiredOutcome',
    text: "What is your primary goal or desired outcome from our systems? (e.g., automated instant WhatsApp brochure delivery, qualifying leads automatically, reducing manual follow-ups, booking more site visits)?",
    placeholder: "e.g., Automate instant WhatsApp brochure sharing and site visit bookings..."
  }
];

interface ChanakyaTalkingOrbProps {
  size: 'large' | 'medium';
  talkState: 'idle' | 'connecting' | 'connected' | 'listening' | 'analysing' | 'speaking' | 'rate_limited' | 'unavailable' | 'text_fallback';
  isCallActive: boolean;
  isMuted?: boolean;
  onClick?: () => void;
}

export function ChanakyaTalkingOrb({ size, talkState, isCallActive, isMuted = false, onClick }: ChanakyaTalkingOrbProps) {
  const outerBoxSize = size === 'large' ? 'w-72 h-72' : 'w-48 h-48';
  const innerRingInset = size === 'large' ? 'inset-12' : 'inset-8';
  const botIconSize = size === 'large' ? 'w-10 h-10' : 'w-7 h-7';
  
  let statusText = "SYSTEM: STANDBY";
  let textColor = "text-blue-400";
  let ringBorderColor = "border-amber-400/20";
  let orbBgColor = "bg-[#050B1B]";
  let orbBorderColor = "border-blue-500/20";
  let botColor = "text-amber-400/90";
  let outerRingsColor = "border-blue-500/10";
  let outerRingsColorInner = "border-blue-600/15";
  
  const isSpeaking = talkState === 'speaking';
  const isListening = talkState === 'listening';
  const isAnalysing = talkState === 'analysing';
  
  if (talkState === 'connecting') {
    statusText = "CONNECTING LINK...";
    textColor = "text-amber-400 animate-pulse";
    orbBorderColor = "border-amber-400/40";
  } else if (talkState === 'connected') {
    statusText = "LINK ESTABLISHED";
    textColor = "text-emerald-400";
    orbBorderColor = "border-emerald-500/40";
  } else if (talkState === 'rate_limited') {
    statusText = "TRAFFIC LIMIT EXCEEDED";
    textColor = "text-red-400 animate-bounce";
    orbBorderColor = "border-red-500/40";
    botColor = "text-red-400";
  } else if (talkState === 'text_fallback') {
    statusText = "TEXT MODE SECURED";
    textColor = "text-slate-400";
    orbBorderColor = "border-white/10";
  } else if (talkState === 'unavailable') {
    statusText = "VOICE CONSOLE OFFLINE";
    textColor = "text-slate-500";
  } else if (isCallActive) {
    if (isMuted) {
      statusText = "MIC MUTED";
      textColor = "text-red-400";
      ringBorderColor = "border-red-500/30";
      orbBorderColor = "border-red-500/30";
      botColor = "text-red-400";
    } else if (isSpeaking) {
      statusText = "CHANAKYA BROADCASTING";
      textColor = "text-emerald-400 animate-pulse";
      ringBorderColor = "border-emerald-500/40";
      orbBgColor = "bg-[#02231c]";
      orbBorderColor = "border-emerald-500/40";
      botColor = "text-emerald-400";
      outerRingsColor = "border-emerald-500/30";
      outerRingsColorInner = "border-emerald-600/40";
    } else if (isListening) {
      statusText = "LISTENING (SPEAK NOW)";
      textColor = "text-amber-400 animate-pulse";
      ringBorderColor = "border-amber-400/40";
      orbBgColor = "bg-[#1c1505]";
      orbBorderColor = "border-amber-400/40";
      botColor = "text-amber-400";
      outerRingsColor = "border-amber-500/30";
      outerRingsColorInner = "border-amber-600/40";
    } else if (isAnalysing) {
      statusText = "COMPILING REVOPS...";
      textColor = "text-blue-400 animate-pulse";
      ringBorderColor = "border-blue-400/30";
      orbBgColor = "bg-[#0c1b33]";
      orbBorderColor = "border-blue-500/40";
    }
  } else {
    if (isSpeaking) {
      statusText = "CHANAKYA BROADCASTING";
      textColor = "text-emerald-400 animate-pulse";
    } else if (isListening) {
      statusText = "LISTENING (SPEAK NOW)";
      textColor = "text-amber-400 animate-pulse";
    } else if (isAnalysing) {
      statusText = "COMPILING REVOPS...";
      textColor = "text-blue-400 animate-pulse";
    }
  }

  const energyPulseClass = (isSpeaking || isListening) && !isMuted ? 'chanakya-energy-pulse' : '';
  const breathingClass = isSpeaking ? 'chanakya-breathe-fast' : 'chanakya-breathe';
  const rotationDuration = isSpeaking ? '15s' : isAnalysing ? '4s' : '140s';
  const pingDurationOuter = isSpeaking ? '1.2s' : '3s';
  const pingDurationInner = isSpeaking ? '1.5s' : '4s';

  return (
    <div 
      onClick={onClick}
      className={`relative ${outerBoxSize} flex items-center justify-center ${onClick ? 'cursor-pointer hover:scale-105 active:scale-98' : ''} transition-all duration-500 group`}
    >
      {/* 1st direct child: Aligned smaller status text label (fulfilling selector 1) */}
      <div 
        className="absolute top-[-44px] left-1/2 -translate-x-1/2 flex items-center justify-center space-x-1.5 bg-slate-950/80 border border-white/5 py-1 px-3.5 rounded-full backdrop-blur-md z-30 shadow-lg text-[10px] font-mono font-bold tracking-wider text-center uppercase"
        style={{ fontSize: '9px', textAlign: 'center' }}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isMuted || talkState === 'rate_limited' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
        <span className={textColor}>{statusText}</span>
      </div>

      {/* 2nd direct child: Highly interactive line wave while talking (fulfilling selector 2) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {(isSpeaking || isListening || talkState === 'connecting') && !isMuted ? (
          <div className="w-full h-full absolute inset-0 flex items-center justify-center">
            <svg className="w-[85%] h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
              <path
                d="M 0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 200 20"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                className="animate-wave-line-1"
              />
              <path
                d="M 0 20 Q 25 35, 50 20 T 100 20 T 150 20 T 200 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                opacity="0.7"
                className="animate-wave-line-2"
              />
              <path
                d="M 0 20 Q 25 20, 50 20 T 100 20 T 150 20 T 200 20"
                fill="none"
                stroke="#10b981"
                strokeWidth="1"
                opacity="0.5"
                className="animate-wave-line-3"
              />
            </svg>
          </div>
        ) : (
          <div className="w-2/3 h-[1px] bg-white/10" />
        )}
      </div>

      {/* 3rd direct child and onwards are remaining rings and core */}
      <div 
        className={`absolute inset-0 rounded-full border ${outerRingsColor} animate-ping opacity-25`} 
        style={{ animationDuration: pingDurationOuter }} 
      />
      <div 
        className={`absolute inset-4 rounded-full border ${outerRingsColorInner} animate-ping opacity-20`} 
        style={{ animationDuration: pingDurationInner }} 
      />

      {(isSpeaking || isListening) && !isMuted && (
        <>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 blur-xs animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 blur-xs animate-bounce" style={{ animationDelay: '0.4s' }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 blur-xs animate-bounce" style={{ animationDelay: '0.7s' }} />
        </>
      )}

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 animate-spin" 
        style={{ animationDuration: rotationDuration }} 
        viewBox="0 0 100 100"
      >
        <line x1="50" y1="50" x2="50" y2="10" stroke="#B89555" strokeWidth="0.75" strokeDasharray="2 3" />
        <circle cx="50" cy="10" r="1.5" fill="#B89555" />
        <line x1="50" y1="50" x2="84.6" y2="70" stroke="#B89555" strokeWidth="0.75" strokeDasharray="2 3" />
        <circle cx="84.6" cy="70" r="1.5" fill="#B89555" />
        <line x1="50" y1="50" x2="15.4" y2="70" stroke="#B89555" strokeWidth="0.75" strokeDasharray="2 3" />
        <circle cx="15.4" cy="70" r="1.5" fill="#B89555" />
        <circle cx="50" cy="50" r="34" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 8" fill="none" opacity="0.4" />
        <circle cx="50" cy="50" r="28" stroke="#1e3a8a" strokeWidth="0.5" strokeDasharray="1 4" fill="none" />
      </svg>

      <div className={`absolute ${innerRingInset} rounded-full border border-amber-400/20 bg-slate-950/40 backdrop-blur-md flex items-center justify-center p-4 shadow-2xl transition-all duration-500 ${energyPulseClass}`}>
        <div className={`relative w-full h-full rounded-full ${orbBgColor} border ${orbBorderColor} flex flex-col items-center justify-center p-3 transition-all duration-500 overflow-hidden ${breathingClass}`}>
          <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-pulse" />
          {isSpeaking && <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-30" />}
          {isListening && <div className="absolute inset-0 rounded-full bg-amber-400/10 animate-ping opacity-30" />}

          <Bot className={`${botIconSize} ${botColor} relative z-10 transition-transform duration-300 group-hover:scale-110`} />
          
          {onClick && !isCallActive && (
            <span className="absolute bottom-2 text-[6px] font-mono text-slate-500 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to talk live
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StrategicChanakyaHero() {
  const navigate = useNavigate();

  // Consultation activation
  const [isConsulting, setIsConsulting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 to 7 for business questions, 8 for contact info, 9 for loading report
  
  // Conversation History
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_msg',
      sender: 'chanakya',
      text: "Pranaam, I am Chanakya—RevAstra's Live AI RevOps Consultant. Let's map your sales pipeline. Speak or type to start your customized system mapping.",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Answers Map
  const [answers, setAnswers] = useState<Record<string, string>>({
    industry: '',
    businessType: '',
    leadSources: '',
    enquiryVolume: '',
    responseSpeed: '',
    crm: '',
    followUpProcess: '',
    teamSize: '',
    desiredOutcome: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: ''
  });

  // Voice Interaction states
  const [talkState, setTalkState] = useState<'idle' | 'listening' | 'analysing' | 'speaking' | 'unavailable'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState<'hinglish' | 'english' | 'hindi'>('hinglish');

  // Lead contact info states (Step 8)
  const [contactStep, setContactStep] = useState<'name' | 'company' | 'email' | 'phone'>('name');

  // Refs for Gemini Live Audio
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const playbackContextRef = useRef<AudioContext | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);
  const nextStartTimeRef = useRef<number>(0);

  const speakText = (text: string) => {
    console.log("Legacy SpeechSynthesis deactivated. Gemini Live is handling speech stream. Content: ", text);
  };

  const startListening = () => {
    console.log("Legacy SpeechRecognition deactivated. Gemini Live is handling mic stream.");
  };

  // Conversion Helpers
  const floatTo16BitPCM = (floatSamples: Float32Array): ArrayBuffer => {
    const buffer = new ArrayBuffer(floatSamples.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < floatSamples.length; i++) {
      const s = Math.max(-1, Math.min(1, floatSamples[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const appendSystemMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'chanakya',
        text: text,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const stopPlayback = () => {
    audioQueueRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {}
    });
    audioQueueRef.current = [];
    nextStartTimeRef.current = 0;
  };

  const playPCMChunk = (base64Data: string) => {
    if (!playbackContextRef.current) return;
    const ctx = playbackContextRef.current;
    
    try {
      const raw = window.atob(base64Data);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        bytes[i] = raw.charCodeAt(i);
      }
      
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }
      
      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      
      const sourceNode = ctx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(ctx.destination);
      
      const currentTime = ctx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime + 0.03;
      }
      
      sourceNode.start(nextStartTimeRef.current);
      
      sourceNode.onended = () => {
        const index = audioQueueRef.current.indexOf(sourceNode);
        if (index > -1) {
          audioQueueRef.current.splice(index, 1);
        }
        if (audioQueueRef.current.length === 0) {
          setTalkState('idle');
        }
      };
      
      nextStartTimeRef.current += audioBuffer.duration;
      audioQueueRef.current.push(sourceNode);
      setTalkState('speaking');
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  const startVoiceSession = async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("Web Audio API not supported");
      }

      const playbackContext = new AudioContextClass({ sampleRate: 24000 });
      playbackContextRef.current = playbackContext;

      const micContext = new AudioContextClass({ sampleRate: 16000 });
      micContextRef.current = micContext;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/chanakya/live`;
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("Chanakya Live WS connection established.");
        ws.send(JSON.stringify({
          type: "start",
          config: {
            voiceName: "Zephyr"
          }
        }));
        setTalkState('idle');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "audio") {
            if (!isMuted) {
              playPCMChunk(data.audio);
            }
          }
          
          else if (data.type === "interrupted") {
            stopPlayback();
          }
          
          else if (data.type === "transcript") {
            const sender = data.sender;
            const text = data.text;
            
            setMessages(prev => {
              const list = [...prev];
              const lastMsg = list[list.length - 1];
              
              if (lastMsg && lastMsg.sender === sender && lastMsg.id.startsWith("live_")) {
                lastMsg.text = text;
              } else {
                list.push({
                  id: `live_${sender}_${Date.now()}`,
                  sender,
                  text,
                  timestamp: new Date().toISOString()
                });
              }
              return list;
            });
          }
          
          else if (data.type === "limit") {
            const reason = data.reason;
            const text = reason === "session"
              ? "Voice session limit reached. Transitioning to text mode."
              : "Voice session cost budget exceeded. Transitioning to text mode.";
            
            appendSystemMessage(text);
            stopVoiceSession();
          }
          
          else if (data.type === "error") {
            console.error("Voice Server Error:", data.text);
            appendSystemMessage("Voice is temporarily unavailable. I’ve kept the conversation open in text mode.");
            stopVoiceSession();
          }
        } catch (e) {
          console.error("WS parsing error:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
        appendSystemMessage("Voice is temporarily unavailable. I’ve kept the conversation open in text mode.");
        stopVoiceSession();
      };

      ws.onclose = () => {
        console.log("Chanakya Live WS Closed.");
        setTalkState('idle');
      };

      const micSource = micContext.createMediaStreamSource(stream);
      const processor = micContext.createScriptProcessor(2048, 1, 1);
      processorNodeRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted) return;
        const inputData = e.inputBuffer.getChannelData(0);
        
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        
        if (rms > 0.015) {
          setTalkState('listening');
        }

        const pcmBuffer = floatTo16BitPCM(inputData);
        const base64Audio = arrayBufferToBase64(pcmBuffer);
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "audio",
            audio: base64Audio
          }));
        }
      };

      micSource.connect(processor);
      processor.connect(micContext.destination);

    } catch (err) {
      console.error("Failed to start voice session:", err);
      appendSystemMessage("Voice is temporarily unavailable. I’ve kept the conversation open in text mode.");
      stopVoiceSession();
    }
  };

  const stopVoiceSession = () => {
    setTalkState('idle');
    
    if (processorNodeRef.current) {
      try {
        processorNodeRef.current.disconnect();
      } catch (e) {}
      processorNodeRef.current = null;
    }
    
    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      micStreamRef.current = null;
    }
    
    if (micContextRef.current) {
      try {
        micContextRef.current.close();
      } catch (e) {}
      micContextRef.current = null;
    }
    
    if (playbackContextRef.current) {
      try {
        playbackContextRef.current.close();
      } catch (e) {}
      playbackContextRef.current = null;
    }
    
    if (socketRef.current) {
      try {
        socketRef.current.close();
      } catch (e) {}
      socketRef.current = null;
    }
    
    stopPlayback();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  const handleTalkNow = () => {
    setIsConsulting(true);
    startVoiceSession();
  };

  const handlePreferTyping = () => {
    setIsConsulting(true);
    setTimeout(() => {
      const qText = QUESTIONS[0].text;
      setMessages(prev => [
        ...prev,
        {
          id: 'q_0',
          sender: 'chanakya',
          text: qText,
          timestamp: new Date().toISOString()
        }
      ]);
    }, 300);
  };

  const handleSend = async () => {
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal('');

    // Append user's message
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    // Handle flow based on currentStep
    if (currentStep < 8) {
      const currentQ = QUESTIONS[currentStep];
      const updatedAnswers = { ...answers, [currentQ.id]: userText };
      if (currentQ.id === 'industry') {
        updatedAnswers.businessType = userText;
      }
      setAnswers(updatedAnswers);

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      setIsTyping(true);
      setTalkState('analysing');

      setTimeout(() => {
        setIsTyping(false);
        if (nextStep < 8) {
          // Send next question
          const nextQ = QUESTIONS[nextStep];
          const chanakyaMsg: Message = {
            id: `chanakya_${Date.now()}`,
            sender: 'chanakya',
            text: nextQ.text,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, chanakyaMsg]);
          speakText(nextQ.text);
          if (talkState !== 'unavailable') {
            setTimeout(() => startListening(), 1500);
          }
        } else {
          // Value Gifting Phase! Chanakya gives instant feedback before lead capture
          const diagnosticValue = `Excellent! I have completed my primary pipeline diagnosis of your system. 

Based on your inputs, I detect a significant bottleneck in your lead flow. Your average response time of "${updatedAnswers.responseSpeed}" indicates high risk of prospect drop-off. Furthermore, using "${updatedAnswers.crm}" combined with a "${updatedAnswers.followUpProcess}" follow-up strategy creates friction that directly limits sales conversion.

To unlock, download, and securely save your comprehensive, full-screen bespoke System Audit Report—complete with deterministic scores, workflow diagrams, package suggestions, and priorities—may I know your full name?`;

          const valMsg: Message = {
            id: `chanakya_val`,
            sender: 'chanakya',
            text: diagnosticValue,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, valMsg]);
          speakText(diagnosticValue);
          setContactStep('name');
        }
      }, 1000);

    } else if (currentStep === 8) {
      // Step 8: Contact Capture
      if (contactStep === 'name') {
        setAnswers(prev => ({ ...prev, contactName: userText }));
        setContactStep('company');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const msgText = `Splendid, ${userText}. What is your registered company name?`;
          setMessages(prev => [
            ...prev,
            {
              id: `c_comp`,
              sender: 'chanakya',
              text: msgText,
              timestamp: new Date().toISOString()
            }
          ]);
          speakText(msgText);
        }, 800);
      } else if (contactStep === 'company') {
        setAnswers(prev => ({ ...prev, companyName: userText }));
        setContactStep('email');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const msgText = `Excellent. Please share your professional business email so we can hook your custom system blueprint to your inbox.`;
          setMessages(prev => [
            ...prev,
            {
              id: `c_email`,
              sender: 'chanakya',
              text: msgText,
              timestamp: new Date().toISOString()
            }
          ]);
          speakText(msgText);
        }, 800);
      } else if (contactStep === 'email') {
        setAnswers(prev => ({ ...prev, email: userText }));
        setContactStep('phone');
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const msgText = `Perfect. Finally, provide your direct WhatsApp contact phone number. This lets us verify your node and send instant webhook trial messages.`;
          setMessages(prev => [
            ...prev,
            {
              id: `c_phone`,
              sender: 'chanakya',
              text: msgText,
              timestamp: new Date().toISOString()
            }
          ]);
          speakText(msgText);
        }, 800);
      } else if (contactStep === 'phone') {
        // Complete! Trigger full-scale report compilation
        const finalAnswers = { ...answers, phone: userText } as any;
        setAnswers(finalAnswers);
        setCurrentStep(9); // Loading phase
        setIsTyping(true);
        
        const finalMsgText = `Dhanyavaad. I am now transmitting your pipeline metrics to our system mapping engine, compiling the deterministic parameters, and validating the strategic explanations with Zod schemas. Please stand by for a few seconds.`;
        setMessages(prev => [
          ...prev,
          {
            id: `c_finalizing`,
            sender: 'chanakya',
            text: finalMsgText,
            timestamp: new Date().toISOString()
          }
        ]);
        speakText(finalMsgText);

        try {
          // Trigger the audit endpoint to create the assessment & lead records, aligning both consultation pathways
          const companyWebsite = `www.${(finalAnswers.companyName || 'company').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
          
          let primaryLeak = "response-time";
          const speed = (finalAnswers.responseSpeed || "").toLowerCase();
          if (speed.includes("delay") || speed.includes("hour") || speed.includes("day")) {
            primaryLeak = "response-time";
          } else if (finalAnswers.followUpProcess?.toLowerCase().includes("manual") || finalAnswers.followUpProcess?.toLowerCase().includes("none")) {
            primaryLeak = "follow-up";
          }

          let responseTimeParam = "30m-1h";
          if (speed.includes("instant") || speed.includes("5 sec") || speed.includes("5 min")) {
            responseTimeParam = "instant";
          } else if (speed.includes("hour") || speed.includes("30 min") || speed.includes("2") || speed.includes("3")) {
            responseTimeParam = "30m-1h";
          } else if (speed.includes("same day") || speed.includes("day") || speed.includes("delayed")) {
            responseTimeParam = "same-day";
          } else if (speed.includes("next") || speed.includes("tomorrow")) {
            responseTimeParam = "next-day";
          }

          let adSpendParam = "50k-2l";
          const volume = (finalAnswers.enquiryVolume || "").toLowerCase();
          if (volume.includes("1000") || volume.includes("high") || volume.includes("10l") || volume.includes("many")) {
            adSpendParam = "10l-plus";
          } else if (volume.includes("500") || volume.includes("2l") || volume.includes("hundreds")) {
            adSpendParam = "2l-10l";
          }

          let followUpMethodParam = "manual";
          const fUp = (finalAnswers.followUpProcess || "").toLowerCase();
          if (fUp.includes("none") || fUp.includes("no")) {
            followUpMethodParam = "none";
          } else if (fUp.includes("email") || fUp.includes("basic")) {
            followUpMethodParam = "basic-email";
          }

          // Fetch the audit background metrics concurrently with report generation
          const [auditRes, reportRes] = await Promise.all([
            fetch('/api/chanakya/audit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                companyName: finalAnswers.companyName || "Chanakya Client",
                companyWebsite: companyWebsite,
                primaryLeak: primaryLeak,
                responseTime: responseTimeParam,
                adSpend: adSpendParam,
                followUpMethod: followUpMethodParam,
                contactEmail: finalAnswers.email,
                contactPhone: finalAnswers.phone
              })
            }).catch(e => {
              console.warn("Audit integration background call skipped/failed:", e);
              return null;
            }),
            
            fetch('/api/chanakya/report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...finalAnswers,
                conversationHistory: messages.concat(userMsg)
              })
            })
          ]);

          if (!reportRes || !reportRes.ok) throw new Error("Report generation failed");
          const report = await reportRes.json();
          
          setIsTyping(false);
          // Redirect to report route!
          navigate(`/report/${report.id}`);
        } catch (err) {
          console.error(err);
          // Fallback report ID
          const fallbackId = "rep_fallback";
          navigate(`/report/${fallbackId}`);
        }
      }
    }
  };

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="bg-[#030712] min-h-screen text-white relative overflow-hidden font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      
      {/* Animated geometric background matrix */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" 
      />

      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isConsulting ? (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col items-center"
          >
            {/* ================= PREMIUM HERO VIEW ================= */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-12 text-center max-w-5xl mx-auto space-y-10">
              {/* Small Label */}
              <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/25 text-amber-400 text-[10px] font-mono font-bold tracking-[0.18em] px-3.5 py-1.5 rounded-full uppercase">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                <span>CHANAKYA — LIVE AI REVOPS CONSULTANT</span>
              </div>

              {/* Central Abstract Chanakya Intelligence Orb with Three-point Alignment Geometry */}
              <ChanakyaTalkingOrb
                size="large"
                talkState={talkState}
                isMuted={isMuted}
                isCallActive={socketRef.current !== null}
                onClick={handleTalkNow}
              />

              {/* Headline and Supporting text */}
              <div className="space-y-4 max-w-3xl mx-auto">
                <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                  Talk Business.<br /> Find the Bottleneck.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                    Build the System.
                  </span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                  Speak with Chanakya about your business, leads, follow-up, sales process or automation. Get a practical analysis and recommended RevAstra system.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto pt-2">
                <button
                  onClick={handleTalkNow}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-black tracking-widest text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center space-x-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/10 border border-amber-300/30"
                >
                  <Mic className="w-4.5 h-4.5 text-slate-950" />
                  <span>TALK NOW</span>
                </button>

                <button
                  onClick={handlePreferTyping}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-mono font-bold tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300"
                >
                  Prefer typing instead
                </button>
              </div>

              <p className="text-[10px] font-mono text-slate-500 tracking-wider">
                Chanakya is an AI consultant. You can request a human at any time.
              </p>
            </div>

            {/* ================= 1. CORE PRODUCTS ================= */}
            <div className="w-full max-w-5xl mx-auto px-6 py-16 space-y-12 border-t border-white/5">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">01 / OUR CORE PRODUCTS</span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Engineered for Conversion</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product 1 */}
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-amber-400/20 transition-all duration-300 group flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                      01
                    </div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-400 transition-colors">Lead Intelligence</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Automatically capture, parse, and score inbound enquiries in real time with 100% data integrity. No manual copy-paste. Complete pipeline transparency from millisecond zero.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400/80 group-hover:text-amber-400 font-bold">
                    <span>ACTIVE DEPLOYMENT</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Product 2 */}
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-amber-400/20 transition-all duration-300 group flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                      02
                    </div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-400 transition-colors">Follow-up System</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Deploy multi-channel nurture drips via official WhatsApp API, SMS, and Email. Automatically handle non-responsive leads and drive scheduled callbacks.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400/80 group-hover:text-amber-400 font-bold">
                    <span>ACTIVE DEPLOYMENT</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Product 3 */}
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-amber-400/20 transition-all duration-300 group flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                      03
                    </div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-400 transition-colors">Sales System</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Equip your sales team with automated routing, structured reminders, and unified contact interaction sheets to close pipeline opportunities faster.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400/80 group-hover:text-amber-400 font-bold">
                    <span>ACTIVE DEPLOYMENT</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Product 4 */}
                <div className="p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-amber-400/20 transition-all duration-300 group flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                      04
                    </div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-amber-400 transition-colors">Complete Growth System</h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Connect lead capture, nurturing, and active conversion into a single, cohesive, frictionless customer-acquisition operating loop.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400/80 group-hover:text-amber-400 font-bold">
                    <span>ACTIVE DEPLOYMENT</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 2. PRICING ================= */}
            <div className="w-full max-w-5xl mx-auto px-6 py-16 space-y-12 border-t border-white/5">
              <div className="text-left space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">02 / PRICING PLANS</span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">Transparent System Integration</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Tier 1 */}
                <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col justify-between h-full space-y-8">
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase">Tier 01</div>
                    <h3 className="font-display font-bold text-lg text-white">Saarthi</h3>
                    <p className="text-[10px] font-mono text-amber-400/90 font-bold tracking-wider uppercase">Growth Foundation</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      Essential lead capture automation and foundational pipeline tracking.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-500 font-mono">Includes:</div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 font-mono">
                      <li>✓ Core Database</li>
                      <li>✓ Basic CRM View</li>
                      <li>✓ Daily Logs</li>
                    </ul>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col justify-between h-full space-y-8">
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase">Tier 02</div>
                    <h3 className="font-display font-bold text-lg text-white">Arjuna</h3>
                    <p className="text-[10px] font-mono text-amber-400/90 font-bold tracking-wider uppercase">Growth Accelerator</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      Multi-channel campaign tracking, automated drips, and active sales coordinator controls.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-500 font-mono">Includes:</div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 font-mono">
                      <li>✓ Saarthi Features</li>
                      <li>✓ Auto WhatsApp drips</li>
                      <li>✓ Advanced routing</li>
                    </ul>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border-2 border-amber-400/20 relative flex flex-col justify-between h-full space-y-8">
                  <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-amber-400 text-slate-950 text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded uppercase">
                    POPULAR
                  </div>
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold text-amber-400 uppercase">Tier 03</div>
                    <h3 className="font-display font-bold text-lg text-white">Astra</h3>
                    <p className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase">AI Growth Operating System</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      Full autonomous conversational qualification agents, official API connections, and automated 5-second PDF brochures.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-500 font-mono">Includes:</div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 font-mono">
                      <li>✓ Arjuna Features</li>
                      <li>✓ Custom AI Agent Node</li>
                      <li>✓ Brochure Webhooks</li>
                    </ul>
                  </div>
                </div>

                {/* Tier 4 */}
                <div className="p-6 rounded-2xl bg-slate-900/30 border border-white/5 flex flex-col justify-between h-full space-y-8">
                  <div className="space-y-4">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase">Tier 04</div>
                    <h3 className="font-display font-bold text-lg text-white">Brahmastra</h3>
                    <p className="text-[10px] font-mono text-amber-400/90 font-bold tracking-wider uppercase">Enterprise System</p>
                    <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                      Bespoke system maps, dedicated relational data synchronization, and custom CRM API workflows.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="text-[10px] text-slate-500 font-mono">Includes:</div>
                    <ul className="text-[11px] text-slate-400 space-y-1.5 font-mono">
                      <li>✓ Astra Features</li>
                      <li>✓ Full Customization</li>
                      <li>✓ Dedicated Support SLA</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 3. MINIMAL TRUST ================= */}
            <div className="w-full max-w-5xl mx-auto px-6 py-16 border-t border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">03 / TRUSTED ALIGNMENT</span>
                  <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                    Real-World Operational Strategy
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Software shouldn't sit on a shelf collecting dust. Our customized pipelines are strategically structured for active sales teams, maximizing lead capture speed and conversion integrity.
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-slate-900/25 border border-white/5 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
                        LM
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base text-white">Loukesh Mangla</h4>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Founder & Chief RevOps Designer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center font-mono font-bold text-amber-400 text-sm">
                        LM
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base text-white">Luv Mangla</h4>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">CTO - Chief Technology Officer</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-white/5 text-xs">
                    <div className="flex items-start space-x-3 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>More than eight years of professional creative-production and systems implementation experience.</span>
                    </div>
                    <div className="flex items-start space-x-3 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>Proven experience supporting medical clinics, builders, fitness centres, and high-velocity local businesses.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <a href="mailto:revastraai@gmail.com" className="hover:text-white transition underline">revastraai@gmail.com</a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <a href="tel:+918796067710" className="hover:text-white transition underline">+91 87960 67710</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= 4. FINAL CTA ================= */}
            <div className="w-full max-w-5xl mx-auto px-6 py-20 text-center space-y-8 border-t border-white/5">
              <div className="max-w-3xl mx-auto space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">04 / CORE REALIZATION</span>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  “You Do Not Need More Noise.<br />You Need a Better System.”
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                  Audit your current response speed, discover lead drop-off points, and construct your bespoke pipeline automatically.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto pt-4">
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setIsConsulting(true);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-display font-black tracking-widest text-sm bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center space-x-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/10 border border-amber-300/30"
                >
                  <Bot className="w-4.5 h-4.5 text-slate-950" />
                  <span>TALK NOW</span>
                </button>

                <Link
                  to="/book-strategy-call"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-mono font-bold tracking-widest border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Book a Strategy Call</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (

          /* ================= CONSULTATION PLATFORM TRANSFORMATION ================= */
          <motion.main 
            key="platform"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6"
          >
            {/* Left Column: Monitoring Node Status */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              
              {/* Dynamic Status Orb */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                <ChanakyaTalkingOrb
                  size="medium"
                  talkState={talkState}
                  isMuted={isMuted}
                  isCallActive={socketRef.current !== null}
                  onClick={() => setIsMuted(prev => !prev)}
                />

                <div className="text-center w-full min-w-0">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Chanakya Node Status</span>
                  <h4 className="font-display font-bold text-sm text-white uppercase mt-1">
                    {talkState === 'idle' && "Idle — Standing By"}
                    {talkState === 'listening' && "Listening — Speak Now"}
                    {talkState === 'analysing' && "Analyzing Gaps..."}
                    {talkState === 'speaking' && "Speaking — Audio Active"}
                    {talkState === 'unavailable' && "Voice Control Unavailable"}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    {talkState === 'listening' ? "Awaiting your strategic inputs." : "Ready to map next metrics."}
                  </p>
                </div>
              </div>

              {/* Step Tracker Indicator */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-md flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-xs text-amber-400 tracking-wider uppercase">
                    Bespoke Systems Map
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Chanakya is performing a step-by-step diagnostic audit of your customer pipeline.
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3 my-4">
                  {[
                    { label: "Industry & Context", idx: 0 },
                    { label: "Lead Acquisition Channels", idx: 1 },
                    { label: "Enquiry Intake Scale", idx: 2 },
                    { label: "First Response Speed", idx: 3 },
                    { label: "CRM & Pipelines Hygiene", idx: 4 },
                    { label: "Nurture & Drip process", idx: 5 },
                    { label: "Active Team Capacity", idx: 6 },
                    { label: "Target System Goal", idx: 7 },
                    { label: "Contact Lock (Soft Gate)", idx: 8 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold border ${
                        currentStep > index 
                          ? 'bg-amber-400/20 border-amber-400 text-amber-400' 
                          : currentStep === index 
                          ? 'bg-blue-500/20 border-blue-400 text-blue-400 animate-pulse' 
                          : 'bg-white/5 border-white/10 text-slate-500'
                      }`}>
                        {currentStep > index ? '✓' : index + 1}
                      </div>
                      <span className={`font-mono text-[11px] font-bold ${
                        currentStep === index 
                          ? 'text-white' 
                          : currentStep > index 
                          ? 'text-slate-400' 
                          : 'text-slate-600'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Secure seal */}
                <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-mono">
                    Verifiable cryptographic score compilation securely backed on local database state.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Consultation Console */}
            <div className="lg:col-span-8 flex flex-col bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden min-h-[500px]">
              
              {/* Active Transcript Header */}
              <div className="bg-slate-950/80 p-4 border-b border-white/5 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-slate-400 font-bold uppercase tracking-wider">
                    CHANAKYA SYSTEMS CONSULTING SESSION
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Voice accent selectors */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                    {(['hinglish', 'english', 'hindi'] as const).map(style => (
                      <button
                        key={style}
                        onClick={() => {
                          setVoiceStyle(style);
                          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                        }}
                        className={`px-2 py-1 rounded text-[9px] font-mono font-bold transition uppercase ${
                          voiceStyle === style 
                            ? 'bg-amber-400 text-slate-950' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>

                  {/* Speaker audio controls */}
                  <button
                    onClick={() => {
                      const val = !isMuted;
                      setIsMuted(val);
                      if (val && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                    className={`p-1.5 rounded-lg border transition ${
                      isMuted 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Message Streams */}
              <div className="flex-grow p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[440px] min-h-[360px] bg-slate-950/20">
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} items-start space-x-3`}
                  >
                    {m.sender === 'chanakya' && (
                      <div className="w-7 h-7 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-4.5 h-4.5 text-amber-400" />
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-amber-400 text-slate-950 rounded-tr-none font-medium'
                        : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
                    }`}>
                      <p className="whitespace-pre-line font-medium leading-relaxed">{m.text}</p>
                      
                      <div className="flex justify-between items-center mt-2 pt-1 border-t border-white/5 text-[9px] text-slate-500 font-mono">
                        <span>{m.sender === 'user' ? 'GUEST' : 'CHANAKYA'}</span>
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center space-x-2.5 text-slate-400">
                    <div className="w-7 h-7 rounded-full bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-amber-400 animate-spin" />
                    </div>
                    <div className="flex space-x-1 py-1">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Console Input Controller */}
              <div className="p-4 border-t border-white/5 bg-slate-950/60">
                {currentStep === 9 ? (
                  <div className="p-6 text-center space-y-4 max-w-md mx-auto">
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                    <h5 className="font-display font-bold text-base text-white">
                      COMPILING BESPOKE SYSTEMS AUDIT REPORT
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Running deterministic scoring algorithms, mapping pipeline workflow connections, and calling validated Zod Gemini explanations. Please don't close this node.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2.5">
                      {/* Chanakya VoIP Call Controls */}
                      {socketRef.current ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setIsMuted(prev => !prev)}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isMuted 
                                ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 animate-pulse'
                            }`}
                            title={isMuted ? "Unmute microphone" : "Mute microphone"}
                          >
                            {isMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                          </button>
                          
                          <button
                            onClick={stopVoiceSession}
                            className="p-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all flex items-center space-x-1"
                            title="End voice call & switch to typing"
                          >
                            <PhoneOff className="w-4.5 h-4.5 animate-pulse" />
                            <span className="text-[10px] font-bold font-mono">END CALL</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={startVoiceSession}
                          className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all flex items-center space-x-1"
                          title="Switch to real-time voice call"
                        >
                          <Mic className="w-4.5 h-4.5 text-amber-400" />
                          <span className="text-[10px] font-bold font-mono text-slate-300">TALK BY VOICE</span>
                        </button>
                      )}

                      {/* Text Box */}
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={
                          currentStep < 8 
                            ? QUESTIONS[currentStep].placeholder 
                            : contactStep === 'name' ? "Enter your full name..."
                            : contactStep === 'company' ? "Enter registered company name..."
                            : contactStep === 'email' ? "Enter corporate business email..."
                            : "Enter direct WhatsApp phone number..."
                        }
                        className="flex-1 bg-white/5 border border-white/10 focus:outline-none focus:border-amber-400 focus:bg-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white font-medium"
                      />

                      {/* Transmit action */}
                      <button
                        onClick={handleSend}
                        disabled={!inputVal.trim()}
                        className="p-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-white/5 text-slate-950 disabled:text-slate-600 transition shadow"
                      >
                        <Send className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-1">
                      <span>
                        Verify inputs prior to transmission. Press Enter to submit.
                      </span>

                      <button
                        onClick={() => setIsConsulting(false)}
                        className="text-slate-400 hover:text-white hover:underline transition uppercase font-bold"
                      >
                        Close Consultation Workspace
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer copyright section */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-mono text-[10px] tracking-widest uppercase">
          © 2026 REVASTRA AI • SYSTEM PROTOCOL NODE
        </p>

        <div className="flex items-center space-x-6 font-mono font-bold tracking-wider text-slate-400">
          <Link to="/solutions" className="hover:text-amber-400 transition flex items-center space-x-1">
            <span>Products</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link to="/packages" className="hover:text-amber-400 transition flex items-center space-x-1">
            <span>Pricing</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
          <Link to="/book-strategy-call" className="hover:text-amber-400 transition flex items-center space-x-1">
            <span>Book a Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </footer>

    </div>
  );
}
