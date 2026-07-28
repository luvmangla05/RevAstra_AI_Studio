/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { 
  FolderDown, ShieldCheck, Video, Image, Database, Bot, 
  HelpCircle, MessageSquare, Plus, Clock, CheckCircle2, User, LogOut,
  Target, TrendingUp, Cpu, Workflow, Sliders, ChevronRight, Play, RotateCcw,
  Activity, AlertCircle, RefreshCw, Layers, Sparkles, Compass,
  Download, Check, FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assessment } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roadmap'); // Defaulting to the new Roadmap tab as requested
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportText, setSupportText] = useState('');

  // Assessment & logged-in user state
  const userEmail = localStorage.getItem('userEmail') || 'priya@apexestates.co';
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);

  // Growth goals state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'automate_whatsapp',
    'qualify_visits',
    'premium_creative'
  ]);

  // Selected phase index for the detailed step drawer
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(2);

  // Sandbox simulation terminal logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // CRM Export & Integration states
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [crmPreset, setCrmPreset] = useState<'generic' | 'salesforce' | 'hubspot' | 'zoho'>('generic');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id', 'name', 'email', 'phone', 'company', 'source', 'status', 'score', 'leakRisk', 'growthGoals', 'package', 'createdAt'
  ]);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  // Fetch real assessments from server-side database
  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await fetch('/api/db/assessments');
        if (res.ok) {
          const assessments: Assessment[] = await res.json();
          const match = assessments.find(a => 
            a.email?.toLowerCase() === userEmail.toLowerCase() ||
            a.contactName?.toLowerCase() === userEmail.toLowerCase()
          );
          if (match) {
            setAssessment(match);
          } else if (assessments.length > 0) {
            // Pick first one as fallback
            setAssessment(assessments[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load assessments in Dashboard", err);
      } finally {
        setLoadingAssessment(false);
      }
    }
    fetchAssessments();
  }, [userEmail]);

  // Synchronize goals from matched assessment
  useEffect(() => {
    if (assessment) {
      const goals: string[] = [];
      const outcomes = assessment.desiredOutcomes || [];
      const services = assessment.servicesNeeded || [];
      
      if (outcomes.includes("Instant auto-response") || outcomes.some(o => o.toLowerCase().includes("whatsapp")) || services.some(s => s.toLowerCase().includes("whatsapp"))) {
        goals.push('automate_whatsapp');
      }
      if (outcomes.includes("Viewing booking links") || outcomes.some(o => o.toLowerCase().includes("booking")) || outcomes.some(o => o.toLowerCase().includes("visit")) || services.some(s => s.toLowerCase().includes("crm"))) {
        goals.push('qualify_visits');
      }
      if (services.some(s => s.toLowerCase().includes("creative")) || services.some(s => s.toLowerCase().includes("photoshoot")) || services.some(s => s.toLowerCase().includes("reels"))) {
        goals.push('premium_creative');
      }
      if (services.some(s => s.toLowerCase().includes("campaign")) || services.some(s => s.toLowerCase().includes("ads")) || outcomes.some(o => o.toLowerCase().includes("cpa"))) {
        goals.push('reduce_cpa');
      }
      if (assessment.trackingMethod === 'CRM' || services.some(s => s.toLowerCase().includes("reporting")) || outcomes.some(o => o.toLowerCase().includes("pipeline"))) {
        goals.push('pipeline_visibility');
      }
      
      if (goals.length > 0) {
        setSelectedGoals(goals);
        // Default active panel to the first active goal index
        const firstActiveIndex = roadmapPhases.findIndex(p => goals.includes(p.goalKey));
        if (firstActiveIndex !== -1) {
          setActivePhaseIndex(firstActiveIndex);
        }
      }
    }
  }, [assessment]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  // Fetch real leads from server-side database
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/db/leads');
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (err) {
        console.error("Failed to load leads in Dashboard", err);
      } finally {
        setLoadingLeads(false);
      }
    }
    fetchLeads();
  }, []);

  // Goals customization setup
  const goalsList = [
    { id: 'premium_creative', label: 'Upgrade Creative Brand Assets', desc: 'Drone tours & cinematic 9:16 vertical Reels.' },
    { id: 'reduce_cpa', label: 'Reduce Cost-Per-Acquisition', desc: 'Deploy target Meta lead ads & speed-optimized pages.' },
    { id: 'automate_whatsapp', label: 'Automate Instant WhatsApp Responses', desc: 'Deliver interactive project brochures in under 5 seconds.' },
    { id: 'qualify_visits', label: 'Qualify and Book Site Visits', desc: 'AI conversation qualifiers & round-robin agent links.' },
    { id: 'pipeline_visibility', label: 'Establish Unified Source of Truth', desc: 'Map leads automatically into real-time pipeline status cards.' }
  ];

  const CRM_PRESETS = {
    generic: {
      label: "Standard / Generic CSV",
      desc: "Optimized for raw spreadsheet analysis, custom databases, or custom CRM imports.",
      headers: {
        id: "Lead_ID",
        name: "Full_Name",
        email: "Email_Address",
        phone: "Phone_Number",
        company: "Company_Name",
        source: "Lead_Source",
        status: "Pipeline_Status",
        score: "Lead_Score",
        leakRisk: "Strategic_Leakage_Risk",
        growthGoals: "Active_Growth_Goals",
        package: "Recommended_Package",
        createdAt: "Capture_Timestamp"
      }
    },
    salesforce: {
      label: "Salesforce CRM",
      desc: "Uses Salesforce standard fields including lead scoring rules and custom campaign tracking.",
      headers: {
        id: "Contact_ID",
        name: "Full_Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        source: "LeadSource",
        status: "Status",
        score: "Rating_Score__c",
        leakRisk: "Strategic_Leakage_Risk__c",
        growthGoals: "Active_Growth_Goals__c",
        package: "Growth_Package__c",
        createdAt: "CreatedDate"
      }
    },
    hubspot: {
      label: "HubSpot CRM",
      desc: "Uses HubSpot standard contacts and deals layout with strategic maturity indicators.",
      headers: {
        id: "hs_object_id",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        company: "Company Name",
        source: "Original Source Type",
        status: "Lead Status",
        score: "HubSpot Score",
        leakRisk: "Leakage Risk Rate",
        growthGoals: "Selected Growth Goals",
        package: "Growth Operating Package",
        createdAt: "Create Date"
      }
    },
    zoho: {
      label: "Zoho CRM",
      desc: "Formatted for Zoho Leads module with standard field-mapping configurations.",
      headers: {
        id: "LEADID",
        name: "Full Name",
        email: "Email",
        phone: "Phone",
        company: "Company",
        source: "Lead Source",
        status: "Lead Status",
        score: "Lead Score Value",
        leakRisk: "Strategic Audit Score",
        growthGoals: "Strategic Initiatives",
        package: "Product Recommendation",
        createdAt: "Created Time"
      }
    }
  };

  const getExportableData = () => {
    // If we have leads loaded, we use them. Otherwise, use rich pre-populated rows.
    const baselineLeads = leads.length > 0 ? leads : [
      {
        id: "l_demo1",
        name: "Rajesh Singhania",
        email: "singhania.r@supremebuilders.in",
        phone: "+91 98765 43210",
        company: "Supreme Builders",
        source: "Chanakya Chatbot",
        status: "qualified",
        score: 85,
        createdAt: new Date().toISOString()
      },
      {
        id: "l_demo2",
        name: "Priya Sharma",
        email: "priya@apexestates.co",
        phone: "+91 99112 23344",
        company: "Apex Estates",
        source: "Growth System Builder",
        status: "new",
        score: 75,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "l_demo3",
        name: "Anand Malhotra",
        email: "anand@malhotrahomes.com",
        phone: "+91 98100 11223",
        company: "Malhotra Luxury Homes",
        source: "Meta Lead Ads",
        status: "brochure_shared",
        score: 92,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "l_demo4",
        name: "Karan Johar",
        email: "karan@joharproperties.in",
        phone: "+91 99999 88888",
        company: "Johar Properties",
        source: "Instagram Paid",
        status: "negotiating",
        score: 88,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];

    return baselineLeads.map(lead => {
      const activeGoals = selectedGoals.map(g => {
        const goalObj = goalsList.find(gl => gl.id === g);
        return goalObj ? goalObj.label : g;
      }).join(" | ");

      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company || assessment?.companyName || "Apex Estates",
        source: lead.source || "Organic Enquiry",
        status: lead.status || "new",
        score: lead.score || 70,
        leakRisk: assessment ? `${assessment.scores.leakRisk}%` : "85%",
        growthGoals: activeGoals || "Strategic Foundation",
        package: assessment?.recommendedPackage?.toUpperCase() || "ARJUNA",
        createdAt: new Date(lead.createdAt).toLocaleString()
      };
    });
  };

  const handleExportCSV = () => {
    const dataToExport = getExportableData();
    const preset = CRM_PRESETS[crmPreset];
    
    // Filter columns based on user selection
    const activeKeys = selectedColumns;
    const activeHeaders = activeKeys.map(k => (preset.headers as any)[k] || k);
    
    // Create CSV content
    const csvContent = [
      activeHeaders.join(","),
      ...dataToExport.map(row => {
        return activeKeys.map(key => {
          let val = (row as any)[key] !== undefined && (row as any)[key] !== null ? (row as any)[key] : "";
          const valStr = String(val);
          if (valStr.includes(",") || valStr.includes("\n") || valStr.includes('"')) {
            return `"${valStr.replace(/"/g, '""')}"`;
          }
          return valStr;
        }).join(",");
      })
    ].join("\n");
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const companyClean = (assessment?.companyName || "Apex_Estates").toLowerCase().replace(/\s+/g, "_");
    link.setAttribute("href", url);
    link.setAttribute("download", `revastra_growth_data_${companyClean}_${crmPreset}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 5000);
  };

  const handleToggleColumn = (col: string) => {
    setSelectedColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const performanceData = [
    { day: 'Mon', leads: 8, visits: 2 },
    { day: 'Tue', leads: 12, visits: 3 },
    { day: 'Wed', leads: 15, visits: 5 },
    { day: 'Thu', leads: 9, visits: 2 },
    { day: 'Fri', leads: 18, visits: 6 },
    { day: 'Sat', leads: 22, visits: 8 },
    { day: 'Sun', leads: 14, visits: 4 },
  ];

  const handleSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportText.trim()) return;
    setSupportSubmitted(true);
    setSupportText('');
  };

  // Goals customization setup has been declared above

  const handleToggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  // Step-based roadmap phases data mapping
  const roadmapPhases = [
    {
      index: 0,
      title: "Creative Production & Styling",
      timeline: "Weeks 1-2",
      goalKey: "premium_creative",
      system: "Astra Brand Creative",
      icon: Video,
      description: "Shoot & grade commercial walkthrough footage. Establish luxury visual design assets optimized for digital retention.",
      color: "from-amber-500 to-amber-600",
      milestones: [
        { text: "Drone site photography & raw 4K walkthrough clips", code: "RAW_INGEST_4K" },
        { text: "Custom lightroom preset grading & brand styling template creation", code: "LUT_GRADES_V1" },
        { text: "Render 5 high-retention 9:16 video reels with sound overlays", code: "REELS_EXPORT_916" },
        { text: "Upload final commercial assets to high-speed CDN client hubs", code: "CDN_DELIVERY_ZIP" }
      ],
      webhookTemplate: {
        event: "creative_assets_approved",
        payload: {
          project_id: assessment?.companyName ? assessment.companyName.toLowerCase().replace(/\s+/g, '_') : "skyline_residency",
          folder_url: "https://revastra.cdn/assets/premium-reel-pack.zip",
          total_reels: 5,
          color_grading: "Cinematic Warm",
          status: "ready_for_ads"
        }
      }
    },
    {
      index: 1,
      title: "High-Intent Traffic Channels",
      timeline: "Weeks 2-3",
      goalKey: "reduce_cpa",
      system: "Arjuna Traffic Suite",
      icon: Target,
      description: "Activate high-performance regional ad sets with multi-variant text assets & lightning-fast speed landing forms.",
      color: "from-rose-500 to-rose-600",
      milestones: [
        { text: "Verify Meta Pixel and conversion API callback scripts", code: "META_PIXEL_OK" },
        { text: "Configure geographic hyper-targeting for high-net-worth regions", code: "GEO_TARGET_HNW" },
        { text: "Launch 3 speed-optimized lead-capture mobile forms", code: "FORM_DEPLOY_SPA" },
        { text: "Draft conversion ad copy scripts tailored to regional languages", code: "COPY_WRITING_AD" }
      ],
      webhookTemplate: {
        event: "ad_lead_captured",
        payload: {
          lead_id: "lead_meta_984",
          source: "Instagram Paid",
          campaign: "Luxury Penthouses Noida",
          form_fields: { name: "Aarav Singhania", phone: "+91 98112 00344", email: "aarav@singh.co" },
          pixel_fired: true
        }
      }
    },
    {
      index: 2,
      title: "Conversational Response Core",
      timeline: "Weeks 3-4",
      goalKey: "automate_whatsapp",
      system: "Saarthi WhatsApp OS",
      icon: Cpu,
      description: "Hook your digital forms to official WhatsApp APIs. Instantly deliver high-definition brochures in 5 seconds.",
      color: "from-teal-500 to-teal-600",
      milestones: [
        { text: "Authenticate official WhatsApp Cloud API developer tokens", code: "WA_API_TOKEN" },
        { text: "Deploy automated pdf catalog sharing triggers on webhook call", code: "BROCHURE_DISPATCH" },
        { text: "Seed Chanakya AI context prompts for smart initial greetings", code: "CHANAKYA_PROMPT" },
        { text: "Activate spam filters to remove empty or junk phone logs", code: "FILTER_SPAM_BOT" }
      ],
      webhookTemplate: {
        endpoint: "POST /api/webhooks/whatsapp-response",
        payload: {
          recipient_phone: "+919811200344",
          template_name: "brochure_delivery_v2",
          parameters: {
            customer_name: "Aarav Singhania",
            project_name: "The Sovereign Crest",
            pdf_link: "https://revastra.cdn/catalogs/sovereign-crest.pdf"
          }
        }
      }
    },
    {
      index: 3,
      title: "Site-Visit Booking Funnels",
      timeline: "Weeks 4-5",
      goalKey: "qualify_visits",
      system: "Astra Booking Qualifier",
      icon: Workflow,
      description: "Convert digital brochure readers into live verified on-site appointments. Qualify leads dynamically.",
      color: "from-blue-500 to-blue-600",
      milestones: [
        { text: "Configure interactive qualification check questions", code: "QUAL_CHECK" },
        { text: "Load digital site-visit calendar invites and scheduler cards", code: "CALENDAR_SYNC" },
        { text: "Establish salesperson round-robin lead allocation algorithms", code: "ROUTING_RR" },
        { text: "Trigger instant SMS notification alerts to internal agents", code: "AGENT_SMS_NOTIFY" }
      ],
      webhookTemplate: {
        event: "appointment_confirmed",
        payload: {
          booking_id: "slot_8832",
          customer_name: "Aarav Singhania",
          scheduled_time: "2026-07-22T11:00:00+05:30",
          assigned_agent: "Rajesh K.",
          qualification_answers: { budget: "> 2 Crore", timeline: "Immediate", visits_done: 2 }
        }
      }
    },
    {
      index: 4,
      title: "Control Room & Dashboards",
      timeline: "Weeks 5+",
      goalKey: "pipeline_visibility",
      system: "Astra RevOps Dashboard",
      icon: Sliders,
      description: "Unify all active leads, message logs, booking logs and CPA data in a single high-contrast dashboard.",
      color: "from-indigo-500 to-indigo-600",
      milestones: [
        { text: "Set up real-time pipeline status sync with central storage", code: "PIPELINE_DB_SYNC" },
        { text: "Link Google/Meta ad accounts to pull hourly spending metrics", code: "ADS_API_LINK" },
        { text: "Configure response velocity tracking logs for each rep", code: "VELOCITY_LOGGER" },
        { text: "Generate weekly auto-emailed diagnostic performance updates", code: "REPORT_EMAIL_CRON" }
      ],
      webhookTemplate: {
        event: "dashboard_metric_update",
        payload: {
          metrics_snapshot_date: "2026-07-18",
          total_leads_captured: 98,
          average_response_time_seconds: 4.8,
          bookings_scheduled: 30,
          ad_spent_inr: 45000,
          cost_per_tour_booking: 1500
        }
      }
    }
  ];

  // Simulator runner
  const runWebhookSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setTerminalLogs([]);

    const logSteps = [
      `[10:42:01] 📥 INCOMING WEBHOOK: Detected Meta Ad Lead Submission...`,
      `[10:42:02] 🛡️ SYSTEM INTEGRITY: Authenticating signature header: OK`,
      `[10:42:04] 🧠 INTENT ANALYZER: Parsing customer name: "${assessment?.contactName || 'Priya Sharma'}"`,
      `[10:42:05] 💾 DATA SYNC: Storing record securely under workspace database. ID allocated: l_${Math.random().toString(36).substr(2, 5)}`,
      `[10:42:07] 💬 WA CHAT ENGINE: Initiating official API brochure trigger template "delivery_v2"`,
      `[10:42:08] 📤 DISPATCH: Sending HD Interactive PDF Brochure to WhatsApp client +91 99112 23344...`,
      `[10:42:10] 📱 DELIVERED: Client network handshake successful. Read tick status: ACTIVE (0.9s)`,
      `[10:42:12] 🤖 CHANAKYA CHAT: Waiting to assist on layout questions. System readiness 100% active.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setTerminalLogs(prev => [...prev, logSteps[currentStep]]);
      currentStep++;
      if (currentStep >= logSteps.length) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 900);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      
      {/* Top Banner Dashboard Navbar */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-display font-extrabold text-sm tracking-wider text-astra-navy">REVASTRA CLIENT HUB</span>
            <span className="bg-astra-navy text-white text-[9px] font-mono px-2 py-0.2 rounded font-bold uppercase">Active Workspace</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500 font-medium">
              Partner: {assessment?.companyName || 'Skyline Residency Pvt Ltd'}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 font-mono text-[11px] bg-slate-50 px-2.5 py-1 rounded border border-slate-100 font-semibold text-astra-gold">
              Package: {assessment?.recommendedPackage ? assessment.recommendedPackage.toUpperCase() : 'ARJUNA'}
            </span>
            <button 
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 rounded hover:bg-red-50 transition font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation Tabs */}
        <div className="space-y-2 lg:col-span-1">
          {[
            { id: 'roadmap', label: 'Growth Roadmap (Timeline)' },
            { id: 'overview', label: 'Overview & Pipelines' },
            { id: 'crm-export', label: 'CRM Export & Integrations' },
            { id: 'creative', label: 'Creative Folders (Photos/Reels)' },
            { id: 'onboarding', label: 'Onboarding On-Track' },
            { id: 'support', label: 'Submit Ticket Support' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-3 rounded-lg text-xs font-semibold border transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-astra-navy text-white border-astra-navy shadow-md translate-x-1' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Quick diagnostic card context */}
          {assessment && (
            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-xs space-y-3.5 mt-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-astra-gold" />
                <h4 className="font-display font-bold text-xs text-astra-navy">Strategic Audit Specs</h4>
              </div>
              <div className="space-y-2 text-[11px] text-slate-500 font-mono">
                <div className="flex justify-between border-b pb-1 border-slate-50">
                  <span>Leakage Risk:</span>
                  <span className="font-bold text-red-600">{assessment.scores.leakRisk}%</span>
                </div>
                <div className="flex justify-between border-b pb-1 border-slate-50">
                  <span>Enquiries Vol:</span>
                  <span className="font-semibold text-slate-700">{assessment.monthlyEnquiries}</span>
                </div>
                <div className="flex justify-between border-b pb-1 border-slate-50">
                  <span>Locations:</span>
                  <span className="font-semibold text-slate-700">{assessment.locationsCount} site(s)</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Urgency level:</span>
                  <span className="font-bold text-astra-gold">{assessment.urgency || 'Immediate'}</span>
                </div>
              </div>
              <Link 
                to={`/recommendation/${assessment.id}`}
                className="block text-center text-[10px] text-astra-navy bg-astra-gold/10 hover:bg-astra-gold hover:text-astra-navy transition rounded py-1.5 font-bold font-mono"
              >
                VIEW DIAGNOSTIC REPORT
              </Link>
            </div>
          )}
        </div>

        {/* Dynamic Content Panel */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'roadmap' && (
            <div className="space-y-8">
              
              {/* Introduction Banner */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-40 pointer-events-none" />
                <div className="space-y-2 max-w-xl">
                  <span className="bg-astra-gold/15 text-astra-gold-dark text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Strategic Execution Plan
                  </span>
                  <h2 className="font-display text-xl font-bold text-astra-navy">
                    Phased Growth Roadmap Visualization
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    This step-based interactive timeline guides your business from cinematic branding to automated WhatsApp responses and CRM pipeline control. Toggle goals below to dynamically adapt your roadmap in real-time.
                  </p>
                </div>
              </div>

              {/* Goal Selector Controls Panel */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-astra-gold" />
                    <h3 className="font-display font-bold text-sm text-astra-navy">Select and Adapt Your Goals</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedGoals.length} of {goalsList.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {goalsList.map(goal => {
                    const isChecked = selectedGoals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => handleToggleGoal(goal.id)}
                        className={`text-left p-3.5 rounded-xl border text-xs transition-all duration-300 flex items-start space-x-3 ${
                          isChecked 
                            ? 'bg-white border-astra-gold shadow-sm ring-1 ring-astra-gold/20' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors ${isChecked ? 'bg-astra-gold border-astra-gold text-white' : 'border-slate-300 bg-white'}`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white fill-white" />}
                        </span>
                        <div>
                          <p className={`font-bold transition-colors ${isChecked ? 'text-astra-navy' : 'text-slate-600'}`}>{goal.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{goal.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step-Based Timeline Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Visual Step Timeline Tree */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-6">
                  <h4 className="font-display font-bold text-sm text-astra-navy pb-2 border-b border-slate-50">
                    Strategy Steps & Progress
                  </h4>

                  <div className="relative pl-6 space-y-8">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[34px] top-4 bottom-4 w-0.5 bg-slate-100" />

                    {roadmapPhases.map((phase, idx) => {
                      const isActiveGoal = selectedGoals.includes(phase.goalKey);
                      const isSelectedPanel = activePhaseIndex === idx;
                      const PhaseIcon = phase.icon;

                      return (
                        <div key={idx} className="relative flex items-start space-x-4">
                          
                          {/* Circle Step Number Node */}
                          <button
                            onClick={() => setActivePhaseIndex(idx)}
                            className={`absolute left-[-26px] w-9 h-9 rounded-full flex items-center justify-center border-2 font-mono text-xs font-bold transition-all duration-300 z-10 ${
                              isSelectedPanel 
                                ? 'bg-astra-navy border-astra-gold text-astra-gold scale-110 shadow-md shadow-astra-navy/15'
                                : isActiveGoal
                                ? 'bg-white border-astra-gold text-astra-gold-dark'
                                : 'bg-slate-50 border-slate-200 text-slate-300'
                            }`}
                          >
                            <PhaseIcon className="w-4 h-4" />
                          </button>

                          <div className="flex-1 min-w-0 pl-4">
                            <button
                              onClick={() => setActivePhaseIndex(idx)}
                              className="text-left w-full focus:outline-none"
                            >
                              <div className="flex justify-between items-center">
                                <p className={`font-display font-bold text-xs ${isSelectedPanel ? 'text-astra-navy text-[13px]' : isActiveGoal ? 'text-slate-700' : 'text-slate-400'}`}>
                                  {phase.title}
                                </p>
                                <span className="text-[9px] font-mono text-slate-400 font-semibold">{phase.timeline}</span>
                              </div>
                              <p className={`text-[10px] mt-0.5 line-clamp-1 ${isActiveGoal ? 'text-slate-400 font-medium' : 'text-slate-300 italic'}`}>
                                {phase.description}
                              </p>

                              {/* Small status pills */}
                              <div className="flex space-x-1.5 mt-2">
                                <span className={`text-[8px] font-mono px-2 py-0.2 rounded font-bold uppercase ${
                                  isActiveGoal ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {isActiveGoal ? 'Active In Strategy' : 'Dormant (Goal off)'}
                                </span>
                                {isSelectedPanel && (
                                  <span className="bg-astra-gold text-white text-[8px] font-mono px-2 py-0.2 rounded font-bold uppercase animate-pulse">
                                    Inspecting
                                  </span>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Step Details Inspector Card */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {activePhaseIndex !== null && (
                      <motion.div
                        key={activePhaseIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        {/* Header metadata */}
                        <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-500 uppercase">
                                Step {activePhaseIndex + 1}
                              </span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded font-bold bg-astra-gold/10 text-astra-gold-dark uppercase font-semibold">
                                System: {roadmapPhases[activePhaseIndex].system}
                              </span>
                            </div>
                            <h3 className="font-display font-extrabold text-base text-astra-navy mt-1.5">
                              {roadmapPhases[activePhaseIndex].title}
                            </h3>
                          </div>
                          <span className="font-mono text-xs font-bold text-astra-gold">
                            {roadmapPhases[activePhaseIndex].timeline}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {roadmapPhases[activePhaseIndex].description}
                        </p>

                        {/* Checkbox-based Milestones & Tasks list */}
                        <div className="space-y-2.5">
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                            Execution Checklist & Deliverables:
                          </p>
                          <div className="space-y-2">
                            {roadmapPhases[activePhaseIndex].milestones.map((milestone, mIdx) => (
                              <div 
                                key={mIdx} 
                                className="flex items-center justify-between p-2.5 border border-slate-50 bg-slate-50/50 rounded-lg text-xs"
                              >
                                <div className="flex items-center space-x-2.5">
                                  <input 
                                    type="checkbox" 
                                    defaultChecked={selectedGoals.includes(roadmapPhases[activePhaseIndex].goalKey)}
                                    className="rounded text-astra-gold border-slate-300 focus:ring-astra-gold w-3.5 h-3.5"
                                  />
                                  <span className="font-medium text-slate-700">{milestone.text}</span>
                                </div>
                                <span className="text-[8px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {milestone.code}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Architectural Honesty Webhook payload inspect block */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                            RevOps System API payload context:
                          </p>
                          <div className="p-3.5 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto max-h-40 shadow-inner">
                            <span className="text-teal-400 font-bold">
                              {activePhaseIndex === 2 ? 'ENDPOINT: ' : 'EVENT_NAME: '}
                            </span>
                            {activePhaseIndex === 2 
                              ? (roadmapPhases[activePhaseIndex] as any).webhookTemplate.endpoint 
                              : (roadmapPhases[activePhaseIndex] as any).webhookTemplate.event
                            }
                            <pre className="mt-2 text-slate-400">
                              {JSON.stringify(roadmapPhases[activePhaseIndex].webhookTemplate.payload, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {/* Strategy alignment message */}
                        {!selectedGoals.includes(roadmapPhases[activePhaseIndex].goalKey) && (
                          <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-[11px] flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Strategy Hold:</strong> This phase is currently dormant because its associated goal is unselected in your parameters list above.
                            </span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions footer inside details */}
                  <div className="pt-6 border-t border-slate-50 mt-6 flex flex-col sm:flex-row gap-3 justify-end items-center text-xs">
                    <span className="text-slate-400 font-medium text-[11px]">
                      Aligns with: <strong className="text-slate-600">{roadmapPhases[activePhaseIndex].system}</strong>
                    </span>
                    <button
                      onClick={() => alert(`Strategic proposal verified for Phase ${activePhaseIndex + 1}. A systems engineer will contact you shortly to deploy this component.`)}
                      className="w-full sm:w-auto bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-bold px-4 py-2 rounded transition shadow-sm text-center"
                    >
                      Request Phase Activation
                    </button>
                  </div>
                </div>

              </div>

              {/* Dynamic Webhook Pipeline Ingestion Sandbox */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-sm text-astra-navy flex items-center">
                      <Cpu className="w-4.5 h-4.5 text-astra-gold mr-1.5" />
                      Live RevOps System Ingestion Sandbox
                    </h3>
                    <p className="text-[11px] text-slate-400">Simulate real-time Meta Lead webhooks processing, duplicate filtering, and instant WhatsApp brochures.</p>
                  </div>

                  <button
                    onClick={runWebhookSimulation}
                    disabled={isSimulating}
                    className="px-4 py-2 bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy disabled:bg-slate-100 disabled:text-slate-400 font-bold text-xs rounded transition flex items-center space-x-1.5 shadow"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isSimulating ? "Simulating..." : "Trigger Lead webhook pipeline"}</span>
                  </button>
                </div>

                {/* Simulated Terminal screen */}
                <div className="p-4 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 space-y-2 min-h-48 max-h-60 overflow-y-auto shadow-inner border border-slate-800">
                  {terminalLogs.length === 0 ? (
                    <div className="text-slate-500 italic py-12 text-center flex flex-col items-center justify-center space-y-2">
                      <RefreshCw className="w-8 h-8 animate-pulse text-slate-600" />
                      <span>Console idle. Click the trigger button above to fire a simulated Meta lead webhook payload.</span>
                    </div>
                  ) : (
                    terminalLogs.map((log, lIdx) => (
                      <div key={lIdx} className="leading-relaxed animate-fade-in">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Campaign Leads</p>
                  <p className="text-2xl font-extrabold text-astra-navy">98 Leads</p>
                  <p className="text-[9px] text-green-500 font-semibold font-mono">● Active Webhooks Online</p>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Site Visits Confirmed</p>
                  <p className="text-2xl font-extrabold text-astra-gold">30 Bookings</p>
                  <p className="text-[9px] text-slate-400 font-mono">Conversion Ratio: 30.6%</p>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">WhatsApp Responses Sent</p>
                  <p className="text-2xl font-extrabold text-slate-800">98 Delivered</p>
                  <p className="text-[9px] text-slate-400 font-mono">Response Speed: 2 seconds avg</p>
                </div>
              </div>

              {/* Recharts Analytics chart */}
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-4">
                <div>
                  <h4 className="font-display font-bold text-sm text-astra-navy">Campaign Growth & Conversion Graphs</h4>
                  <p className="text-[11px] text-slate-400">Hourly logs of Meta enquiries versus direct WhatsApp site registrations.</p>
                </div>
                
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.05)" />
                      <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                      <YAxis stroke="#64748B" fontSize={10} />
                      <Tooltip />
                      <Line type="monotone" dataKey="leads" stroke="#0F172A" strokeWidth={2.5} name="Total Leads Captured" />
                      <Line type="monotone" dataKey="visits" stroke="#D4AF37" strokeWidth={2.5} name="Tours Scheduled" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Pipeline Board */}
              <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-4">
                <h4 className="font-display font-bold text-sm text-astra-navy">Live Route Pipeline status</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 border border-slate-100 bg-slate-50 rounded space-y-2">
                    <p className="font-bold text-slate-800 border-b pb-1">1. Enquiries Verified (40)</p>
                    <p className="text-[10px] text-slate-400">Lead detail checked by webhook rules.</p>
                  </div>
                  <div className="p-3 border border-slate-100 bg-slate-50 rounded space-y-2">
                    <p className="font-bold text-slate-800 border-b pb-1 text-astra-gold">2. Brochure Shared (30)</p>
                    <p className="text-[10px] text-slate-400">PDF brochure delivered on WhatsApp.</p>
                  </div>
                  <div className="p-3 border border-slate-100 bg-slate-50 rounded space-y-2">
                    <p className="font-bold text-slate-800 border-b pb-1">3. Consultation Call (18)</p>
                    <p className="text-[10px] text-slate-400">30-min strategy slots locked.</p>
                  </div>
                  <div className="p-3 border border-slate-100 bg-slate-50 rounded space-y-2">
                    <p className="font-bold text-slate-800 border-b pb-1 text-green-600">4. Negotiating Deal (10)</p>
                    <p className="text-[10px] text-slate-400">Active pricing negotiation.</p>
                  </div>
                </div>
              </div>

              {/* Sync with CRM Alert Callout */}
              <div className="p-5 rounded-xl bg-astra-navy text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-5 h-5 text-astra-gold animate-bounce" />
                    <h5 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Configure External CRM Integration</h5>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Export your real-time campaign leads and comprehensive business growth diagnostics formatted specifically for Salesforce, HubSpot, or Zoho.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('crm-export')}
                  className="px-5 py-2.5 bg-astra-gold hover:bg-white text-astra-navy font-bold text-xs rounded transition duration-200 uppercase font-mono tracking-wider shadow whitespace-nowrap"
                >
                  Configure & Export CRM CSV &rarr;
                </button>
              </div>

            </div>
          )}

          {activeTab === 'crm-export' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Introduction Banner */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-40 pointer-events-none" />
                <div className="space-y-2 max-w-xl">
                  <span className="bg-astra-gold/15 text-astra-gold-dark text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                    RevOps Integrations
                  </span>
                  <h2 className="font-display text-xl font-bold text-astra-navy">
                    CRM Integration & Growth Export Hub
                  </h2>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Map your live campaign lead intelligence, WhatsApp engagement telemetry, and strategic business diagnostics into a specialized CRM-ready CSV format. Standardized field alignments are supported out-of-the-box.
                  </p>
                </div>
              </div>

              {/* Success Notification Banner */}
              <AnimatePresence>
                {showExportSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-start space-x-3 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-xs">CSV Export Successfully Prepared & Downloaded!</p>
                      <p className="text-[10px] text-emerald-700 leading-relaxed">
                        Your file <strong>revastra_growth_data_{(assessment?.companyName || "Apex_Estates").toLowerCase().replace(/\s+/g, "_")}_{crmPreset}.csv</strong> containing {getExportableData().length} records was triggered for browser download. You can import this file directly into the leads or custom objects mapping wizard of your {CRM_PRESETS[crmPreset].label} account.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Configuration Panel Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Preset and Column Mapping */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* CRM Preset Selector */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="font-display font-bold text-sm text-astra-navy border-b border-slate-50 pb-2 flex items-center">
                      <Sliders className="w-4 h-4 text-astra-gold mr-1.5" />
                      1. Choose CRM Preset Destination
                    </h3>
                    
                    <div className="space-y-3">
                      {(Object.keys(CRM_PRESETS) as Array<keyof typeof CRM_PRESETS>).map(key => {
                        const isPresetActive = crmPreset === key;
                        const presetData = CRM_PRESETS[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setCrmPreset(key)}
                            className="w-full text-left p-3.5 rounded-xl border text-xs transition-all duration-300 flex flex-col justify-start space-y-1 bg-white border-slate-200 text-slate-500 hover:bg-slate-50 focus:outline-none"
                            style={isPresetActive ? { borderColor: '#D4AF37', boxShadow: '0 1px 3px rgba(212,175,55,0.2)' } : {}}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className={`font-bold transition-colors ${isPresetActive ? 'text-astra-navy text-xs' : 'text-slate-600'}`}>
                                {presetData.label}
                              </span>
                              <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isPresetActive ? 'bg-astra-gold border-astra-gold text-white' : 'border-slate-300 bg-white'}`}>
                                {isPresetActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium leading-relaxed">
                              {presetData.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Columns Selector */}
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="font-display font-bold text-sm text-astra-navy border-b border-slate-50 pb-2 flex items-center">
                      <Database className="w-4 h-4 text-astra-gold mr-1.5" />
                      2. Filter Columns to Include
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {Object.keys(CRM_PRESETS[crmPreset].headers).map(colKey => {
                        const isSelected = selectedColumns.includes(colKey);
                        const crmHeader = (CRM_PRESETS[crmPreset].headers as any)[colKey];
                        return (
                          <button
                            key={colKey}
                            onClick={() => handleToggleColumn(colKey)}
                            className={`p-2.5 rounded-lg border text-left flex items-start space-x-2 transition-all duration-200 ${
                              isSelected 
                                ? 'bg-slate-50 border-slate-200 text-slate-800' 
                                : 'bg-white border-slate-100 text-slate-300 line-through'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-astra-gold border-astra-gold text-white' : 'border-slate-200 bg-white'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{crmHeader}</p>
                              <p className="text-[8px] text-slate-400 truncate uppercase font-mono">key: {colKey}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Side: Data Preview and Export Actions */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <div>
                        <h3 className="font-display font-bold text-sm text-astra-navy">
                          3. Real-time Growth Data Preview
                        </h3>
                        <p className="text-[10px] text-slate-400">First few rows configured to your mapped parameters.</p>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                        {getExportableData().length} Total Rows Ready
                      </span>
                    </div>

                    {/* Preview Table Container */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden shadow-inner max-w-full overflow-x-auto bg-slate-950">
                      <table className="w-full text-[10px] font-mono text-slate-300 text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[9px]">
                            {selectedColumns.map(colKey => {
                              const headerName = (CRM_PRESETS[crmPreset].headers as any)[colKey];
                              return (
                                <th key={colKey} className="p-3 border-r border-slate-800">
                                  {headerName}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {getExportableData().slice(0, 4).map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-900/50 hover:bg-slate-900/40 transition">
                              {selectedColumns.map(colKey => {
                                const cellVal = (row as any)[colKey];
                                return (
                                  <td key={colKey} className="p-3 border-r border-slate-900 truncate max-w-[120px]" title={cellVal}>
                                    {cellVal}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Quick CSV Syntax Breakdown */}
                    <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <p className="font-bold text-astra-navy text-[11px] flex items-center">
                        <ShieldCheck className="w-4 h-4 text-astra-gold mr-1" />
                        CRM Validation Verified
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Double quotes escaping, line-break compliance, and RFC-4180 standard parameters are completely guaranteed. No data overlap, commas, or formatting corruption will happen during importation.
                      </p>
                    </div>

                  </div>

                  {/* Actions Area */}
                  <div className="pt-6 border-t border-slate-50 mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">MAPPED FILE NAME:</p>
                      <p className="text-xs font-bold text-slate-600 font-mono mt-0.5 truncate max-w-[280px]">
                        revastra_growth_{(assessment?.companyName || "Apex_Estates").toLowerCase().replace(/\s+/g, "_")}_{crmPreset}.csv
                      </p>
                    </div>

                    <button
                      onClick={handleExportCSV}
                      disabled={selectedColumns.length === 0}
                      className="w-full sm:w-auto bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy disabled:bg-slate-100 disabled:text-slate-300 font-bold px-6 py-3 rounded transition shadow flex items-center justify-center space-x-2 text-xs uppercase font-mono tracking-wider"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download CRM CSV File</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {activeTab === 'creative' && (
            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-xs space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-astra-navy flex items-center">
                  <Video className="w-5 h-5 text-astra-gold mr-2" />
                  Your Cinematic Creative Asset Folders
                </h3>
                <p className="text-xs text-slate-400">Download high-definition edited photographs, commercial videos, and color-graded reels.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                
                {/* Reel item */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Reel: Walkthrough High-end Plot</p>
                    <p className="text-[10px] text-slate-400 mt-1">Edited: Grading OK | Cinematic Drone | 9:16 Format</p>
                  </div>
                  <a 
                    href="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy rounded"
                    title="Download folder"
                  >
                    Download HD
                  </a>
                </div>

                {/* Reel item */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Reel: Elite Entrance Walkthrough</p>
                    <p className="text-[10px] text-slate-400 mt-1">Edited: Grading OK | Audio Overlayed | 9:16 Format</p>
                  </div>
                  <a 
                    href="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy rounded"
                    title="Download folder"
                  >
                    Download HD
                  </a>
                </div>

                {/* Photo grid item */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Photo Catalog: 24 Premium High-Res Shots</p>
                    <p className="text-[10px] text-slate-400 mt-1">Edited: Color Corrected | Print & Digital | ZIP Archive</p>
                  </div>
                  <a 
                    href="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy rounded"
                    title="Download folder"
                  >
                    Download ZIP
                  </a>
                </div>

                {/* Drone footages */}
                <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-800">Aerial Footage: Drone raw & graded clips</p>
                    <p className="text-[10px] text-slate-400 mt-1">Edited: ProRes Grade | site layouts | 16:9 Format</p>
                  </div>
                  <a 
                    href="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy rounded"
                    title="Download folder"
                  >
                    Download HD
                  </a>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'onboarding' && (
            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-xs space-y-6">
              <h3 className="font-display font-bold text-base text-astra-navy">Project Launch Checklist & Onboarding</h3>
              <p className="text-xs text-slate-400">Track tasks needed to launch campaigns and automation webhooks.</p>
              
              <div className="space-y-4 text-xs">
                {[
                  { text: "1. Brand Asset photoshoot & high-definition raw recording", status: "complete" },
                  { text: "2. Color grading & video overlay sync edits complete", status: "complete" },
                  { text: "3. WhatsApp Business API cloud client authentication", status: "complete" },
                  { text: "4. Facebook Business Ads Account integration & cards setup", status: "complete" },
                  { text: "5. CRM lead round-robin rules setup in dashboards", status: "complete" },
                  { text: "6. Chanakya live representative custom training", status: "pending" },
                  { text: "7. Automated WhatsApp brochure flows launch activation", status: "pending" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 border border-slate-100 bg-slate-50 rounded">
                    <span className="font-medium text-slate-700">{item.text}</span>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase font-mono font-bold ${item.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-astra-gold/10 text-astra-gold animate-pulse'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-xs space-y-6">
              <h3 className="font-display font-bold text-base text-astra-navy">Submit a Systems Support Ticket</h3>
              <p className="text-xs text-slate-400">Need rules modified, ad budgets paused, or a quick reshoot? Forward details below.</p>
              
              {supportSubmitted ? (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto" />
                  <h4 className="font-bold text-xs text-slate-800">Ticket Dispatched Successfully</h4>
                  <p className="text-[10px] text-slate-400">We have locked this ticket. A senior systems engineer will contact you directly on WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={handleSupport} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Inquiry category</label>
                    <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded font-semibold text-slate-700">
                      <option value="ad-pause">Pause / Adjust Campaign Ad Budgets</option>
                      <option value="api-mod">Modify WhatsApp Auto-Message Rules</option>
                      <option value="reshoot">Schedule Additional drone/reels shoot</option>
                      <option value="reporting">Dashboard metric corrections</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Details & Scope modification brief</label>
                    <textarea 
                      rows={4}
                      required
                      value={supportText}
                      onChange={(e) => setSupportText(e.target.value)}
                      placeholder="e.g., We need to pause ads for Sector 5 project as inventory is completely booked..."
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded text-slate-800 font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="bg-astra-navy hover:bg-astra-gold text-white hover:text-astra-navy font-bold px-6 py-3 rounded transition shadow"
                  >
                    Dispatch Support Ticket
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
