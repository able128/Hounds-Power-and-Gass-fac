import React, { useState } from 'react';
import { PageType, UtilityProvider } from '../types';
import { 
  COMPANY_NAME, 
  NY_UTILITIES, 
  FAQ_ITEMS, 
  SUPPORT_PHONE 
} from '../data/mockData';
import { IndependentNotice } from '../components/IndependentNotice';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ChevronDown, 
  Building2, 
  TrendingUp,
  FileText
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onSelectUtility?: (utility: UtilityProvider) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectUtility }) => {
  // Interactive Calculator State
  const [selectedUtility, setSelectedUtility] = useState<UtilityProvider>('Con Edison');
  const [avgMonthlyBill, setAvgMonthlyBill] = useState<number>(180);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const estimatedMonthlyBillWithCredit = Math.max(0, avgMonthlyBill - 35);

  const handleStartSignUp = (util?: UtilityProvider) => {
    if (util && onSelectUtility) {
      onSelectUtility(util);
    }
    onNavigate('signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Banner Notice */}
      <IndependentNotice variant="banner" showOfferTerms={true} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-blue-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Glow aesthetics */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Callout */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/80 border border-blue-700/60 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Special New York Residential Customer Offer</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Powering New York With A{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">
                  $210 Bill Credit.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Enjoy <strong className="text-white font-semibold">$35 off your monthly energy bill for 6 consecutive months</strong> when you switch your electricity and natural gas supply to {COMPANY_NAME}.
              </p>

              {/* Offer Terms Near Hero Mention */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 space-y-1 max-w-xl">
                <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Clear & Transparent Offer Terms
                </p>
                <p className="text-slate-300 leading-snug">
                  $210 bill credit applied as $35/month for 6 months for new residential accounts. Requires active service with Con Edison, National Grid, or NYSEG. No interruption in physical delivery.
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
                </p>
              </div>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => handleStartSignUp(selectedUtility)}
                  className="px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span>Get Started – Claim $210 Credit</span>
                  <ArrowRight className="w-5 h-5 text-slate-950" />
                </button>
                <button
                  onClick={() => onNavigate('portal')}
                  className="px-6 py-4 rounded-xl text-base font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Existing Customer? Sign In</span>
                </button>
              </div>

              {/* Utility Trust Badges */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">Works seamlessly with:</span>
                {['Con Edison', 'National Grid', 'NYSEG', 'Central Hudson', 'PSEG LI'].map((u) => (
                  <span key={u} className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 font-medium border border-slate-700">
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Offer Card & 6-Month Visual Breakdown */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white text-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-100">
                <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs tracking-wider uppercase shadow-md">
                  6-Month Guarantee
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-xl shadow-md">
                      $210
                    </div>
                    <div>
                      <h2 className="font-extrabold text-lg text-slate-900 leading-tight">New Customer Bill Credit</h2>
                      <p className="text-xs text-slate-500 font-medium">Applied automatically over your first 6 months</p>
                    </div>
                  </div>

                  {/* 6 Month Timeline Preview */}
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your 6-Month Credit Schedule:</p>
                    <div className="grid grid-cols-6 gap-1.5 text-center">
                      {[1, 2, 3, 4, 5, 6].map((m) => (
                        <div key={m} className="p-2 rounded-xl bg-blue-50 border border-blue-200/80 flex flex-col items-center">
                          <span className="text-[10px] font-bold text-blue-900 uppercase">Mo {m}</span>
                          <span className="text-xs font-black text-amber-600 mt-0.5">-$35</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key points */}
                  <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>No service interruption:</strong> Con Edison still delivers your power safely.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Takes 2 minutes:</strong> Have your utility bill handy to complete enrollment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>No sign-up fee:</strong> Zero cancellation fees for standard residential plans.</span>
                    </li>
                  </ul>

                  {/* Notice inside card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-snug">
                    {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
                  </div>

                  <button
                    onClick={() => handleStartSignUp()}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Enroll Now With Your Utility</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works-section" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Switching Your Supply Works
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              New York State gives you the power to choose who supplies your energy. Your current utility continues delivering it through the exact same wires and pipes.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-blue-900/10">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sign Up in 2 Minutes</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Enter your service address and current utility details (like your Con Edison or National Grid account number). No technician visits, no rewiring, and no equipment changes.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-blue-900 font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-500" /> Fast online verification
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-amber-500/20">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">We Switch Your Supply</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                We notify your utility that you selected {COMPANY_NAME} as your supplier. Your power stays on uninterrupted. Your utility still owns the grid, reads your meter, and repairs any outages.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-blue-900 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Zero service interruption
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl bg-slate-50 border border-slate-200 p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white font-black text-xl flex items-center justify-center mb-6 shadow-md shadow-blue-900/10">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Credit Appears on Your Bill</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">
                Starting with your first full billing cycle, a <strong className="text-slate-900 font-semibold">$35 credit appears on your monthly bill</strong> for 6 consecutive months ($210 total credit).
              </p>
              <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-amber-700 font-semibold flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-amber-500" /> $210 total credit applied
              </div>
            </div>
          </div>

          {/* Independent Notice */}
          <div className="mt-10">
            <IndependentNotice variant="subtle" showOfferTerms={true} className="justify-center" />
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => handleStartSignUp()}
              className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE BILL & CREDIT ESTIMATOR */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block">
                Interactive Credit Estimator
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                See How The $210 Credit Affects Your Monthly Bill
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Choose your local New York utility and adjust your current average monthly bill to see your simulated statement with the $35 monthly credit deducted.
              </p>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <p className="font-semibold text-white mb-1">Notice & Eligibility:</p>
                <p>
                  {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch. $210 credit applied as $35/month for 6 months for new residential accounts.
                </p>
              </div>
            </div>

            {/* Interactive Calculator Card */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-slate-800 border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Select Your Utility Provider:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {NY_UTILITIES.map((u) => (
                      <button
                        key={u}
                        onClick={() => setSelectedUtility(u)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                          selectedUtility === u
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-300 uppercase tracking-wider">Average Monthly Energy Bill:</span>
                    <span className="font-black text-amber-400 text-lg">${avgMonthlyBill} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="450"
                    step="5"
                    value={avgMonthlyBill}
                    onChange={(e) => setAvgMonthlyBill(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>$60/mo</span>
                    <span>$250/mo</span>
                    <span>$450/mo</span>
                  </div>
                </div>

                {/* Simulation Output */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-700 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span>Selected Utility</span>
                    <span className="font-semibold text-white">{selectedUtility}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Estimated Monthly Bill</span>
                    <span className="text-white">${avgMonthlyBill.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                    <span>Hounds Monthly Promo Credit (Months 1–6)</span>
                    <span>-$35.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Estimated Bill After Credit</span>
                    <span className="text-emerald-400 text-lg sm:text-xl">${estimatedMonthlyBillWithCredit.toFixed(2)} / mo</span>
                  </div>
                  <div className="bg-amber-500/10 rounded-xl p-2.5 text-center text-xs text-amber-300 font-medium">
                    Total 6-Month Promotional Benefit: <strong className="text-white">$210.00 in credits</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleStartSignUp(selectedUtility)}
                  className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply with {selectedUtility}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100/70 px-3.5 py-1 rounded-full">
              Why Hounds Power and Gas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Smarter, Clearer Way to Power Your Home
            </h2>
            <p className="text-slate-600 text-base">
              Friendly local service, dependable rates, and transparent energy supply without surprises.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">100% Reliable Delivery</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your current utility (e.g. Con Edison) remains legally responsible for power delivery, poles, wires, gas lines, and emergencies. Zero risk of interruption.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">$210 Credit in Writing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We clearly disclose every detail: $35/month for 6 consecutive months for new residential accounts. Direct, straightforward credits on your utility statement.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Price Predictability</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose fixed plans to protect your household budget against unpredictable seasonal price spikes in volatile New York wholesale energy markets.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Clean Energy Options</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Opt into 100% New York renewable electricity certificates and carbon-offset natural gas to power your home sustainably.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 Dual Fuel Convenience">Dual Fuel Convenience</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Consolidate both your electricity and natural gas supply under one trusted, friendly supplier with consolidated billing.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-6 h-6 text-cyan-700" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Local Customer Care</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Real New York representatives ready to answer billing questions, explain tariff codes, and assist you by phone or online.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Everything you need to know about the $210 credit, switching supply, and your utility bill.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg focus:outline-hidden cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-900' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Regulatory Box */}
          <div className="mt-12">
            <IndependentNotice variant="card" showOfferTerms={true} />
          </div>

          {/* Still have questions banner */}
          <div className="mt-8 p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-blue-950 text-base">Still have questions?</h4>
              <p className="text-xs text-blue-800">Our customer care team is available Mon–Fri 8am–7pm EST.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 transition-colors cursor-pointer"
              >
                Contact Support
              </button>
              <a
                href="tel:18005554686"
                className="px-5 py-2.5 rounded-xl bg-white text-blue-950 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                Call {SUPPORT_PHONE.split(' ')[0]}
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full inline-block">
            Limited Time Residential Enrollment
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Claim Your $210 Bill Credit Today
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Switch in 2 minutes. Receive $35/month for 6 months. Con Edison and your local utility handle the delivery as always.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => handleStartSignUp()}
              className="px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
            <button
              onClick={() => onNavigate('offer-details')}
              className="px-6 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-5 h-5" />
              <span>Read Full Offer Details</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 pt-4">
            {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
          </p>
        </div>
      </section>
    </div>
  );
};
