/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll, useTransform, motion } from 'motion/react';
import { 
  Play, Pause, Zap, Cpu, RefreshCw, Sparkles, 
  Target, MessageSquare, TrendingUp, ShieldCheck, 
  ArrowRight, Info, CheckCircle, Database, AlertCircle, Palette
} from 'lucide-react';

// Define theme interface for rich styling options
interface TrishulTheme {
  id: string;
  name: string;
  primaryColor: string; // hex
  emissiveColor: string; // hex
  ambientColor: string; // hex
  bgGradient: string; // CSS classes
  metalGoldStart: string; // hex
  metalGoldMid: string; // hex
  metalGoldEnd: string; // hex
  particleColor: string; // hex
  buttonStyle: string; // tailwind classes
  glowColor: string; // hex
  accentTailwind: string; // tailwind color prefix like amber, indigo, emerald, red
}

const themes: TrishulTheme[] = [
  {
    id: 'cinematic',
    name: 'Cinematic Studio',
    primaryColor: '#C5A880', // Soft warm beige-gold
    emissiveColor: '#EADBC8', // Light warm parchment glow
    ambientColor: '#8C7A5B', // Deep warm parchment-beige
    bgGradient: 'from-[#FAF6F0] via-[#FAF3E0] to-[#EADBC8]', // Soft ivory to warmer parchment gradient
    metalGoldStart: '#5C4E37', // Dark bronze/warm gold
    metalGoldMid: '#FCFAF7', // Bright ivory highlights
    metalGoldEnd: '#C5A880', // Fine beige-gold
    particleColor: '#C5A880', // Warm parchment signal
    buttonStyle: 'bg-stone-900 text-[#FAF6F0] border-stone-700 hover:bg-stone-800',
    glowColor: '#EADBC8',
    accentTailwind: 'amber'
  },
  {
    id: 'gold',
    name: 'Classic Royal Gold',
    primaryColor: '#D4AF37',
    emissiveColor: '#F3C63F',
    ambientColor: '#F59E0B',
    bgGradient: 'from-amber-500 to-yellow-600',
    metalGoldStart: '#8A661F',
    metalGoldMid: '#FFF3A8',
    metalGoldEnd: '#D4AF37',
    particleColor: '#F3C63F',
    buttonStyle: 'bg-astra-navy text-astra-gold border-astra-gold',
    glowColor: '#F3C63F',
    accentTailwind: 'amber'
  },
  {
    id: 'indigo',
    name: 'Cosmic Indigo',
    primaryColor: '#6366F1',
    emissiveColor: '#818CF8',
    ambientColor: '#4F46E5',
    bgGradient: 'from-indigo-500 to-violet-600',
    metalGoldStart: '#312E81',
    metalGoldMid: '#C7D2FE',
    metalGoldEnd: '#6366F1',
    particleColor: '#818CF8',
    buttonStyle: 'bg-indigo-950 text-indigo-300 border-indigo-400',
    glowColor: '#818CF8',
    accentTailwind: 'indigo'
  },
  {
    id: 'emerald',
    name: 'Emerald Prosperity',
    primaryColor: '#10B981',
    emissiveColor: '#34D399',
    ambientColor: '#059669',
    bgGradient: 'from-emerald-500 to-teal-600',
    metalGoldStart: '#064E3B',
    metalGoldMid: '#A7F3D0',
    metalGoldEnd: '#10B981',
    particleColor: '#34D399',
    buttonStyle: 'bg-emerald-950 text-emerald-300 border-emerald-400',
    glowColor: '#34D399',
    accentTailwind: 'emerald'
  },
  {
    id: 'crimson',
    name: 'Solar Crimson',
    primaryColor: '#EF4444',
    emissiveColor: '#F87171',
    ambientColor: '#DC2626',
    bgGradient: 'from-red-500 to-orange-600',
    metalGoldStart: '#7F1D1D',
    metalGoldMid: '#FECACA',
    metalGoldEnd: '#EF4444',
    particleColor: '#F87171',
    buttonStyle: 'bg-red-950 text-red-300 border-red-400',
    glowColor: '#F87171',
    accentTailwind: 'red'
  }
];

// Define the systems representing the prongs of the Trishul
interface TrishulProng {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  metric: string;
  benefit: string;
}

const prongsData: TrishulProng[] = [
  {
    id: 'ai_base',
    label: 'Chanakya AI Hub',
    title: 'The AI Neural Base',
    subtitle: 'Foundation of Intelligence',
    description: 'An autonomous orchestration brain acting as the root. Triggers rapid, automated lead ingestion across Meta, Google, and Web sources, routing qualified pipelines directly.',
    icon: Cpu,
    metric: 'Instant Ingestion',
    benefit: 'Helps prevent lead leakage'
  },
  {
    id: 'lead_scoring',
    label: 'Lead Scoring',
    title: 'Intellectual Lead Scoring',
    subtitle: 'Left Power Prong',
    description: 'Natural Language Processing and form-based pre-qualification models assessing buyer intent, budget, and timeline signals before human handoff.',
    icon: Target,
    metric: 'Smart Intent Signals',
    benefit: 'Focus on high-intent leads'
  },
  {
    id: 'followup_system',
    label: 'Follow-up System',
    title: 'Speed-to-Lead Follow-ups',
    subtitle: 'Center Power Prong',
    description: 'Automates multi-channel personalized follow-up sequences via official WhatsApp API and Email integrations immediately after lead capture.',
    icon: MessageSquare,
    metric: 'Rapid First Response',
    benefit: 'Supports higher conversions'
  },
  {
    id: 'sales_system',
    label: 'Sales Closing System',
    title: 'Unified Sales Pipelines',
    subtitle: 'Right Power Prong',
    description: 'Automated round-robin distribution, unified CRM dashboard, agent transcript scoring, and booking sync with clear operational visibility.',
    icon: TrendingUp,
    metric: 'Clear Pipeline Visibility',
    benefit: 'Helps reduce missed enquiries'
  }
];

