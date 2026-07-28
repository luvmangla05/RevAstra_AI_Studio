/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WisdomSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const quotes = [
    {
      text: "More leads cannot repair a broken follow-up process.",
      topic: "Pipeline Integrity"
    },
    {
      text: "In a digital economy, the speed of your first response is the multiplier of your conversion.",
      topic: "Operational Velocity"
    },
    {
      text: "Storytelling creates attention; systems convert attention into booked appointments.",
      topic: "Revenue Alignment"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const currentQuote = quotes[currentIndex];

  return (
    <div className="py-24 bg-[#FDFBF7] text-astra-navy border-y border-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Editorial background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-100/30 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
        
        {/* Dynamic Category Label */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase block font-bold">
            STRATEGIC INTEL - {currentQuote.topic.toUpperCase()}
          </span>
          <div className="w-12 h-0.5 bg-[#C5A880]/30 mx-auto mt-2" />
        </div>

        {/* Serif Quote Text Block */}
        <div className="min-h-[160px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <blockquote className="font-serif text-3xl sm:text-5xl font-light text-slate-800 leading-tight tracking-tight max-w-3xl mx-auto italic">
                “{currentQuote.text}”
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimal Navigation & Progress Indicators */}
        <div className="flex items-center justify-center space-x-6 pt-4">
          <button 
            onClick={handlePrev}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition"
            aria-label="Previous insight"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Thin progress bars */}
          <div className="flex space-x-2">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-0.5 transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#C5A880]' : 'w-4 bg-slate-200'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="p-1 rounded-full text-slate-400 hover:text-slate-800 transition"
            aria-label="Next insight"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
