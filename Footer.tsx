import React from 'react';
import { PageType } from '../types';
import { BrandLogo } from './BrandLogo';
import { COMPANY_NAME, TAGLINE, SUPPORT_PHONE, SUPPORT_EMAIL, EMERGENCY_INFO } from '../data/mockData';
import { Phone, Mail, ShieldAlert, AlertTriangle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onAdminTrigger }) => {
  const [isHoldingLogo, setIsHoldingLogo] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHoldingLogo(true);
    timerRef.current = setTimeout(() => {
      setIsHoldingLogo(false);
      if (onAdminTrigger) onAdminTrigger();
    }, 850);
  };

  const endHold = () => {
    setIsHoldingLogo(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleLink = (page: PageType) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-sm">
      {/* Top emergency notice bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Gas Odor or Power Emergency?</strong> If you smell gas or see downed power lines, leave immediately and call your utility directly:
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-slate-300 font-mono text-[11px]">
            <span>Con Edison: <a href="tel:18007526633" className="text-amber-400 underline">{EMERGENCY_INFO.conEd}</a></span>
            <span>National Grid: <a href="tel:18008675222" className="text-amber-400 underline">{EMERGENCY_INFO.natGridGas}</a></span>
            <span>Or Call <strong className="text-amber-300">911</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              onTouchCancel={endHold}
              onContextMenu={(e) => e.preventDefault()}
              className={`inline-block cursor-pointer select-none transition-transform rounded-2xl p-1 ${
                isHoldingLogo ? 'scale-95 ring-2 ring-amber-400 bg-amber-500/10' : ''
              }`}
              title="Hounds Power and Gas (Hold for Admin)"
            >
              <BrandLogo size="lg" theme="dark" showTagline={true} />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
              {COMPANY_NAME} delivers competitive electricity and natural gas supply options to New York homes and families. Reliable power backed by your local distribution grid.
            </p>
            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href="tel:18005554686" className="hover:text-white transition-colors">{SUPPORT_PHONE}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">{SUPPORT_EMAIL}</a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLink('home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('signup')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Sign Up & Enroll
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('portal')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Customer Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('payment')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Pay Bill Online
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Support & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Regulatory */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleLink('offer-details')} className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer">
                  $210 Offer Details <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded">Official</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('terms')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Terms of Service (ESCO)
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('privacy')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <span className="text-slate-500 block pt-1">
                  NY PSC Docket Compliance
                </span>
              </li>
              <li>
                <span className="text-slate-500 block">
                  HEFPA Consumer Rights
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Supported Utilities */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4">Compatible Utilities</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Con Edison (NYC & Westchester)
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> National Grid (NYC & LI)
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> NYSEG
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Central Hudson
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> PSEG Long Island
              </li>
              <li className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Orange & Rockland
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Regulatory Disclosure Box */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 text-xs leading-relaxed text-slate-400 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>IMPORTANT REGULATORY DISCLOSURE & CONSUMER RIGHTS</span>
            </div>
            <p>
              <strong>{COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.</strong>
            </p>
            <p>
              <strong>Offer Terms:</strong> {COMPANY_NAME} is offering new residential customers a $210 bill credit, applied as $35 per month for 6 consecutive months. To qualify, you must be a new residential customer who switches electricity and/or gas supply to {COMPANY_NAME}, have an active residential account with an eligible New York utility (e.g. Con Edison, National Grid), and stay enrolled during the credit period. Credits appear directly on your utility bill each month. If you cancel during the credit period, remaining scheduled credits are forfeited. After the 6-month promotional period, your rate transitions to a competitive standard variable or fixed rate with advance notice. Rates may change in accordance with market conditions and contract terms.
            </p>
            <p>
              Your local distribution utility continues to deliver your electricity and gas, read your meter, and respond to emergencies and service interruptions.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved. {TAGLINE}.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => handleLink('offer-details')} className="hover:underline cursor-pointer">Offer Details</button>
              <button onClick={() => handleLink('terms')} className="hover:underline cursor-pointer">Terms</button>
              <button onClick={() => handleLink('privacy')} className="hover:underline cursor-pointer">Privacy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
