/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Play, Pause, Zap, Cpu, RefreshCw, HelpCircle, 
  Sparkles, ChevronRight, MessageSquare, ArrowRight,
  Target, TrendingUp, ShieldAlert, CheckCircle2
} from 'lucide-react';

// Define the core pillars of the RevAstra Trishul (Trident)
interface TrishulNode {
  id: string;
  label: string;
  title: string;
  desc: string;
  detail: string;
  diagnostic: string;
  icon: string;
  color: string;
}

const trishulNodes: TrishulNode[] = [
  {
    id: 'ai_core',
    label: 'Chanakya AI Core',
    title: 'The AI Neural Foundation (Trishul Base)',
    desc: 'The intelligent operating system acting as the single source of truth.',
    detail: 'An autonomous, multi-agent AI brain trained on your business inventory, pricing, and guidelines. It captures leads instantly from any marketing channel (Meta, Google, Web, QR codes) and acts as the master conductor routing data in real-time.',
    diagnostic: 'Replaces manual copy-pasting of sheets and ensures a 0.2-second instant lead capture webhook trigger.',
    icon: 'Cpu',
    color: '#D4AF37'
  },
  {
    id: 'lead_scoring',
    label: 'Lead Scoring System',
    title: 'Intellectual Qualification (Left Prong)',
    desc: 'Separating high-intent buyers from casual tire-kickers with 99% accuracy.',
    detail: 'Using NLP and interactive qualifying forms, our system scores prospects based on location intent, budget bracket, timeline, and communication responsiveness. High-intent leads are flagged instantly, while cold records are routed to nurture.',
    diagnostic: 'Cuts down agent fatigue by 60%, allowing them to talk only to genuine, pre-qualified buyers.',
    icon: 'Target',
    color: '#64748B'
  },
  {
    id: 'followup',
    label: 'Follow-up System',
    title: 'Speed-to-Lead Automation (Center Prong)',
    desc: 'Solving the 5-minute response leak with multi-channel automation.',
    detail: 'The moment a lead is captured, our automated system triggers an instant, personalized welcome sequence. It delivers catalogs, answers FAQs, and provides self-booking links via WhatsApp Business API and Email inside 5 seconds.',
    diagnostic: 'Shrinks average response time from 4 hours to 5 seconds, boosting site visit booking rates by up to 83%.',
    icon: 'MessageSquare',
    color: '#D4AF37'
  },
  {
    id: 'sales_closing',
    label: 'Sales Closing System',
    title: 'Unified Deal Pipelines (Right Prong)',
    desc: 'High-visibility agent handoff, scheduling, and conversion analytics.',
    detail: 'Automatically distributes qualified leads to agents via intelligent round-robin rules. Features a fully-synchronized Kanban pipeline tracking site visits, bookings, and agent-lead transcripts with auto-generated summaries.',
    diagnostic: 'Eliminates lead leaks entirely and gives business owners 100% visibility into sales activity and ROI.',
    icon: 'TrendingUp',
    color: '#64748B'
  }
];

// WebGL support helper
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Custom 3D Glowing Hotspot Component
interface HotspotProps {
  id: string;
  position: [number, number, number];
  label: string;
  active: boolean;
  setHoveredNode: (id: string | null) => void;
}

