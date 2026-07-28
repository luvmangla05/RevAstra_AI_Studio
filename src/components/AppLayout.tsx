import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  Users, 
  ShieldAlert, 
  BarChart3, 
  MessageSquareCode, 
  FileCheck2, 
  CheckSquare, 
  Bell, 
  Layers, 
  UserPlus, 
  CreditCard, 
  Settings, 
  LogOut, 
  Sparkles, 
  ChevronRight,
  Search,
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PLANS_CONFIG } from '../data/plansData';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [quickAsk, setQuickAsk] = useState('');

  const currentPlanConfig = user?.plan ? PLANS_CONFIG[user.plan] : PLANS_CONFIG.shunya;

  const navItems = [
    {
      category: 'CORE OVERVIEW',
      items: [
        { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/app/chanakya', label: 'Ask Chanakya AI', icon: Bot, badge: 'AI' }
      ]
    },
    {
      category: 'SALES & GROWTH TOOLS',
      items: [
        { path: '/app/crm', label: 'Free CRM', icon: Users },
        { path: '/app/lead-auditor', label: 'Lead Auditor', icon: ShieldAlert },
        { path: '/app/sales-auditor', label: 'Sales Process Auditor', icon: BarChart3 },
        { path: '/app/conversation-analyser', label: 'Conversation Analyser', icon: MessageSquareCode },
        { path: '/app/quotation-assistant', label: 'Quotation Assistant', icon: FileCheck2 }
      ]
    },
    {
      category: 'OPERATIONS',
      items: [
        { path: '/app/tasks', label: 'Tasks & Reminders', icon: CheckSquare },
        { path: '/app/reports', label: 'Reports & Analytics', icon: BarChart3 },
        { path: '/app/notifications', label: 'Notifications', icon: Bell }
      ]
    },
    {
      category: 'ORGANIZATION',
      items: [
        { path: '/app/integrations', label: 'Integrations', icon: Layers },
        { path: '/app/team', label: 'Team Seats', icon: UserPlus },
        { path: '/app/billing', label: 'Billing & Plan', icon: CreditCard, highlight: true },
        { path: '/app/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  const handleQuickAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAsk.trim()) return;
    navigate('/app/chanakya', { state: { initialPrompt: quickAsk } });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-astra-navy text-white border-b border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link to="/app/dashboard" className="flex items-center space-x-2">
            <span className="font-display text-xl font-bold tracking-tight text-white flex items-center">
              Rev<span className="text-astra-gold">Astra</span>
              <span className="ml-2 text-[9px] uppercase tracking-wider bg-astra-gold/20 text-astra-gold border border-astra-gold/30 px-1.5 py-0.5 rounded font-mono font-semibold">
                OS
              </span>
            </span>
          </Link>
        </div>

        {/* Quick Ask Chanakya Bar */}
        <form onSubmit={handleQuickAskSubmit} className="hidden md:flex items-center max-w-md w-full mx-4">
          <div className="relative w-full">
            <input 
              type="text"
              value={quickAsk}
              onChange={(e) => setQuickAsk(e.target.value)}
              placeholder="Ask Chanakya (e.g. How to handle WhatsApp price objections?)..."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-9 pr-20 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-astra-gold focus:ring-1 focus:ring-astra-gold transition"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <button 
              type="submit"
              className="absolute right-1 top-1 bg-astra-gold text-astra-navy hover:bg-amber-400 text-[10px] font-bold px-2 py-0.5 rounded transition flex items-center"
            >
              Ask <ChevronRight className="w-2.5 h-2.5 ml-0.5" />
            </button>
          </div>
        </form>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          <Link 
            to="/app/billing" 
            className="hidden sm:flex items-center space-x-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full hover:bg-amber-500/20 transition"
          >
            <Sparkles className="w-3 h-3 text-astra-gold animate-pulse" />
            <span>Plan: {currentPlanConfig.name}</span>
          </Link>

          <Link 
            to="/app/crm" 
            className="hidden sm:flex items-center bg-astra-gold text-astra-navy font-bold text-xs px-3 py-1.5 rounded-md hover:bg-amber-400 transition"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            New Lead
          </Link>

          <Link to="/app/notifications" className="relative p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-astra-gold/20 text-astra-gold font-bold text-xs flex items-center justify-center border border-astra-gold/40">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                {user?.businessName || user?.name || 'Business'}
              </p>
              <p className="text-[10px] text-slate-400 truncate capitalize max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 top-16
          ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 overflow-y-auto flex-1 space-y-6">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5 font-mono">
                  {group.category}
                </p>
                {group.items.map((item, iIdx) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all
                        ${isActive 
                          ? 'bg-astra-navy text-white shadow-sm font-semibold' 
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-astra-navy'}
                      `}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-astra-gold' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-astra-gold text-astra-navy' : 'bg-amber-100 text-amber-800'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Bottom Banner & Logout */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 space-y-2">
            <div className="bg-astra-navy/5 border border-astra-navy/10 rounded-lg p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-astra-navy uppercase">Free Business Tools</span>
                <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded">Active</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Free CRM, Lead Auditor & GST Quotations enabled.
              </p>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
            >
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4 text-slate-400" />
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Backdrop for Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-6 pb-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                {title && <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display tracking-tight">{title}</h1>}
                {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
