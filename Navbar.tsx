import React, { useState, useRef } from 'react';
import { Menu, X, Phone, ShieldCheck, User, Sparkles, CreditCard } from 'lucide-react';
import { PageType } from '../types';
import { BrandLogo } from './BrandLogo';
import { SUPPORT_PHONE } from '../data/mockData';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isLoggedIn?: boolean;
  onAdminTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isLoggedIn = false,
  onAdminTrigger,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHoldingLogo, setIsHoldingLogo] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const didTriggerAdminRef = useRef(false);

  const startHold = () => {
    didTriggerAdminRef.current = false;
    setIsHoldingLogo(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 850; // 850ms comfortable long-press

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setHoldProgress(pct);
    }, 40);

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      didTriggerAdminRef.current = true;
      setIsHoldingLogo(false);
      setHoldProgress(100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([60, 40, 60]); } catch (_) {}
      }
      if (onAdminTrigger) {
        onAdminTrigger();
      }
    }, duration);
  };

  const cancelHold = () => {
    setIsHoldingLogo(false);
    setHoldProgress(0);
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (didTriggerAdminRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didTriggerAdminRef.current = false;
      return;
    }
    handleNav('home');
  };

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { label: string; page: PageType; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'How It Works', page: 'home' },
    { label: '$210 Offer Details', page: 'offer-details', badge: 'Special' },
    { label: 'Pay Bill', page: 'payment' },
    { label: 'Customer Portal', page: 'portal' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top utility sub-header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Licensed NY Energy Supplier (ESCO)
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Serving Con Edison, National Grid, NYSEG & more</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:18005554686"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{SUPPORT_PHONE}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNav('portal')}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <User className="w-3 h-3" />
              {isLoggedIn ? 'My Account' : 'Customer Login'}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Long-Press Admin Gateway */}
          <div className="relative">
            <button
              onClick={handleLogoClick}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              onTouchCancel={cancelHold}
              onContextMenu={(e) => e.preventDefault()}
              className={`flex items-center gap-2 text-left focus:outline-hidden transition-all duration-200 select-none cursor-pointer rounded-2xl p-1 relative ${
                isHoldingLogo ? 'scale-95 bg-amber-500/10 ring-2 ring-amber-400' : 'hover:opacity-95'
              }`}
              title="Hounds Power and Gas (Press and hold for Admin Login)"
            >
              <BrandLogo size="md" />
              {/* Visual progress bar while long-pressing */}
              {isHoldingLogo && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 text-[10px] font-bold shadow-lg border border-amber-400 whitespace-nowrap z-50 animate-pulse">
                  Hold for Admin ({holdProgress}%)
                </span>
              )}
            </button>
          </div>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page && link.label !== 'How It Works';
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    if (link.label === 'How It Works') {
                      handleNav('home');
                      setTimeout(() => {
                        const el = document.getElementById('how-it-works-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      handleNav(link.page);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative cursor-pointer ${
                    isActive
                      ? 'text-blue-900 bg-blue-50/80 font-bold'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNav('portal')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-900" />
              <span>Portal</span>
            </button>
            <button
              onClick={() => handleNav('signup')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 shadow-md shadow-blue-900/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Get Started ($210 Credit)</span>
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => handleNav('portal')}
              className="p-2 text-slate-700 hover:text-blue-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Account Portal"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-900 rounded-lg hover:bg-slate-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mb-3 text-xs text-amber-900 font-medium">
            <strong>$210 Bill Credit Offer:</strong> Spread over 6 months ($35/mo) for new New York residential customers!
          </div>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                if (link.label === 'How It Works') {
                  handleNav('home');
                  setTimeout(() => {
                    const el = document.getElementById('how-it-works-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  handleNav(link.page);
                }
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <button
              onClick={() => handleNav('portal')}
              className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-900" />
              Customer Portal
            </button>
            <button
              onClick={() => handleNav('payment')}
              className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Pay Bill by Card
            </button>
            <button
              onClick={() => handleNav('signup')}
              className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-white bg-blue-900 hover:bg-blue-950 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Get Started ($210 Credit)
            </button>
          </div>
          <div className="pt-2 text-center text-xs text-slate-500">
            Need phone support? Call <a href="tel:18005554686" className="font-semibold text-blue-900">1-800-555-4686</a>
          </div>
        </div>
      )}
    </header>
  );
};