function TrishulHotspot({ id, position, label, active, setHoveredNode }: HotspotProps) {
  const [localHovered, setLocalHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      // Breathe scale gently, swelling when active or hovered
      const scale = (active || localHovered) ? 1.35 + Math.sin(t * 6) * 0.12 : 1.0 + Math.sin(t * 3) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  const isCurrentActive = active || localHovered;

  return (
    <group 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setLocalHovered(true);
        setHoveredNode(id);
      }}
      onPointerOut={() => {
        setLocalHovered(false);
        setHoveredNode(null);
      }}
    >
      {/* Outer Halo ring */}
      <mesh>
        <torusGeometry args={[0.22, 0.015, 8, 32]} />
        <meshBasicMaterial 
          color={isCurrentActive ? "#D4AF37" : "#64748B"} 
          transparent 
          opacity={isCurrentActive ? 0.9 : 0.2} 
        />
      </mesh>

      {/* Internal core glow sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={isCurrentActive ? "#D4AF37" : "#0F172A"}
          emissive={isCurrentActive ? "#D4AF37" : "#1e293b"}
          emissiveIntensity={isCurrentActive ? 1.8 : 0.15}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* HTML Tag */}
      <Html distanceFactor={8} position={[0, 0.38, 0]} center>
        <div
          className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 pointer-events-none whitespace-nowrap ${
            isCurrentActive 
              ? 'bg-astra-navy text-astra-gold border border-astra-gold scale-110 shadow-lg font-extrabold' 
              : 'bg-white/90 text-slate-500 border border-slate-200 shadow-xs'
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

// Individual Animated Flowing Energy Particle
function TrishulParticle({ delay, isAnimating }: { delay: number; isAnimating: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pathIndexRef = useRef<number>(Math.floor(Math.random() * 3));
  const speed = 0.35; // particle propagation speed

  useFrame((state) => {
    if (!meshRef.current || !isAnimating) return;

    // Normalize progress time to a 0.0 - 1.0 interval
    const t = (state.clock.getElapsedTime() * speed + delay) % 1.0;
    
    let x = 0;
    let y = 0;
    let z = 0;

    // Phase 1: Climb the main shaft (0.0 to 0.4 progress)
    // Travels from base [0, -1.8, 0] to AI Neural Hub [0, 0.075, 0]
    if (t < 0.4) {
      const f = t / 0.4;
      x = 0;
      y = -1.8 + f * (0.075 - (-1.8));
      z = 0;
    } 
    // Phase 2: Route up to one of the 3 prongs (0.4 to 1.0 progress)
    else {
      const f = (t - 0.4) / 0.6;
      const path = pathIndexRef.current;

      if (path === 1) {
        // Center Prong (Follow-up): Flows straight up to tip [0, 1.95, 0]
        x = 0;
        y = 0.075 + f * (1.95 - 0.075);
        z = 0;
      } else if (path === 0) {
        // Left Prong (Lead Scoring): Arching to left [-0.9, 0.6, 0] and then up to [-0.9, 1.45, 0]
        if (f < 0.4) {
          const innerF = f / 0.4;
          x = 0 + innerF * -0.9;
          y = 0.075 + innerF * (0.6 - 0.075);
        } else {
          const innerF = (f - 0.4) / 0.6;
          x = -0.9;
          y = 0.6 + innerF * (1.45 - 0.6);
        }
        z = 0;
      } else {
        // Right Prong (Sales Closing): Arching to right [0.9, 0.6, 0] and then up to [0.9, 1.45, 0]
        if (f < 0.4) {
          const innerF = f / 0.4;
          x = 0 + innerF * 0.9;
          y = 0.075 + innerF * (0.6 - 0.075);
        } else {
          const innerF = (f - 0.4) / 0.6;
          x = 0.9;
          y = 0.6 + innerF * (1.45 - 0.6);
        }
        z = 0;
      }
    }

    meshRef.current.position.set(x, y, z);
    
    // Scale particles nicely near endpoints
    const size = t < 0.1 ? (t / 0.1) * 0.03 : t > 0.9 ? ((1.0 - t) / 0.1) * 0.03 : 0.03;
    meshRef.current.scale.set(size, size, size);

    // Pick a new path when resetting
    if (t < 0.015) {
      pathIndexRef.current = Math.floor(Math.random() * 3);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.75} />
    </mesh>
  );
}

// 3D Trishul Structural Geometry Model
interface TrishulModelProps {
  isAnimating: boolean;
  hoveredNode: string | null;
  setHoveredNode: (id: string | null) => void;
}

function Trishul3DModel({ isAnimating, hoveredNode, setHoveredNode }: TrishulModelProps) {
  const modelGroupRef = useRef<THREE.Group>(null);
  const coreHaloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (modelGroupRef.current && isAnimating) {
      // Gentle floating/breathing rotation
      modelGroupRef.current.rotation.y = Math.sin(t * 0.25) * 0.15;
      modelGroupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }
    if (coreHaloRef.current) {
      coreHaloRef.current.rotation.z = -t * 0.6;
    }
  });

  // Position offsets matching Trishul dimensions
  const aiCorePos: [number, number, number] = [0, 0.075, 0];
  const leadScoringPos: [number, number, number] = [-0.9, 1.45, 0];
  const followupPos: [number, number, number] = [0, 1.95, 0];
  const salesClosingPos: [number, number, number] = [0.9, 1.45, 0];

  return (
    <group ref={modelGroupRef} position={[0, -0.2, 0]}>
      {/* 1. Main Base Shaft Cylinder */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 2.0, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 2. AI Core (Damru / Neural Hub) in the middle */}
      <group position={[0, 0.075, 0]}>
        {/* Top inverted cone */}
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.22, 16]} />
          <meshStandardMaterial 
            color="#0F172A" 
            roughness={0.2} 
            metalness={0.9} 
            emissive={hoveredNode === 'ai_core' ? '#D4AF37' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Bottom cone */}
        <mesh position={[0, -0.12, 0]}>
          <coneGeometry args={[0.18, 0.22, 16]} />
          <meshStandardMaterial 
            color="#0F172A" 
            roughness={0.2} 
            metalness={0.9} 
            emissive={hoveredNode === 'ai_core' ? '#D4AF37' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Middle accent band */}
        <mesh>
          <torusGeometry args={[0.08, 0.025, 8, 16]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Orbital Halo ring */}
        <mesh ref={coreHaloRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[0.3, 0.01, 8, 32]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 3. Horizontal Trishul Crossbar Arch */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.032, 0.032, 1.8, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Curved elbows for classic Indian visual style */}
      <mesh position={[-0.9, 0.6, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.9, 0.6, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* Left Vertical Prong Shaft */}
      <mesh position={[-0.9, 0.9, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.6, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Right Vertical Prong Shaft */}
      <mesh position={[0.9, 0.9, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.6, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Center Vertical Prong Shaft */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.0, 16]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 4. Sharp Spear Tips (Golden) */}
      {/* Left Spearhead */}
      <mesh position={[-0.9, 1.25, 0]}>
        <coneGeometry args={[0.08, 0.3, 16]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.1} 
          metalness={0.9}
          emissive={hoveredNode === 'lead_scoring' ? '#D4AF37' : '#000000'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Right Spearhead */}
      <mesh position={[0.9, 1.25, 0]}>
        <coneGeometry args={[0.08, 0.3, 16]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.1} 
          metalness={0.9}
          emissive={hoveredNode === 'sales_closing' ? '#D4AF37' : '#000000'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Center Spearhead (Larger & More Prominent) */}
      <mesh position={[0, 1.65, 0]}>
        <coneGeometry args={[0.1, 0.4, 16]} />
        <meshStandardMaterial 
          color="#D4AF37" 
          roughness={0.1} 
          metalness={0.9}
          emissive={hoveredNode === 'followup' ? '#D4AF37' : '#000000'}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 5. Particle Systems flowing within the Trishul */}
      <group>
        {Array.from({ length: 15 }).map((_, idx) => (
          <TrishulParticle 
            key={idx} 
            delay={idx / 15} 
            isAnimating={isAnimating} 
          />
        ))}
      </group>

      {/* 6. Interactive Hotspots Overlay */}
      <TrishulHotspot 
        id="ai_core" 
        position={aiCorePos} 
        label="AI Growth Core" 
        active={hoveredNode === 'ai_core'} 
        setHoveredNode={setHoveredNode}
      />
      <TrishulHotspot 
        id="lead_scoring" 
        position={leadScoringPos} 
        label="Lead Scoring" 
        active={hoveredNode === 'lead_scoring'} 
        setHoveredNode={setHoveredNode}
      />
      <TrishulHotspot 
        id="followup" 
        position={followupPos} 
        label="Follow-up" 
        active={hoveredNode === 'followup'} 
        setHoveredNode={setHoveredNode}
      />
      <TrishulHotspot 
        id="sales_closing" 
        position={salesClosingPos} 
        label="Sales Closing" 
        active={hoveredNode === 'sales_closing'} 
        setHoveredNode={setHoveredNode}
      />
    </group>
  );
}

export default function RevOpsEngine() {
  const [use3D, setUse3D] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>('ai_core');

  // Auto-detect WebGL support on mount
  useEffect(() => {
    if (!isWebGLAvailable()) {
      setUse3D(false);
    }
  }, []);

  const activeNodeData = trishulNodes.find(n => n.id === (hoveredNode || 'ai_core'));

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-lg overflow-hidden flex flex-col h-full min-h-[520px]">
      
      {/* Control Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 sm:px-6 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-astra-gold animate-pulse" />
          <div>
            <h4 className="font-display font-extrabold text-sm text-astra-navy tracking-tight flex items-center">
              <span>REVASTRA AI TRISHUL REVOPS ENGINE</span>
              <span className="ml-2 text-[9px] font-mono bg-astra-navy text-astra-gold px-1.5 py-0.2 rounded uppercase">
                Interactive
              </span>
            </h4>
            <p className="text-[10px] text-slate-400 font-mono">3-Pronged Growth Architecture</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Pause/Play (3D only) */}
          {use3D && (
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-astra-navy hover:bg-slate-50 transition"
              title={isAnimating ? 'Pause Flow animation' : 'Start Flow animation'}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Toggle 3D / 2D fallback */}
          <button
            onClick={() => setUse3D(!use3D)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              use3D 
                ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                : 'bg-astra-navy border-astra-navy text-white shadow-xs'
            }`}
            title="Toggle Engine Presentation Mode"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{use3D ? 'Vector Blueprint' : 'Interactive 3D'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage & Diagnostics Board */}
      <div className="flex-grow flex flex-col md:flex-row relative min-h-[420px]">
        
        {/* Render interactive canvas or fallback */}
        <div className="flex-grow relative h-[360px] md:h-auto md:w-3/5 bg-slate-50/40 border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 geo-pattern opacity-[0.03] pointer-events-none" />

          {use3D ? (
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-slate-400">
                  <div className="w-6 h-6 border-2 border-t-astra-gold border-slate-200 rounded-full animate-spin mb-2" />
                  Initializing 3D Core...
                </div>
              }>
                <Canvas camera={{ position: [0, 1.8, 4.0], fov: 50 }}>
                  <ambientLight intensity={0.6} />
                  <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
                  <pointLight position={[0, 0, 0]} intensity={1.5} color="#D4AF37" />
                  
                  <group position={[0, -0.6, 0]}>
                    <Trishul3DModel 
                      isAnimating={isAnimating}
                      hoveredNode={hoveredNode}
                      setHoveredNode={setHoveredNode}
                    />
                  </group>

                  <OrbitControls 
                    enableZoom={false} 
                    maxPolarAngle={Math.PI / 1.8} 
                    minPolarAngle={Math.PI / 6} 
                  />
                </Canvas>
              </Suspense>
            </div>
          ) : (
            /* High-Fidelity Responsive Vector (SVG) Trishul */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-6">
              <div className="relative w-full max-w-[280px] aspect-[4/5] flex items-center justify-center bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
                
                {/* SVG Trishul Diagram with 3D Gradients & Filters */}
                <svg viewBox="0 0 200 240" className="w-full h-full text-slate-300 overflow-visible">
                  <defs>
                    {/* Glowing filter for nodes */}
                    <filter id="svg-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    
                    {/* Intense Gold Glow Filter */}
                    <filter id="gold-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur1" />
                      <feGaussianBlur stdDeviation="8" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Bevel Drop Shadow for 3D realism */}
                    <filter id="shadow-bevel" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.25" />
                    </filter>

                    {/* Metallic Steel Linear Gradient (Trident Rods) */}
                    <linearGradient id="metal-steel" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0B0F19" />
                      <stop offset="30%" stopColor="#334155" />
                      <stop offset="50%" stopColor="#64748B" />
                      <stop offset="70%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#0B0F19" />
                    </linearGradient>

                    {/* Metallic Gold Linear Gradient (Trident Tips) */}
                    <linearGradient id="metal-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8A661F" />
                      <stop offset="25%" stopColor="#D4AF37" />
                      <stop offset="50%" stopColor="#FFF3A8" />
                      <stop offset="75%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#8A661F" />
                    </linearGradient>
                    
                    {/* Dark Obsidian Linear Gradient */}
                    <linearGradient id="dark-obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="50%" stopColor="#0F172A" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>

                    {/* Golden Radial Glow */}
                    <radialGradient id="gold-radial" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F3C63F" stopOpacity="0.65" />
                      <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Embedding custom stylesheet for high-fidelity animations */}
                  <style>{`
                    @keyframes svg-flow-up {
                      0% { stroke-dashoffset: 32; }
                      100% { stroke-dashoffset: 0; }
                    }
                    @keyframes svg-pulse {
                      0%, 100% { opacity: 0.35; transform: scale(1); }
                      50% { opacity: 0.85; transform: scale(1.15); }
                    }
                    @keyframes svg-rotate {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    .svg-animate-flow {
                      stroke-dasharray: 6, 10;
                      animation: svg-flow-up 2.2s linear infinite;
                    }
                    .svg-animate-pulse {
                      animation: svg-pulse 3s ease-in-out infinite;
                      transform-origin: 100px 135px;
                    }
                    .svg-animate-rotate {
                      animation: svg-rotate 12s linear infinite;
                      transform-origin: 100px 135px;
                    }
                  `}</style>

                  {/* Dynamic Glowing Energy Background Behind Trishul Base */}
                  <g className="svg-animate-pulse">
                    <circle cx="100" cy="135" r="38" fill="url(#gold-radial)" />
                  </g>

                  {/* Flow animation path line indicators */}
                  <path d="M 100 215 L 100 135" stroke="#F3C63F" strokeWidth="1.5" strokeOpacity="0.5" className="svg-animate-flow" />
                  <path d="M 100 135 C 70 135, 45 135, 45 100 L 45 55" fill="none" stroke="#F3C63F" strokeWidth="1.5" strokeOpacity="0.5" className="svg-animate-flow" />
                  <path d="M 100 135 C 130 135, 155 135, 155 100 L 155 55" fill="none" stroke="#F3C63F" strokeWidth="1.5" strokeOpacity="0.5" className="svg-animate-flow" />

                  {/* 1. Base shaft cylinder with metallic gradient and drop-shadow */}
                  <rect x="97" y="130" width="6" height="85" rx="3" fill="url(#metal-steel)" filter="url(#shadow-bevel)" />
                  
                  {/* 2. Ornate Crossbar Arch */}
                  <path d="M 42 98 Q 100 148 158 98" fill="none" stroke="url(#metal-steel)" strokeWidth="5.5" strokeLinecap="round" filter="url(#shadow-bevel)" />
                  
                  {/* Elbow connectors */}
                  <circle cx="45" cy="98" r="3.5" fill="url(#metal-steel)" />
                  <circle cx="155" cy="98" r="3.5" fill="url(#metal-steel)" />

                  {/* 3. Prongs (Vertical Columns) */}
                  <rect x="42.5" y="55" width="5" height="43" rx="2.5" fill="url(#metal-steel)" filter="url(#shadow-bevel)" />
                  <rect x="152.5" y="55" width="5" height="43" rx="2.5" fill="url(#metal-steel)" filter="url(#shadow-bevel)" />
                  <rect x="97" y="95" width="6" height="40" rx="3" fill="url(#metal-steel)" filter="url(#shadow-bevel)" />

                  {/* 4. Golden Spearheads */}
                  {/* Left Spearhead (Lead Scoring) */}
                  <g transform="translate(45, 38)" filter="url(#shadow-bevel)" className="transition-all duration-300">
                    <path d="M 0 -13 L 6 12 L -6 12 Z" fill="url(#metal-gold)" />
                    {/* Reflective light facet */}
                    <path d="M 0 -13 L 0 12 L -6 12 Z" fill="#FFFFFF" fillOpacity="0.2" />
                  </g>

                  {/* Right Spearhead (Sales Closing) */}
                  <g transform="translate(155, 38)" filter="url(#shadow-bevel)" className="transition-all duration-300">
                    <path d="M 0 -13 L 6 12 L -6 12 Z" fill="url(#metal-gold)" />
                    {/* Reflective light facet */}
                    <path d="M 0 -13 L 0 12 L -6 12 Z" fill="#FFFFFF" fillOpacity="0.2" />
                  </g>

                  {/* Center Spearhead (Follow-up - Larger and more prominent) */}
                  <g transform="translate(100, 18)" filter="url(#shadow-bevel)" className="transition-all duration-300">
                    <path d="M 0 -17 L 8 16 L -8 16 Z" fill="url(#metal-gold)" />
                    {/* Reflective light facet */}
                    <path d="M 0 -17 L 0 16 L -8 16 Z" fill="#FFFFFF" fillOpacity="0.25" />
                  </g>

                  {/* Damru Hourglass Central Node (Neural Core) */}
                  <g transform="translate(100, 135)" filter="url(#shadow-bevel)">
                    {/* Double-cone/Damru shape */}
                    <polygon points="-11,-14 11,-14 0,0" fill="url(#dark-obsidian)" stroke="#D4AF37" strokeWidth="0.8" />
                    <polygon points="-11,14 11,14 0,0" fill="url(#dark-obsidian)" stroke="#D4AF37" strokeWidth="0.8" />
                    {/* Center gold band */}
                    <rect x="-4" y="-1.5" width="8" height="3" fill="url(#metal-gold)" />
                    {/* Golden core light sphere */}
                    <circle r="4.5" fill="#FFFFFF" filter="url(#gold-neon-glow)" />
                  </g>

                  {/* Orbital Halos rotating around core */}
                  <ellipse cx="100" cy="135" rx="20" ry="8" fill="none" stroke="#D4AF37" strokeWidth="0.75" strokeOpacity="0.45" transform="rotate(-20 100 135)" className="svg-animate-rotate" />

                  {/* 5. SVG Interactive Hotspot Buttons inside the drawing */}
                  {/* Left Hotspot (Lead Scoring) */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => setHoveredNode('lead_scoring')}
                    onMouseEnter={() => setHoveredNode('lead_scoring')}
                  >
                    <circle cx="45" cy="55" r="14" fill={hoveredNode === 'lead_scoring' ? '#D4AF37' : '#FFFFFF'} stroke="#0F172A" strokeWidth="1.5" className="transition-all duration-300 shadow-sm" />
                    {/* Active internal pulse */}
                    {hoveredNode === 'lead_scoring' ? (
                      <circle cx="45" cy="55" r="7" fill="#FFFFFF" filter="url(#svg-glow)" className="animate-ping" />
                    ) : null}
                    <circle cx="45" cy="55" r="4.5" fill={hoveredNode === 'lead_scoring' ? '#0F172A' : '#64748B'} />
                  </g>

                  {/* Center Hotspot (Follow-up) */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => setHoveredNode('followup')}
                    onMouseEnter={() => setHoveredNode('followup')}
                  >
                    <circle cx="100" cy="30" r="14" fill={hoveredNode === 'followup' ? '#D4AF37' : '#FFFFFF'} stroke="#0F172A" strokeWidth="1.5" className="transition-all duration-300 shadow-sm" />
                    {/* Active internal pulse */}
                    {hoveredNode === 'followup' ? (
                      <circle cx="100" cy="30" r="7" fill="#FFFFFF" filter="url(#svg-glow)" className="animate-ping" />
                    ) : null}
                    <circle cx="100" cy="30" r="4.5" fill={hoveredNode === 'followup' ? '#0F172A' : '#64748B'} />
                  </g>

                  {/* Right Hotspot (Sales Closing) */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => setHoveredNode('sales_closing')}
                    onMouseEnter={() => setHoveredNode('sales_closing')}
                  >
                    <circle cx="155" cy="55" r="14" fill={hoveredNode === 'sales_closing' ? '#D4AF37' : '#FFFFFF'} stroke="#0F172A" strokeWidth="1.5" className="transition-all duration-300 shadow-sm" />
                    {/* Active internal pulse */}
                    {hoveredNode === 'sales_closing' ? (
                      <circle cx="155" cy="55" r="7" fill="#FFFFFF" filter="url(#svg-glow)" className="animate-ping" />
                    ) : null}
                    <circle cx="155" cy="55" r="4.5" fill={hoveredNode === 'sales_closing' ? '#0F172A' : '#64748B'} />
                  </g>

                  {/* AI Base Hotspot */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => setHoveredNode('ai_core')}
                    onMouseEnter={() => setHoveredNode('ai_core')}
                  >
                    <circle cx="100" cy="135" r="14" fill={hoveredNode === 'ai_core' ? '#D4AF37' : '#FFFFFF'} stroke="#0F172A" strokeWidth="1.5" className="transition-all duration-300 shadow-sm" />
                    {/* Active internal pulse */}
                    {hoveredNode === 'ai_core' ? (
                      <circle cx="100" cy="135" r="7" fill="#FFFFFF" filter="url(#svg-glow)" className="animate-ping" />
                    ) : null}
                    <circle cx="100" cy="135" r="4.5" fill={hoveredNode === 'ai_core' ? '#0F172A' : '#64748B'} />
                  </g>
                </svg>

                {/* Micro instructions overlay */}
                <span className="absolute bottom-2 text-[9px] font-mono text-slate-400">
                  Click any node above to inspect systems
                </span>
              </div>

              {/* Pill Selectors */}
              <div className="flex flex-wrap justify-center gap-1.5 w-full max-w-sm">
                {trishulNodes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setHoveredNode(n.id)}
                    className={`px-2.5 py-1.5 border rounded-xl text-[10px] font-bold tracking-tight transition ${
                      hoveredNode === n.id 
                        ? 'bg-astra-navy text-white border-astra-navy shadow-sm' 
                        : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            </div>
          ) }

          {/* Status Indicator */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-[8px] font-mono tracking-widest uppercase text-slate-400 bg-white/75 backdrop-blur-md px-2.5 py-1 rounded border border-slate-100/80">
            <Zap className="w-2.5 h-2.5 text-astra-gold animate-pulse mr-1" />
            <span>AI ENGINE: {use3D ? '3D RENDERER ACTIVE' : 'VECTOR BLUEPRINT ACTIVE'}</span>
          </div>
        </div>

        {/* Dynamic Information Diagnostics Board */}
        <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase bg-astra-navy text-white px-2.5 py-1 rounded-md font-bold tracking-wider inline-block">
                SYSTEM AUDIT
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-[9px] font-mono text-slate-500 font-semibold uppercase">
                Active Weapon
              </span>
            </div>
            
            {activeNodeData && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <span className="font-display font-extrabold text-base text-astra-navy uppercase tracking-tight">
                    {activeNodeData.label}
                  </span>
                </div>
                
                <h5 className="font-display font-bold text-xs text-astra-gold uppercase tracking-wider">
                  {activeNodeData.title}
                </h5>
                
                <div className="space-y-2">
                  <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                    {activeNodeData.desc}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {activeNodeData.detail}
                  </p>
                </div>

                {/* Leakage Resolution Flag */}
                <div className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-amber-800 text-[10px] font-bold font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 text-astra-gold" />
                    <span>LEAK RESOLVED:</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    {activeNodeData.diagnostic}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Callout */}
          <div className="bg-astra-navy text-white p-4.5 rounded-2xl border border-white/5 space-y-3.5 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-transparent to-astra-gold/10 rounded-bl-full" />
            <span className="text-[9px] font-mono text-astra-gold uppercase tracking-widest font-bold block">
              Trishul Deployments
            </span>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Equip your sales team with Chanakya AI. Deploy Lead Scoring, Followups, and Closing systems built around your team.
            </p>
            <div className="flex justify-end pt-1">
              <a 
                href="#/book-strategy-call" 
                className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-astra-navy bg-astra-gold px-3.5 py-1.8 rounded-md transition hover:bg-white hover:text-astra-navy shadow-xs"
              >
                <span>Deploy My Systems</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
