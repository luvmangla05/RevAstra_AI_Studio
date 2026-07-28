import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Bot, ArrowRight, User, Sparkles, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isLinkActive = (path: string) => {
    return location.pathname === path ? 'text-astra-gold font-bold' : 'text-slate-600 hover:text-astra-navy font-medium';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-display text-2xl font-bold tracking-tight text-astra-navy flex items-center">
                Rev<span className="text-astra-gold font-semibold">Astra</span>
                <span className="ml-2 text-[10px] uppercase tracking-widest bg-astra-navy text-white px-2 py-0.5 rounded font-mono font-semibold">
                  Growth OS
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            <Link to="/" className={`text-sm ${isLinkActive('/')}`}>Home</Link>
            <Link to="/products" className={`text-sm ${isLinkActive('/products')}`}>Products</Link>
            <Link to="/pricing" className={`text-sm ${isLinkActive('/pricing')}`}>Pricing</Link>
            <Link to="/industries" className={`text-sm ${isLinkActive('/industries')}`}>Industries</Link>
            <Link to="/how-it-works" className={`text-sm ${isLinkActive('/how-it-works')}`}>How It Works</Link>
            <Link to="/about" className={`text-sm ${isLinkActive('/about')}`}>About</Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link 
              to="/talk-to-chanakya" 
              className="text-xs text-astra-navy hover:text-astra-gold flex items-center px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-white font-medium transition"
            >
              <Bot className="w-3.5 h-3.5 mr-1.5 text-astra-gold animate-pulse" />
              Ask Chanakya
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-astra-navy text-white text-xs px-3.5 py-2 rounded-lg font-medium hover:bg-slate-800 transition"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-astra-gold" />
                  <span>{user.name || 'My App'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{user.businessName || user.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">Plan: <span className="text-astra-gold font-bold">{user.plan}</span></p>
                    </div>
                    <Link
                      to="/app/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-astra-navy" />
                      App Dashboard
                    </Link>
                    <Link
                      to="/app/crm"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Free CRM
                    </Link>
                    <Link
                      to="/app/billing"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Subscription & Billing
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-xs text-slate-700 hover:text-astra-navy px-3.5 py-2 font-semibold transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-xs text-white bg-astra-navy hover:bg-astra-gold hover:text-astra-navy flex items-center px-4 py-2 rounded-lg font-bold transition shadow-sm"
                >
                  <Sparkles className="w-3 h-3 mr-1 text-astra-gold" />
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded text-sm text-slate-700 font-medium hover:bg-slate-50">Home</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded text-sm text-slate-700 font-medium hover:bg-slate-50">Products</Link>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded text-sm text-slate-700 font-medium hover:bg-slate-50">Pricing</Link>
            <Link to="/industries" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded text-sm text-slate-700 font-medium hover:bg-slate-50">Industries</Link>
            <Link to="/how-it-works" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded text-sm text-slate-700 font-medium hover:bg-slate-50">How It Works</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded text-sm text-slate-700 font-medium hover:bg-slate-50">About</Link>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/app/dashboard" onClick={() => setIsOpen(false)} className="w-full flex items-center justify-center py-2.5 bg-astra-navy text-white text-sm font-bold rounded-lg">
                  Go to App Dashboard
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); logout(); navigate('/'); }}
                  className="w-full py-2 text-center text-xs text-red-600 hover:underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2 bg-astra-navy text-white text-sm font-bold rounded-lg">
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