// Helper to check WebGL support
function isWebGLSupported(): boolean {
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

// 3D Hotspot Node Component
interface ProngHotspotProps {
  id: string;
  position: [number, number, number];
  label: string;
  active: boolean;
  onHover: (id: string | null) => void;
  theme: TrishulTheme;
}

function ProngHotspot({ id, position, label, active, onHover, theme }: ProngHotspotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      const s = (active || hovered) ? 1.4 + Math.sin(t * 8) * 0.15 : 1.0 + Math.sin(t * 3) * 0.05;
      meshRef.current.scale.set(s, s, s);
    }
  });

  const isSelected = active || hovered;

  return (
    <group 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(id);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      {/* Outer Halo ring */}
      <mesh>
        <torusGeometry args={[0.24, 0.012, 8, 32]} />
        <meshBasicMaterial 
          color={isSelected ? theme.primaryColor : "#475569"} 
          transparent 
          opacity={isSelected ? 0.95 : 0.25} 
        />
      </mesh>

      {/* Internal core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? "#FFF" : "#475569"}
          emissive={isSelected ? theme.emissiveColor : "#0F172A"}
          emissiveIntensity={isSelected ? 2.5 : 0.1}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* HTML Annotation tag */}
      <Html distanceFactor={7} position={[0, 0.4, 0]} center>
        <div
          className={`px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider transition-all duration-300 pointer-events-none whitespace-nowrap`}
          style={{
            backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
            color: isSelected ? theme.primaryColor : '#475569',
            border: `1px solid ${isSelected ? theme.primaryColor : '#E2E8F0'}`,
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isSelected ? `0 4px 12px ${theme.primaryColor}33` : '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

// Particle flow component ascending inside the structure
function TrishulFlowParticle({ delay, isAnimating, color, scrollYProgress }: { delay: number; isAnimating: boolean; color: string; scrollYProgress: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const branchIndexRef = useRef<number>(Math.floor(Math.random() * 3));
  const speed = 0.3;

  useFrame((state) => {
    if (!meshRef.current || !isAnimating) return;

    const t = (state.clock.getElapsedTime() * speed + delay) % 1.0;
    const scrollVal = scrollYProgress ? scrollYProgress.get() : 0;
    
    let x = 0;
    let y = 0;
    let z = 0;

    // Dynamically adjust paths based on scroll
    const leftX = -0.95 - scrollVal * 0.45; // goes from -0.95 to -1.4
    const rightX = 0.95 + scrollVal * 0.45; // goes from 0.95 to 1.4
    const crossbarY = 0.5; // crossbar base height
    const sideTipY = 1.25; // side tips height
    const centerTipY = 1.55 - scrollVal * 0.3; // center tip moves from 1.55 down to 1.25

    // Phase 1: Climb Base (0.0 to 0.45)
    if (t < 0.45) {
      const p = t / 0.45;
      x = 0;
      y = -1.6 + p * 2.1; // Travels from base up to the crossbar nexus
      z = 0;
    } 
    // Phase 2: Route outward/upward (0.45 to 1.0)
    else {
      const p = (t - 0.45) / 0.55;
      const branch = branchIndexRef.current;

      if (branch === 1) {
        // Center Prong: Direct vertical ascent
        x = 0;
        y = crossbarY + p * (centerTipY - crossbarY);
        z = 0;
      } else if (branch === 0) {
        // Left Prong: curve out left to leftX, then up to sideTipY
        if (p < 0.4) {
          const subP = p / 0.4;
          x = subP * leftX;
          y = crossbarY + 0.1 * Math.sin(subP * Math.PI / 2);
        } else {
          const subP = (p - 0.4) / 0.6;
          x = leftX;
          y = crossbarY + 0.1 + subP * (sideTipY - (crossbarY + 0.1));
        }
        z = 0;
      } else {
        // Right Prong: curve out right to rightX, then up to sideTipY
        if (p < 0.4) {
          const subP = p / 0.4;
          x = subP * rightX;
          y = crossbarY + 0.1 * Math.sin(subP * Math.PI / 2);
        } else {
          const subP = (p - 0.4) / 0.6;
          x = rightX;
          y = crossbarY + 0.1 + subP * (sideTipY - (crossbarY + 0.1));
        }
        z = 0;
      }
    }

    meshRef.current.position.set(x, y, z);
    
    const size = t < 0.08 ? (t / 0.08) * 0.03 : t > 0.92 ? ((1.0 - t) / 0.08) * 0.03 : 0.032;
    meshRef.current.scale.set(size, size, size);

    if (t < 0.015) {
      branchIndexRef.current = Math.floor(Math.random() * 3);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

// 3D Model Assembly representing the premium Trishul
interface TrishulAssemblyProps {
  isAnimating: boolean;
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
  speedMultiplier: number;
  theme: TrishulTheme;
  scrollYProgress: any;
}

function TrishulAssembly({ isAnimating, hoveredNode, onHover, speedMultiplier, theme, scrollYProgress }: TrishulAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseOrbiterRef = useRef<THREE.Mesh>(null);

  // Refs for scroll-triggered animation of the Trishul assembly
  const leftProngGroupRef = useRef<THREE.Group>(null);
  const rightProngGroupRef = useRef<THREE.Group>(null);
  const centerShaftRef = useRef<THREE.Mesh>(null);
  const centerTipRef = useRef<THREE.Mesh>(null);
  const centerHotspotGroupRef = useRef<THREE.Group>(null);
  const crossbarRef = useRef<THREE.Mesh>(null);
  const leftConnectorRef = useRef<THREE.Mesh>(null);
  const rightConnectorRef = useRef<THREE.Mesh>(null);
  const aiCoreRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scrollVal = scrollYProgress ? scrollYProgress.get() : 0;
    
    // Dampen the slow floating rotation and position oscillation on scroll
    const floatDamp = 1.0 - scrollVal * 0.7;

    if (groupRef.current && isAnimating) {
      // Elegant slow floating motion
      groupRef.current.rotation.y = Math.sin(t * 0.2 * speedMultiplier) * 0.2 * floatDamp;
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.06 * floatDamp;
    }
    if (baseOrbiterRef.current) {
      baseOrbiterRef.current.rotation.z = -t * 0.5;
    }

    // Central Node (AI Core) expands
    if (aiCoreRef.current) {
      const scale = 1.0 + scrollVal * 0.55; // expands up to 1.55x
      aiCoreRef.current.scale.set(scale, scale, scale);
    }
    
    // Left Prong moves horizontally
    if (leftProngGroupRef.current) {
      leftProngGroupRef.current.position.x = -scrollVal * 0.45; // moves from 0 to -0.45, so absolute x is -0.95 - 0.45 = -1.4
    }
    
    // Right Prong moves horizontally
    if (rightProngGroupRef.current) {
      rightProngGroupRef.current.position.x = scrollVal * 0.45; // moves from 0 to 0.45, so absolute x is 0.95 + 0.45 = 1.4
    }
    
    // Center Prong components move vertically to align with side prongs
    if (centerShaftRef.current) {
      centerShaftRef.current.position.y = 1.0 - scrollVal * 0.15; // from 1.0 down to 0.85
      centerShaftRef.current.scale.y = 1.0 - scrollVal * 0.3; // shortens center shaft to match side shafts (0.7 length)
    }
    
    if (centerTipRef.current) {
      centerTipRef.current.position.y = 1.55 - scrollVal * 0.3; // from 1.55 down to 1.25 (matching side tips height)
    }
    
    if (centerHotspotGroupRef.current) {
      centerHotspotGroupRef.current.position.y = -scrollVal * 0.4; // shifts followupPos from 1.8 down to 1.4 (matching side hotspots height)
    }
    
    // Crossbar extends horizontally
    if (crossbarRef.current) {
      const scaleY = 1.0 + scrollVal * 0.47; // expands from 1.0 (length 1.9) to 1.47 (length 2.8)
      crossbarRef.current.scale.y = scaleY;
    }
    
    // Connector spheres move horizontally
    if (leftConnectorRef.current) {
      leftConnectorRef.current.position.x = -0.95 - scrollVal * 0.45; // from -0.95 to -1.4
    }
    
    if (rightConnectorRef.current) {
      rightConnectorRef.current.position.x = 0.95 + scrollVal * 0.45; // from 0.95 to 1.4
    }
  });

  // Spatial coordinates for hotspots
  const aiBasePos: [number, number, number] = [0, 0, 0];
  const leadScoringPos: [number, number, number] = [-0.95, 1.4, 0];
  const followupPos: [number, number, number] = [0, 1.8, 0];
  const salesSystemPos: [number, number, number] = [0.95, 1.4, 0];

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Central Support Rod / Pole */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 16]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* AI Central Neural Hub Node (Double Cone / Damru shape) */}
      <group ref={aiCoreRef} position={[0, 0, 0]}>
        {/* Top cone */}
        <mesh position={[0, 0.12, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.2, 0.22, 16]} />
          <meshStandardMaterial 
            color="#0F172A" 
            roughness={0.1} 
            metalness={0.9} 
            emissive={hoveredNode === 'ai_base' ? theme.emissiveColor : '#000000'}
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Bottom cone */}
        <mesh position={[0, -0.12, 0]}>
          <coneGeometry args={[0.2, 0.22, 16]} />
          <meshStandardMaterial 
            color="#0F172A" 
            roughness={0.1} 
            metalness={0.9} 
            emissive={hoveredNode === 'ai_base' ? theme.emissiveColor : '#000000'}
            emissiveIntensity={0.6}
          />
        </mesh>
        {/* Golden connecting ring */}
        <mesh>
          <torusGeometry args={[0.09, 0.025, 8, 16]} />
          <meshStandardMaterial color={theme.primaryColor} roughness={0.05} metalness={0.95} />
        </mesh>
        {/* Glowing orbital ring */}
        <mesh ref={baseOrbiterRef} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.32, 0.008, 8, 32]} />
          <meshBasicMaterial color={theme.primaryColor} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Elegant Curved Crossbar */}
      <mesh ref={crossbarRef} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.9, 16]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Connector Spheres on the crossbar ends */}
      <mesh ref={leftConnectorRef} position={[-0.95, 0.5, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh ref={rightConnectorRef} position={[0.95, 0.5, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>

      {/* Left Prong Shaft & Tip & Hotspot (Grouped for horizontal scroll movement) */}
      <group ref={leftProngGroupRef}>
        {/* Left Prong shaft */}
        <mesh position={[-0.95, 0.85, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Left Tip */}
        <mesh position={[-0.95, 1.25, 0]}>
          <coneGeometry args={[0.09, 0.32, 16]} />
          <meshStandardMaterial 
            color={theme.primaryColor} 
            roughness={0.1} 
            metalness={0.9}
            emissive={hoveredNode === 'lead_scoring' ? theme.emissiveColor : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        <ProngHotspot 
          id="lead_scoring" 
          position={leadScoringPos} 
          label="Lead Scoring" 
          active={hoveredNode === 'lead_scoring'} 
          onHover={onHover}
          theme={theme}
        />
      </group>

      {/* Right Prong Shaft & Tip & Hotspot (Grouped for horizontal scroll movement) */}
      <group ref={rightProngGroupRef}>
        {/* Right Prong shaft */}
        <mesh position={[0.95, 0.85, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Right Tip */}
        <mesh position={[0.95, 1.25, 0]}>
          <coneGeometry args={[0.09, 0.32, 16]} />
          <meshStandardMaterial 
            color={theme.primaryColor} 
            roughness={0.1} 
            metalness={0.9}
            emissive={hoveredNode === 'sales_system' ? theme.emissiveColor : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
        <ProngHotspot 
          id="sales_system" 
          position={salesSystemPos} 
          label="Sales System" 
          active={hoveredNode === 'sales_system'} 
          onHover={onHover}
          theme={theme}
        />
      </group>

      {/* Center Prong elements (with individual refs for vertical collapse on scroll) */}
      {/* Center Prong shaft (Taller & thicker) */}
      <mesh ref={centerShaftRef} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 16]} />
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Center Tip (Large primary spike) */}
      <mesh ref={centerTipRef} position={[0, 1.55, 0]}>
        <coneGeometry args={[0.11, 0.42, 16]} />
        <meshStandardMaterial 
          color={theme.primaryColor} 
          roughness={0.1} 
          metalness={0.95}
          emissive={hoveredNode === 'followup_system' ? theme.emissiveColor : '#000000'}
          emissiveIntensity={0.6}
        />
      </mesh>

      <group ref={centerHotspotGroupRef}>
        <ProngHotspot 
          id="followup_system" 
          position={followupPos} 
          label="Follow-up System" 
          active={hoveredNode === 'followup_system'} 
          onHover={onHover}
          theme={theme}
        />
      </group>

      {/* Flowing particle streams inside the trident */}
      <group>
        {Array.from({ length: 14 }).map((_, idx) => (
          <TrishulFlowParticle 
            key={idx} 
            delay={idx / 14} 
            isAnimating={isAnimating} 
            color={theme.particleColor}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </group>

      <ProngHotspot 
        id="ai_base" 
        position={aiBasePos} 
        label="AI Neural Hub" 
        active={hoveredNode === 'ai_base'} 
        onHover={onHover}
        theme={theme}
      />
    </group>
  );
}

export default function RevopsTrishulHero() {
  const [use3D, setUse3D] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>('ai_base');
  const [speed, setSpeed] = useState<number>(1);
  const [activeThemeId, setActiveThemeId] = useState<string>('cinematic');

  // Track scroll position of the hero container to drive animations
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Define scroll-triggered transforms for the 2D SVG blueprint
  const leftProngX = useTransform(scrollYProgress, [0, 1], [0, -16.5]);
  const rightProngX = useTransform(scrollYProgress, [0, 1], [0, 16.5]);
  const centerProngY = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const aiCoreScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.4]);
  const crossbarScaleX = useTransform(scrollYProgress, [0, 1], [1.0, 1.3]);

  // Fallback to 2D vector if WebGL is unavailable
  useEffect(() => {
    if (!isWebGLSupported()) {
      setUse3D(false);
    }
  }, []);

  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];
  const activeProng = prongsData.find(p => p.id === (hoveredNode || 'ai_base'));
  const isCinematic = activeThemeId === 'cinematic';

  return (
    <div 
      ref={containerRef}
      id="revops-trishul-hero-container" 
      className={`rounded-3xl shadow-xl overflow-hidden flex flex-col h-full min-h-[580px] transition-all duration-500 ${
        isCinematic 
          ? 'bg-[#FCF9F2] border border-[#E8DFD0] shadow-[0_20px_50px_rgba(122,98,66,0.12)]' 
          : 'bg-white border border-slate-100'
      }`}
    >
      {/* Header and presentation modes */}
      <div 
        id="trishul-hero-header" 
        className={`p-4 sm:px-6 flex flex-wrap justify-between items-center gap-3 transition-all duration-500 ${
          isCinematic 
            ? 'bg-[#F4ECE1]/90 backdrop-blur-md border-b border-[#E8DFD0]/70' 
            : 'bg-slate-50/80 backdrop-blur-md border-b border-slate-100'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div 
            className={`p-1.5 rounded-lg shadow-sm transition-all duration-500 ${
              isCinematic ? 'bg-[#5C4E37] text-[#FCFAF7]' : 'bg-slate-900 text-white'
            }`} 
            style={{ color: activeTheme.primaryColor }}
          >
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span 
              className={`text-[9px] font-mono font-extrabold tracking-widest px-1.5 py-0.2 rounded uppercase inline-block mb-0.5 transition-all duration-500 ${
                isCinematic ? 'bg-[#5C4E37] text-[#FCFAF7]' : 'bg-slate-900 text-white'
              }`}
              style={{ color: isCinematic ? '#EADBC8' : activeTheme.primaryColor }}
            >
              RevAstra Core
            </span>
            <h3 className={`font-display font-extrabold text-xs tracking-tight uppercase transition-all duration-500 ${
              isCinematic ? 'text-[#3D3323]' : 'text-slate-800'
            }`}>
              Chanakya AI Trishul Framework
            </h3>
          </div>
        </div>

        {/* Theme selection pills in the center-right */}
        <div className={`flex items-center space-x-1 p-1 rounded-xl border transition-all duration-500 ${
          isCinematic 
            ? 'bg-[#EADBC8]/40 border-[#E8DFD0]' 
            : 'bg-slate-200/55 border-slate-200/40'
        }`}>
          <Palette className={`w-3.5 h-3.5 ml-1.5 ${isCinematic ? 'text-[#7A6242]' : 'text-slate-500'}`} />
          <span className={`text-[8px] font-mono font-extrabold px-1.5 uppercase hidden sm:inline ${
            isCinematic ? 'text-[#7A6242]' : 'text-slate-500'
          }`}>Theme:</span>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThemeId(t.id)}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all duration-200 uppercase flex items-center space-x-1 ${
                activeThemeId === t.id
                  ? isCinematic 
                    ? 'bg-[#FCFAF7] text-[#3D3323] shadow-xs font-extrabold border border-[#E8DFD0]'
                    : 'bg-white text-slate-800 shadow-xs font-extrabold border border-slate-200/70'
                  : isCinematic 
                    ? 'text-[#8C7A5B] hover:text-[#3D3323] hover:bg-[#FCFAF7]/40'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: t.primaryColor }} />
              <span className="text-[8px]">{t.name.split(' ').pop()}</span>
            </button>
          ))}
        </div>

        {/* View mode buttons */}
        <div className="flex items-center space-x-2">
          {use3D && (
            <div className={`flex items-center space-x-1.5 mr-1 p-1 rounded-lg transition-all duration-500 ${
              isCinematic ? 'bg-[#EADBC8]/40' : 'bg-slate-200/50'
            }`}>
              <span className={`text-[8px] font-mono px-1 font-bold ${
                isCinematic ? 'text-[#7A6242]' : 'text-slate-500'
              }`}>FLOW:</span>
              <button 
                onClick={() => setSpeed(prev => prev === 0.5 ? 1 : prev === 1 ? 2 : 0.5)}
                className={`text-[8px] font-mono px-1.5 py-0.5 rounded font-extrabold transition-all duration-250 border shadow-xs ${
                  isCinematic 
                    ? 'bg-[#FCFAF7] text-[#3D3323] border-[#E8DFD0] hover:bg-[#FAF6F0]' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {speed === 0.5 ? 'SLOW' : speed === 1 ? 'NORMAL' : 'FAST'}
              </button>
            </div>
          )}

          {/* Pause Button */}
          {use3D && (
            <button
              id="trishul-flow-pause-btn"
              onClick={() => setIsAnimating(!isAnimating)}
              className={`p-1.5 rounded-lg border transition ${
                isCinematic 
                  ? 'bg-[#FCFAF7] border-[#E8DFD0] text-[#7A6242] hover:text-[#3D3323] hover:bg-[#FAF6F0]' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title={isAnimating ? "Pause Animation" : "Play Animation"}
            >
              {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {/* Blueprint/3D toggle */}
          <button
            id="trishul-mode-toggle-btn"
            onClick={() => setUse3D(!use3D)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isCinematic 
                ? 'bg-[#FCFAF7] border-[#E8DFD0] text-[#3D3323] hover:bg-[#FAF6F0]' 
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{use3D ? 'View Blueprint' : 'View 3D Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Container Stage */}
      <div 
        id="trishul-interactive-stage" 
        className="flex-grow flex flex-col lg:flex-row relative min-h-[460px]"
      >
        {/* Render Canvas (3D) or Vector Fallback (2D) */}
        <div className={`flex-grow relative h-[380px] lg:h-auto lg:w-[55%] flex items-center justify-center overflow-hidden transition-all duration-500 ${
          isCinematic 
            ? 'bg-[#FAF6F0] border-b lg:border-b-0 lg:border-r border-[#E8DFD0]/60' 
            : 'bg-slate-50/40 border-b lg:border-b-0 lg:border-r border-slate-100'
        }`}>
          <div className="absolute inset-0 geo-pattern opacity-[0.03] pointer-events-none" />

          {use3D ? (
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <Suspense fallback={
                <div className={`absolute inset-0 flex flex-col items-center justify-center text-xs font-mono transition-all duration-500 ${
                  isCinematic ? 'text-[#8C7A5B]' : 'text-slate-500'
                }`}>
                  <div className="w-6 h-6 border-2 border-t-slate-800 border-slate-200 rounded-full animate-spin mb-2" style={{ borderTopColor: activeTheme.primaryColor }} />
                  Initializing Trishul Core ({activeTheme.name})...
                </div>
              }>
                <Canvas camera={{ position: [0, 1.5, 3.8], fov: 50 }}>
                  <ambientLight intensity={0.65} />
                  <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                  <pointLight position={[0, 0.2, 0.5]} intensity={1.8} color={activeTheme.primaryColor} />
                  
                  <group position={[0, -0.6, 0]}>
                    <TrishulAssembly 
                      isAnimating={isAnimating}
                      hoveredNode={hoveredNode}
                      onHover={setHoveredNode}
                      speedMultiplier={speed}
                      theme={activeTheme}
                      scrollYProgress={scrollYProgress}
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
            /* Premium High-Fidelity Vector SVG representation mimicking the 3D aesthetic */
            <div 
              id="trishul-vector-blueprint-stage" 
              className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4"
            >
              <div className={`relative w-full max-w-[280px] aspect-[4/5] flex items-center justify-center rounded-2xl shadow-md p-4 transition-all duration-500 ${
                isCinematic 
                  ? 'bg-[#FCFAF7] border border-[#E8DFD0]' 
                  : 'bg-white border border-slate-100/80'
              }`}>
                <svg viewBox="0 0 200 240" className="w-full h-full text-slate-300 overflow-visible">
                  <defs>
                    {/* Glowing outer rings */}
                    <filter id="vector-node-glow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    
                    <filter id="vector-neon-flare" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="3" result="b1" />
                      <feGaussianBlur stdDeviation="7" result="b2" />
                      <feMerge>
                        <feMergeNode in="b2" />
                        <feMergeNode in="b1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="v-drop-shadow" x="-10%" y="-10%" width="130%" height="130%">
                      <feDropShadow dx="1" dy="2.5" stdDeviation="2" floodColor={isCinematic ? "#5C4E37" : "#0F172A"} floodOpacity="0.18" />
                    </filter>

                    {/* Gradients */}
                    <linearGradient id="v-steel" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={isCinematic ? "#4A3D29" : "#0F172A"} />
                      <stop offset="35%" stopColor={isCinematic ? "#7A6242" : "#475569"} />
                      <stop offset="50%" stopColor={isCinematic ? "#D4C5B0" : "#94A3B8"} />
                      <stop offset="65%" stopColor={isCinematic ? "#7A6242" : "#475569"} />
                      <stop offset="100%" stopColor={isCinematic ? "#4A3D29" : "#0F172A"} />
                    </linearGradient>

                    {/* Dynamic gold gradient mapping to active theme */}
                    <linearGradient id="v-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={activeTheme.metalGoldStart} />
                      <stop offset="25%" stopColor={activeTheme.primaryColor} />
                      <stop offset="50%" stopColor={activeTheme.metalGoldMid} />
                      <stop offset="75%" stopColor={activeTheme.metalGoldEnd} />
                      <stop offset="100%" stopColor={activeTheme.metalGoldStart} />
                    </linearGradient>
                    
                    <linearGradient id="v-obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={isCinematic ? "#7A6242" : "#334155"} />
                      <stop offset="50%" stopColor={isCinematic ? "#5C4E37" : "#1E293B"} />
                      <stop offset="100%" stopColor={isCinematic ? "#3D3323" : "#0F172A"} />
                    </linearGradient>

                    {/* Dynamic radial glow mapping to active theme */}
                    <radialGradient id="v-radial-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={activeTheme.emissiveColor} stopOpacity="0.6" />
                      <stop offset="45%" stopColor={activeTheme.primaryColor} stopOpacity="0.15" />
                      <stop offset="100%" stopColor={activeTheme.primaryColor} stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <style>{`
                    @keyframes v-flow {
                      0% { stroke-dashoffset: 28; }
                      100% { stroke-dashoffset: 0; }
                    }
                    @keyframes v-pulse {
                      0%, 100% { opacity: 0.3; transform: scale(0.95); }
                      50% { opacity: 0.8; transform: scale(1.15); }
                    }
                    @keyframes v-spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    .v-flow-line {
                      stroke-dasharray: 5, 8;
                      animation: v-flow 2.5s linear infinite;
                    }
                    .v-pulsing-glow {
                      animation: v-pulse 3.5s ease-in-out infinite;
                      transform-origin: 100px 135px;
                    }
                    .v-spinning-ring {
                      animation: v-spin 14s linear infinite;
                      transform-origin: 100px 135px;
                    }
                  `}</style>

                  {/* Pulsing glow background behind Trishul */}
                  <motion.g style={{ scale: aiCoreScale, transformOrigin: "100px 135px" }} className="v-pulsing-glow">
                    <circle cx="100" cy="135" r="42" fill="url(#v-radial-glow)" />
                  </motion.g>

                  {/* Flow animation path line indicators */}
                  <path d="M 100 215 L 100 135" stroke={activeTheme.primaryColor} strokeWidth="1.5" strokeOpacity="0.45" className="v-flow-line" />
                  
                  <motion.g style={{ scaleX: crossbarScaleX, transformOrigin: "100px 100px" }}>
                    <path d="M 100 135 C 70 135, 45 135, 45 100 L 45 55" fill="none" stroke={activeTheme.primaryColor} strokeWidth="1.5" strokeOpacity="0.45" className="v-flow-line" />
                    <path d="M 100 135 C 130 135, 155 135, 155 100 L 155 55" fill="none" stroke={activeTheme.primaryColor} strokeWidth="1.5" strokeOpacity="0.45" className="v-flow-line" />
                    
                    {/* Symmetric Crossbar Arch */}
                    <path d="M 42 100 Q 100 148 158 100" fill="none" stroke="url(#v-steel)" strokeWidth="5.5" strokeLinecap="round" filter="url(#v-drop-shadow)" />
                    
                    {/* End connectors */}
                    <circle cx="45" cy="100" r="3" fill="url(#v-steel)" />
                    <circle cx="155" cy="100" r="3" fill="url(#v-steel)" />
                  </motion.g>

                  {/* Main pole shaft */}
                  <rect x="97" y="125" width="6" height="90" rx="3" fill="url(#v-steel)" filter="url(#v-drop-shadow)" />

                  {/* Left Prong elements (Grouped for horizontal shift) */}
                  <motion.g style={{ x: leftProngX }}>
                    {/* Left Prong */}
                    <rect x="42.5" y="58" width="5" height="42" rx="2.5" fill="url(#v-steel)" filter="url(#v-drop-shadow)" />

                    {/* Left Spearhead (Lead Scoring) */}
                    <g transform="translate(45, 40)" filter="url(#v-drop-shadow)">
                      <path d="M 0 -13 L 6.5 11 L -6.5 11 Z" fill="url(#v-gold)" />
                      <path d="M 0 -13 L 0 11 L -6.5 11 Z" fill="#FFFFFF" fillOpacity="0.22" />
                    </g>

                    {/* Left Node Interactive */}
                    <g 
                      className="cursor-pointer group"
                      onClick={() => setHoveredNode('lead_scoring')}
                      onMouseEnter={() => setHoveredNode('lead_scoring')}
                    >
                      <circle cx="45" cy="55" r="14" fill={hoveredNode === 'lead_scoring' ? activeTheme.primaryColor : isCinematic ? '#FCFAF7' : '#FFFFFF'} stroke={isCinematic ? '#E8DFD0' : '#0F172A'} strokeWidth="1.5" className="transition-all duration-300" />
                      {hoveredNode === 'lead_scoring' && (
                        <circle cx="45" cy="55" r="7" fill={isCinematic ? '#FCFAF7' : '#FFFFFF'} filter="url(#vector-node-glow)" className="animate-ping" />
                      )}
                      <circle cx="45" cy="55" r="4" fill={hoveredNode === 'lead_scoring' ? isCinematic ? '#3D3323' : '#0F172A' : isCinematic ? '#7A6242' : '#475569'} />
                    </g>
                  </motion.g>

                  {/* Right Prong elements (Grouped for horizontal shift) */}
                  <motion.g style={{ x: rightProngX }}>
                    {/* Right Prong */}
                    <rect x="152.5" y="58" width="5" height="42" rx="2.5" fill="url(#v-steel)" filter="url(#v-drop-shadow)" />

                    {/* Right Spearhead (Sales closing) */}
                    <g transform="translate(155, 40)" filter="url(#v-drop-shadow)">
                      <path d="M 0 -13 L 6.5 11 L -6.5 11 Z" fill="url(#v-gold)" />
                      <path d="M 0 -13 L 0 11 L -6.5 11 Z" fill="#FFFFFF" fillOpacity="0.22" />
                    </g>

                    {/* Right Node Interactive */}
                    <g 
                      className="cursor-pointer group"
                      onClick={() => setHoveredNode('sales_system')}
                      onMouseEnter={() => setHoveredNode('sales_system')}
                    >
                      <circle cx="155" cy="55" r="14" fill={hoveredNode === 'sales_system' ? activeTheme.primaryColor : isCinematic ? '#FCFAF7' : '#FFFFFF'} stroke={isCinematic ? '#E8DFD0' : '#0F172A'} strokeWidth="1.5" className="transition-all duration-300" />
                      {hoveredNode === 'sales_system' && (
                        <circle cx="155" cy="55" r="7" fill={isCinematic ? '#FCFAF7' : '#FFFFFF'} filter="url(#vector-node-glow)" className="animate-ping" />
                      )}
                      <circle cx="155" cy="55" r="4" fill={hoveredNode === 'sales_system' ? isCinematic ? '#3D3323' : '#0F172A' : isCinematic ? '#7A6242' : '#475569'} />
                    </g>
                  </motion.g>

                  {/* Center Prong elements (Grouped for vertical slide) */}
                  <motion.g style={{ y: centerProngY }}>
                    {/* Center Prong */}
                    <rect x="97" y="95" width="6" height="40" rx="3" fill="url(#v-steel)" filter="url(#v-drop-shadow)" />

                    {/* Center Spearhead (Follow-up) */}
                    <g transform="translate(100, 20)" filter="url(#v-drop-shadow)">
                      <path d="M 0 -17 L 8.5 15 L -8.5 15 Z" fill="url(#v-gold)" />
                      <path d="M 0 -17 L 0 15 L -8.5 15 Z" fill="#FFFFFF" fillOpacity="0.26" />
                    </g>

                    {/* Center Node Interactive */}
                    <g 
                      className="cursor-pointer group"
                      onClick={() => setHoveredNode('followup_system')}
                      onMouseEnter={() => setHoveredNode('followup_system')}
                    >
                      <circle cx="100" cy="30" r="14" fill={hoveredNode === 'followup_system' ? activeTheme.primaryColor : isCinematic ? '#FCFAF7' : '#FFFFFF'} stroke={isCinematic ? '#E8DFD0' : '#0F172A'} strokeWidth="1.5" className="transition-all duration-300" />
                      {hoveredNode === 'followup_system' && (
                        <circle cx="100" cy="30" r="7" fill={isCinematic ? '#FCFAF7' : '#FFFFFF'} filter="url(#vector-node-glow)" className="animate-ping" />
                      )}
                      <circle cx="100" cy="30" r="4" fill={hoveredNode === 'followup_system' ? isCinematic ? '#3D3323' : '#0F172A' : isCinematic ? '#7A6242' : '#475569'} />
                    </g>
                  </motion.g>

                  {/* Central Node elements (Grouped for scale) */}
                  <motion.g style={{ scale: aiCoreScale, transformOrigin: "100px 135px" }}>
                    {/* Damru Hourglass Central Node (Neural Core) */}
                    <g transform="translate(100, 135)" filter="url(#v-drop-shadow)">
                      <polygon points="-12,-15 12,-15 0,0" fill="url(#v-obsidian)" stroke={activeTheme.primaryColor} strokeWidth="0.8" />
                      <polygon points="-12,15 12,15 0,0" fill="url(#v-obsidian)" stroke={activeTheme.primaryColor} strokeWidth="0.8" />
                      <rect x="-4" y="-1.5" width="8" height="3" fill="url(#v-gold)" />
                      <circle r="4" fill="#FFFFFF" filter="url(#vector-neon-flare)" />
                    </g>

                    {/* Orbital Halos rotating around core */}
                    <ellipse cx="100" cy="135" rx="22" ry="7" fill="none" stroke={activeTheme.primaryColor} strokeWidth="0.75" strokeOpacity="0.4" transform="rotate(-15 100 135)" className="v-spinning-ring" />

                    {/* AI Base Node Interactive */}
                    <g 
                      className="cursor-pointer group"
                      onClick={() => setHoveredNode('ai_base')}
                      onMouseEnter={() => setHoveredNode('ai_base')}
                    >
                      <circle cx="100" cy="135" r="14" fill={hoveredNode === 'ai_base' ? activeTheme.primaryColor : isCinematic ? '#FCFAF7' : '#FFFFFF'} stroke={isCinematic ? '#E8DFD0' : '#0F172A'} strokeWidth="1.5" className="transition-all duration-300" />
                      {hoveredNode === 'ai_base' && (
                        <circle cx="100" cy="135" r="7" fill={isCinematic ? '#FCFAF7' : '#FFFFFF'} filter="url(#vector-node-glow)" className="animate-ping" />
                      )}
                      <circle cx="100" cy="135" r="4" fill={hoveredNode === 'ai_base' ? isCinematic ? '#3D3323' : '#0F172A' : isCinematic ? '#7A6242' : '#475569'} />
                    </g>
                  </motion.g>
                </svg>
              </div>

              {/* Vector instructions */}
              <span className={`text-[10px] font-mono transition-all duration-500 ${
                isCinematic ? 'text-[#8C7A5B]' : 'text-slate-400'
              }`}>
                Tap blueprint elements to test flow signals
              </span>
            </div>
          )}

          {/* Interactive telemetry tag in the margin */}
          <div className={`absolute bottom-3 left-3 flex items-center space-x-1 text-[8px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border transition-all duration-500 ${
            isCinematic 
              ? 'text-[#7A6242] bg-[#FCFAF7]/95 border-[#E8DFD0]' 
              : 'text-slate-400 bg-white/75 backdrop-blur-md border-slate-100/80'
          }`}>
            <Zap className="w-2.5 h-2.5 animate-pulse mr-1" style={{ color: activeTheme.primaryColor }} />
            <span>AI CORE STATUS: {use3D ? `WebGL 3D Active (${activeTheme.name})` : `Blueprint mode (${activeTheme.name})`}</span>
          </div>
        </div>

        {/* Diagnostics & Information Panel Column */}
        <div 
          id="trishul-diagnostics-board" 
          className={`lg:w-[45%] p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-500 ${
            isCinematic ? 'bg-[#FCFAF7]/40' : ''
          }`}
        >
          {/* Active node diagnostics details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span 
                className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md font-bold tracking-wider inline-block transition-all duration-500 ${
                  isCinematic ? 'bg-[#5C4E37] text-[#FCFAF7]' : 'bg-slate-900 text-white'
                }`}
                style={{ color: isCinematic ? '#EADBC8' : activeTheme.primaryColor }}
              >
                REVOPS INSPECTION
              </span>
              <span className={isCinematic ? 'text-[#E8DFD0]' : 'text-slate-300'}>|</span>
              <span className={`text-[9px] font-mono font-semibold uppercase ${
                isCinematic ? 'text-[#7A6242]' : 'text-slate-500'
              }`}>
                Diagnostic Node
              </span>
            </div>

            {activeProng && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <div 
                    className="p-2 text-white rounded-lg transition-colors duration-300 bg-gradient-to-br shadow-sm animate-pulse-slow"
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, ${activeTheme.primaryColor}, ${activeTheme.ambientColor})` 
                    }}
                  >
                    <activeProng.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-display font-extrabold text-base uppercase tracking-tight transition-all duration-500 ${
                      isCinematic ? 'text-[#3D3323]' : 'text-slate-900'
                    }`}>
                      {activeProng.label}
                    </h4>
                    <p className={`text-[10px] font-mono font-medium tracking-wide transition-all duration-500 ${
                      isCinematic ? 'text-[#8C7A5B]' : 'text-slate-400'
                    }`}>
                      {activeProng.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className={`font-display font-bold text-xs transition-all duration-500 ${
                    isCinematic ? 'text-[#5C4E37]' : 'text-slate-800'
                  }`}>
                    {activeProng.title}
                  </h5>
                  <p className={`text-xs leading-relaxed transition-all duration-500 ${
                    isCinematic ? 'text-[#5C4F3D]' : 'text-slate-600'
                  }`}>
                    {activeProng.description}
                  </p>
                </div>

                {/* Micro Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className={`border p-2.5 rounded-xl transition-all duration-500 ${
                    isCinematic ? 'bg-[#F4ECE1]/60 border-[#E8DFD0]' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className={`block text-[8px] font-mono uppercase ${
                      isCinematic ? 'text-[#8C7A5B]' : 'text-slate-400'
                    }`}>Engine Impact</span>
                    <span className={`text-xs font-bold ${
                      isCinematic ? 'text-[#3D3323]' : 'text-slate-800'
                    }`}>{activeProng.metric}</span>
                  </div>
                  <div className={`border p-2.5 rounded-xl transition-all duration-500 ${
                    isCinematic ? 'bg-[#F4ECE1]/60 border-[#E8DFD0]' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className={`block text-[8px] font-mono uppercase ${
                      isCinematic ? 'text-[#8C7A5B]' : 'text-slate-400'
                    }`}>Main Outcome</span>
                    <span className="text-xs font-bold font-display" style={{ color: activeTheme.ambientColor }}>{activeProng.benefit}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick interactive selector tabs */}
          <div className="space-y-2">
            <span className={`block text-[9px] font-mono uppercase tracking-widest font-bold ${
              isCinematic ? 'text-[#8C7A5B]' : 'text-slate-400'
            }`}>
              Switch Core Prong:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {prongsData.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setHoveredNode(p.id)}
                  className={`px-2 py-1.5 border rounded-xl text-[10px] font-bold tracking-tight text-left transition flex items-center space-x-1.5 ${
                    hoveredNode === p.id 
                      ? isCinematic 
                        ? 'bg-[#5C4E37] text-[#FCFAF7] border-[#4A3D29] shadow-xs'
                        : 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : isCinematic 
                        ? 'bg-[#FCFAF7] border-[#E8DFD0]/60 text-[#7A6242] hover:bg-[#FAF6F0]'
                        : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
                  }`}
                  style={hoveredNode === p.id ? { borderLeft: `3px solid ${activeTheme.primaryColor}` } : undefined}
                >
                  <p.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: activeTheme.primaryColor }} />
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Callout Box */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 shadow-md relative overflow-hidden transition-all duration-500 ${
            isCinematic 
              ? 'bg-gradient-to-r from-[#4A3D29] to-[#3D3323] text-[#FAF6F0] border-[#5C4E37]' 
              : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white border-white/5 shadow-md'
          }`}>
            <div 
              className="absolute top-0 right-0 w-20 h-20 rounded-bl-full pointer-events-none opacity-25"
              style={{ 
                backgroundImage: `radial-gradient(circle at top right, ${activeTheme.primaryColor}, transparent)` 
              }}
            />
            
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: activeTheme.primaryColor }} />
              <span className={`text-[9px] font-mono uppercase tracking-widest font-bold block`} style={{ color: activeTheme.primaryColor }}>
                Trishul Execution System
              </span>
            </div>

            <p className={`text-[10px] leading-relaxed transition-all duration-500 ${
              isCinematic ? 'text-[#E8DFD0]' : 'text-slate-300'
            }`}>
              Equip your sales operations with Chanakya. Consolidate Lead scoring, automated follow-ups, and sales tracking inside 48 hours.
            </p>

            <div className="flex justify-end pt-0.5">
              <a 
                href="#/growth-system-builder" 
                className={`inline-flex items-center space-x-1.5 text-[10px] font-bold text-slate-900 px-3 py-1.5 rounded-md transition hover:bg-white hover:text-slate-900 shadow-xs`}
                style={{ backgroundColor: activeTheme.primaryColor }}
              >
                <span>Configure My System</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
