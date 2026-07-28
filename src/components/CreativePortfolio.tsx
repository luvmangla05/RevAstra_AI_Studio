/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Eye, Video, Sparkles, Target, ArrowRight } from 'lucide-react';

export default function CreativePortfolio() {
  const portfolioItems = [
    {
      id: 'p1',
      title: "Real Estate Drone Tour",
      objective: "Demonstration site-visit booking flow",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      tag: "DRONE & AERIAL EDITING",
      isDemo: true
    },
    {
      id: 'p2',
      title: "Luxury Duplex Interior Walkthrough",
      objective: "Social media vertical reel optimization",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      tag: "VERTICAL REELS & COLOR GRADING",
      isDemo: true
    },
    {
      id: 'p3',
      title: "Boutique Resort Promotional Spot",
      objective: "Bypass OTA commission booking funnel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      tag: "COMMERCIAL BRAND FILM",
      isDemo: true
    },
    {
      id: 'p4',
      title: "New Media Asset Library",
      objective: "Vetted client showcase portfolio item",
      image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=800&q=80",
      tag: "PIPELINE MEDIA ASSET",
      isComingSoon: true
    },
    {
      id: 'p5',
      title: "Hospitality Virtual Showroom",
      objective: "Self-booking calendar integration",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      tag: "INTERACTIVE SHOWROOMS",
      isComingSoon: true
    }
  ];

  return (
    <section className="py-24 bg-dark-ink text-white relative overflow-hidden" id="creative-portfolio">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[#C5A880]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-[11px] font-mono tracking-widest text-[#C5A880] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            Creative Production Strip
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Cinematic Mediums. Performance Driven.
          </h2>
          <p className="text-slate-400 text-lg">
            We produce premium property walkthroughs, aerial assets, and brand films designed to capture high-intent buyer actions.
          </p>
        </div>

        {/* Portfolio Horizontal Scroll Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {portfolioItems.map((item, idx) => (
            <div 
              key={idx} 
              className={`group bg-slate-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 relative ${
                item.isComingSoon ? 'opacity-40 select-none' : 'hover:border-white/15'
              }`}
            >
              <div className="relative aspect-video lg:aspect-square overflow-hidden bg-black">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-80" />
                
                {/* Visual Label Indicator */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    item.isComingSoon 
                      ? 'bg-white/10 text-slate-400' 
                      : 'bg-[#C5A880] text-black'
                  }`}>
                    {item.isComingSoon ? "Coming Soon" : "Interactive Demo"}
                  </span>
                </div>
              </div>

              {/* Bottom text info block */}
              <div className="p-5 space-y-4 flex flex-col justify-between flex-grow">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-[#C5A880] font-bold tracking-wider block">
                    {item.tag}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.objective}
                  </p>
                </div>

                {!item.isComingSoon ? (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500 font-bold group-hover:text-[#C5A880] transition">
                    <span className="font-mono text-[9px] uppercase tracking-wider">PREVIEW WORKFLOW</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    RESERVED CAMPAIGN STATE
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
