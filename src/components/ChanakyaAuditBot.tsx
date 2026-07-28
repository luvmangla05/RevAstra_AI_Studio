import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, Compass, ShieldAlert, CheckCircle2, TrendingDown, Sparkles, 
  ArrowRight, Globe, Building, RefreshCw, Smartphone, Mail, ArrowLeft, Award
} from "lucide-react";

interface AuditResult {
  diagnosis: string;
  suggestions: { title: string; description: string }[];
  leakScore: number;
  wastePercentage: number;
  financialWaste: string;
  leadId: string;
}

export default function ChanakyaAuditBot() {
  const [step, setStep] = useState<"welcome" | "questions" | "analyzing" | "result">("welcome");
  
  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  // Question options
  const [primaryLeak, setPrimaryLeak] = useState("response-time");
  const [responseTime, setResponseTime] = useState("30m-1h");
  const [adSpend, setAdSpend] = useState("50k-2l");
  const [followUpMethod, setFollowUpMethod] = useState("manual");
  
  const [loadingText, setLoadingText] = useState("Initializing Trishul Strategic Audit...");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Rotating status messages during "analyzing" state
  useEffect(() => {
    if (step !== "analyzing") return;
    
    const steps = [
      { t: "Connecting to " + (companyWebsite || "server") + "...", d: 800 },
      { t: "Injecting Chanakya's strategic diagnostics metrics...", d: 1800 },
      { t: "Analyzing lead response speed parameters (" + responseTime + ")...", d: 2800 },
      { t: "Estimating annual pipeline leakage rates...", d: 3800 },
      { t: "Formulating bespoke strategic recommendations...", d: 4800 },
    ];

    const timeouts = steps.map(s => 
      setTimeout(() => setLoadingText(s.t), s.d)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [step, companyWebsite, responseTime]);

  const startAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !companyWebsite.trim()) {
      setError("Please fill in your company name and website.");
      return;
    }
    setError(null);
    setStep("questions");
  };

  const handleRunAudit = async () => {
    setStep("analyzing");
    setError(null);

    try {
      const response = await fetch("/api/chanakya/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          companyWebsite,
          primaryLeak,
          responseTime,
          adSpend,
          followUpMethod,
          contactEmail,
          contactPhone
        })
      });

      if (!response.ok) {
        throw new Error("Audit generation failed. Please try again.");
      }

      const data = await response.json();
      setResult(data);
      // Let the simulation display all loading states gracefully
      setTimeout(() => {
        setStep("result");
      }, 5500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setStep("questions");
    }
  };

  const resetAudit = () => {
    setStep("welcome");
    setCompanyName("");
    setCompanyWebsite("");
    setContactEmail("");
    setContactPhone("");
    setResult(null);
  };

  return (
    <section id="chanakya-3d-audit-hero" className="relative py-20 bg-slate-950 text-white overflow-hidden border-b border-slate-900">
      {/* Dynamic 3D Grid Space background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      
      {/* Ambient Gold and Navy floating orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-astra-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r from-astra-gold to-yellow-500 text-slate-950 px-3 py-1 rounded-full inline-flex items-center">
            <Bot className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
            Strategic Diagnostic Engine
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-astra-gold leading-tight">
            Chanakya: Analyse Your Business Leak
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Our diagnostic engine tracks visual attention drops, response latency, and operational leaks. 
            Input your parameters to deploy a tailored Trishul defense blueprint.
          </p>
        </div>

        {/* Interactive 3D Bento-style Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Audit Workspace Console */}
          <div className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Corner tech accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-astra-gold/30" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-astra-gold/30" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-astra-gold/30" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-astra-gold/30" />

            <AnimatePresence mode="wait">
              
              {/* STATE 1: WELCOME / INITIAL DETAILS */}
              {step === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    <h3 className="font-display text-xl font-bold text-astra-gold flex items-center">
                      <Compass className="w-5 h-5 mr-2 text-astra-gold animate-spin-slow" />
                      Step 1: Define Corporate Boundaries
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Every audit begins with a secure digital sweep of your current territory. Enter your company name and active website address below so Chanakya can initiate diagnostic parameters.
                    </p>

                    <form onSubmit={startAudit} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">Company Name *</label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Supreme Builders Mumbai"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-astra-gold transition placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">Company Website *</label>
                        <div className="relative">
                          <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. www.supremebuilders.in"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-astra-gold transition placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">Email Address (To send report)</label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                            <input
                              type="email"
                              placeholder="e.g. advisor@company.com"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-astra-gold transition placeholder:text-slate-600"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">WhatsApp Number (For instant delivery)</label>
                          <div className="relative">
                            <Smartphone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                            <input
                              type="tel"
                              placeholder="e.g. +91 98765 43210"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-astra-gold transition placeholder:text-slate-600"
                            />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <p className="text-xs text-red-400 flex items-center bg-red-950/30 p-2.5 rounded border border-red-900/30">
                          <ShieldAlert className="w-4 h-4 mr-1.5 shrink-0" />
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-astra-gold to-yellow-500 text-slate-950 font-bold py-3.5 rounded-lg shadow-lg shadow-astra-gold/10 hover:shadow-astra-gold/20 hover:from-yellow-400 hover:to-astra-gold transition flex items-center justify-center space-x-2 cursor-pointer mt-4"
                      >
                        <span>Initiate Strategic Leak Audit</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                  
                  <div className="border-t border-slate-800/80 pt-4 mt-6 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>SECURITY PARAMETER: SECURE SHA-256 PARSING</span>
                    <span>STATUS: ONLINE</span>
                  </div>
                </motion.div>
              )}

              {/* STATE 2: PIPELINE LEAK QUESTIONS */}
              {step === "questions" && (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 flex-grow flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold text-astra-gold flex items-center">
                        <Bot className="w-5 h-5 mr-2 text-astra-gold animate-bounce" />
                        Step 2: Diagnosis Questionnaire
                      </h3>
                      <button 
                        onClick={() => setStep("welcome")}
                        className="text-[10px] font-mono tracking-wider text-slate-400 hover:text-white flex items-center space-x-1 border border-slate-800 rounded px-2 py-1 bg-slate-950/40"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Back</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Q1: Primary Leak */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                          1. Where do you suspect the most severe leak exists?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            { id: "response-time", label: "Slow Response Speed (Leads getting cold)" },
                            { id: "follow-up", label: "Manual or Non-existent Follow-ups" },
                            { id: "closing", label: "Poor CRM Tracking & Closing Systems" },
                            { id: "quality", label: "Low Quality Leads (Need Scoring/Filters)" }
                          ].map(o => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => setPrimaryLeak(o.id)}
                              className={`text-left text-xs p-3 rounded-lg border transition ${
                                primaryLeak === o.id
                                  ? "bg-astra-gold/15 border-astra-gold text-white font-medium"
                                  : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q2: Response Speed */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                          2. Average response time for an inbound digital lead?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: "instant", label: "Under 5 mins" },
                            { id: "30m-1h", label: "30 mins - 1 hr" },
                            { id: "same-day", label: "Same Day" },
                            { id: "next-day", label: "Next Day+" }
                          ].map(o => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => setResponseTime(o.id)}
                              className={`text-center text-xs p-2.5 rounded-lg border transition ${
                                responseTime === o.id
                                  ? "bg-astra-gold/15 border-astra-gold text-white font-medium"
                                  : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q3: Monthly Ad Spend */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                          3. Monthly performance ad spend or marketing budget?
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: "under-50k", label: "< ₹50,000" },
                            { id: "50k-2l", label: "₹50k - 2 Lakhs" },
                            { id: "2l-10l", label: "₹2 Lakhs - 10 Lakhs" },
                            { id: "10l-plus", label: "₹10 Lakhs +" }
                          ].map(o => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => setAdSpend(o.id)}
                              className={`text-center text-xs p-2.5 rounded-lg border transition ${
                                adSpend === o.id
                                  ? "bg-astra-gold/15 border-astra-gold text-white font-medium"
                                  : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q4: Follow-up Method */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono tracking-wider uppercase text-slate-400 block">
                          4. How are sales follow-ups currently managed?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { id: "manual", label: "Manual copy/pasting & messaging" },
                            { id: "basic-email", label: "Basic email/newsletter drip" },
                            { id: "none", label: "No system or done occasionally" }
                          ].map(o => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => setFollowUpMethod(o.id)}
                              className={`text-left text-xs p-3 rounded-lg border transition ${
                                followUpMethod === o.id
                                  ? "bg-astra-gold/15 border-astra-gold text-white font-medium"
                                  : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700"
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunAudit}
                      className="w-full bg-gradient-to-r from-astra-gold to-yellow-500 text-slate-950 font-bold py-3.5 rounded-lg shadow-lg hover:from-yellow-400 hover:to-astra-gold transition flex items-center justify-center space-x-2 cursor-pointer mt-4"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                      <span>Run Diagnostic Synthesis</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: ANALYZING SIMULATION */}
              {step === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 space-y-8 flex-grow"
                >
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    {/* Concentric spinning rings */}
                    <div className="absolute inset-0 border-2 border-dashed border-astra-gold rounded-full animate-spin-slow" style={{ animationDuration: "12s" }} />
                    <div className="absolute inset-2 border border-blue-500/50 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
                    <div className="absolute inset-4 border-2 border-dotted border-white/30 rounded-full animate-spin" style={{ animationDuration: "8s" }} />
                    <Bot className="w-8 h-8 text-astra-gold animate-bounce" />
                  </div>

                  <div className="space-y-2 text-center max-w-sm">
                    <h4 className="font-display font-bold text-lg text-white">Chanakya is Analyzing...</h4>
                    <p className="text-xs font-mono text-astra-gold tracking-wide h-8">{loadingText}</p>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5 }}
                        className="bg-gradient-to-r from-astra-gold to-yellow-400 h-full rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 4: REPORT / RESULT */}
              {step === "result" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 flex-grow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-astra-gold animate-pulse" />
                        <h3 className="font-display font-bold text-lg text-white">Chanakya's Strategic Audit</h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Lead Registered: {result.leadId}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-center">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pipeline Leak Score</p>
                        <p className="text-3xl font-extrabold text-red-400 mt-1">{result.leakScore}%</p>
                        <span className="text-[9px] text-red-500 font-mono font-medium tracking-wide">HIGH CRITICAL LEAK</span>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-center">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Estimated Leak Loss</p>
                        <p className="text-3xl font-extrabold text-yellow-500 mt-1">{result.wastePercentage}%</p>
                        <span className="text-[9px] text-yellow-500/80 font-mono">ADVERTISING WASTAGE</span>
                      </div>

                      <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-center">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Monthly Cash Drain</p>
                        <p className="text-lg font-bold text-white mt-2.5 truncate" title={result.financialWaste}>{result.financialWaste}</p>
                        <span className="text-[9px] text-slate-400 font-mono">IN EFFICIENCY LOSSES</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 text-[8px] font-mono text-slate-800 tracking-widest uppercase bg-slate-900 px-2 py-0.5 rounded-bl">
                        CHANAKYA_NITI_V4
                      </div>
                      <p className="text-xs text-slate-300 italic leading-relaxed">
                        {result.diagnosis}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-semibold">
                        RECOMMENDED TRISHUL STRATEGIC ACTIONS:
                      </h4>
                      <div className="space-y-2">
                        {result.suggestions.map((s, idx) => (
                          <div key={idx} className="bg-slate-950/40 border border-slate-800/60 hover:border-slate-800 p-3 rounded-lg flex items-start space-x-3 transition">
                            <span className="text-[10px] font-mono bg-astra-navy text-astra-gold border border-astra-gold/20 w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                              0{idx + 1}
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs font-bold text-white font-display">{s.title}</p>
                              <p className="text-[11px] text-slate-400 leading-normal">{s.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-800/80 mt-6">
                    <button
                      onClick={resetAudit}
                      className="text-center text-xs font-semibold border border-slate-800 hover:border-slate-700 hover:bg-slate-900 px-4 py-2.5 rounded transition text-slate-300"
                    >
                      Run New Diagnostic
                    </button>
                    <a
                      href="/growth-system-builder"
                      className="flex-1 text-center text-xs text-slate-950 bg-gradient-to-r from-astra-gold to-yellow-500 hover:from-yellow-400 hover:to-astra-gold font-bold px-4 py-2.5 rounded shadow transition flex items-center justify-center space-x-1"
                    >
                      <span>Build My Growth System blueprint now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right Column: Holographic 3D Interactive Dashboard Visualizer */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden relative min-h-[400px]">
            {/* Corner glows */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-astra-gold/5 rounded-full blur-2xl" />

            <div className="space-y-4 relative z-10 w-full">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center">
                  <Compass className="w-3 h-3 mr-1 text-astra-gold animate-spin-slow" />
                  Live Holographic Shield Matrix
                </span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  REFRESH_RATE: 60HZ
                </span>
              </div>

              {/* 3D Model Perspective Stage */}
              <div className="relative h-64 flex items-center justify-center perspective-[1200px]">
                
                {/* Simulated 3D holographic scanning grid */}
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent border border-blue-500/10 rounded-xl transform rotateX-30 rotateY-12"
                  style={{
                    transform: "perspective(1000px) rotateX(45deg) rotateY(15deg) rotateZ(-10deg) scale(0.9)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Glowing core platform */}
                  <div className="absolute inset-6 border border-dashed border-astra-gold/20 rounded-full animate-spin-slow" style={{ animationDuration: "18s" }} />
                  <div className="absolute inset-12 border border-blue-500/10 rounded-full animate-spin" style={{ animationDuration: "6s" }} />
                </div>

                {/* Floating holographic elements that react to step/input */}
                <div 
                  className="relative transform-preserve-3d transition-transform duration-1000 ease-out"
                  style={{
                    transform: `perspective(1000px) rotateX(25deg) rotateY(${step === "welcome" ? "-20deg" : step === "questions" ? "10deg" : "360deg"}) rotateZ(0deg) scale(1.05)`,
                  }}
                >
                  {/* Holographic Concentric Shields */}
                  <div className="absolute -inset-16 border-2 border-dashed border-blue-500/15 rounded-full animate-spin-slow" style={{ animationDuration: "25s" }} />
                  <div className="absolute -inset-10 border border-dotted border-white/10 rounded-full animate-spin" style={{ animationDuration: "10s" }} />
                  
                  {/* Animated glowing orbs representing pipeline gates */}
                  <div className="absolute -top-16 left-0 transform -translate-x-1/2">
                    <div className={`w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center relative ${step === "result" ? "bg-green-500/80 shadow-lg shadow-green-500/50" : "bg-blue-500/40 shadow-lg shadow-blue-500/20 animate-pulse"}`}>
                      <div className="absolute -top-6 text-[8px] font-mono text-slate-500 whitespace-nowrap">GATE 1: ATTENTION</div>
                    </div>
                  </div>

                  <div className="absolute top-10 -right-16">
                    <div className={`w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center relative ${responseTime === "instant" ? "bg-green-500/80 shadow-lg shadow-green-500/50" : responseTime === "next-day" ? "bg-red-500/80 shadow-lg shadow-red-500/50" : "bg-yellow-500/80 shadow-lg shadow-yellow-500/50 animate-pulse"}`}>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] font-mono text-slate-500 whitespace-nowrap">GATE 2: DEMAND</div>
                    </div>
                  </div>

                  <div className="absolute top-10 -left-16">
                    <div className={`w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center relative ${followUpMethod === "none" ? "bg-red-500/80 shadow-lg shadow-red-500/50" : followUpMethod === "manual" ? "bg-yellow-500/80 shadow-lg shadow-yellow-500/50 animate-pulse" : "bg-green-500/80 shadow-lg shadow-green-500/50"}`}>
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[8px] font-mono text-slate-500 whitespace-nowrap">GATE 3: CONVERSION</div>
                    </div>
                  </div>

                  {/* Central floating core glyph - Trishul motif representation */}
                  <div className="w-16 h-16 bg-gradient-to-tr from-astra-navy to-slate-900 border-2 border-astra-gold/60 rounded-xl flex items-center justify-center shadow-2xl relative shadow-astra-gold/20 transform hover:scale-110 transition-transform duration-500">
                    <Compass className="w-8 h-8 text-astra-gold animate-spin-slow" style={{ animationDuration: "12s" }} />
                    <div className="absolute -inset-1.5 border border-astra-gold/30 rounded-xl animate-pulse" />
                  </div>
                </div>

                {/* Vertical holographic scanner beam line */}
                <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse pointer-events-none" style={{ top: "45%" }} />
              </div>

              {/* State feedback indicators */}
              <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-500 text-[10px]">
                  <span>DIAGNOSTIC TELEMETRY LOG</span>
                  <span className="text-blue-400">ACTIVE</span>
                </div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">TARGET INSTANCE:</span>
                    <span className="text-slate-300 uppercase truncate max-w-[150px]" title={companyWebsite}>{companyWebsite || "NOT_DEFINED"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CONVERSION LATENCY:</span>
                    <span className={`font-semibold ${responseTime === "instant" ? "text-green-400" : "text-yellow-400"}`}>{responseTime === "instant" ? "OPTIMAL" : responseTime.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">NITI RISK RATIO:</span>
                    <span className={`font-semibold ${followUpMethod === "manual" ? "text-yellow-400" : "text-red-400"}`}>{followUpMethod === "manual" ? "WARNING" : "CRITICAL"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-4 text-[10px] font-mono text-slate-500 flex justify-between items-center relative z-10 w-full">
              <span>TRISHUL_ENGINE_V2_ONLINE</span>
              <span>© REVASTRA INTEL</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
