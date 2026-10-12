import React, { useState } from 'react';
import { PageType } from '../types';
import { COMPANY_NAME, SUPPORT_PHONE, SUPPORT_EMAIL } from '../data/mockData';
import { IndependentNotice } from '../components/IndependentNotice';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Scale, 
  Lock, 
  ArrowRight
} from 'lucide-react';

interface LegalOfferPageProps {
  initialTab?: 'offer' | 'terms' | 'privacy';
  onNavigate: (page: PageType) => void;
}

export const LegalOfferPage: React.FC<LegalOfferPageProps> = ({
  initialTab = 'offer',
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'offer' | 'terms' | 'privacy'>(initialTab);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100/70 px-3.5 py-1 rounded-full">
            Legal, Regulatory & Disclosure
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Compliance & Customer Information
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Full terms, clear rates, and customer rights under the New York Public Service Commission (PSC).
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('offer')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'offer'
                ? 'border-amber-500 text-slate-900 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Official Offer Details ($210 Credit)</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-4 h-4 text-blue-900" />
            <span>Terms of Service (ESCO)</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-6 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-blue-900 text-blue-900 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4 text-blue-900" />
            <span>Privacy Policy</span>
          </button>
        </div>

        {/* TAB 1: OFFER DETAILS */}
        {activeTab === 'offer' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8 animate-in fade-in duration-200">
            
            {/* Regulatory Notice Banner */}
            <IndependentNotice variant="card" showOfferTerms={true} />

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">
                Official $210 Residential Bill Credit Offer Terms
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>{COMPANY_NAME}</strong> is offering qualifying new residential customers in New York a total of <strong>$210.00 in bill credits</strong>, applied as <strong>$35.00 per month for six (6) consecutive billing cycles</strong>.
              </p>
            </div>

            {/* Key Disclosure Table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
              <div className="bg-slate-100 font-bold text-slate-800 px-4 py-3 border-b border-slate-200 uppercase tracking-wider">
                Offer Specifications & Disclosure Summary
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Promotional Benefit</span>
                  <span className="sm:col-span-2 text-slate-900 font-semibold">$210 Total Bill Credit ($35.00 per month for 6 months)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Eligibility</span>
                  <span className="sm:col-span-2 text-slate-900">
                    New residential customers only who switch electric and/or natural gas supply to {COMPANY_NAME}. Must have an active residential utility account.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Eligible Distribution Utilities</span>
                  <span className="sm:col-span-2 text-slate-900">
                    Con Edison, National Grid, NYSEG, Central Hudson, PSEG Long Island, Orange & Rockland.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Minimum Enrollment Length</span>
                  <span className="sm:col-span-2 text-slate-900">
                    6 consecutive billing cycles to receive all 6 installments of the $35 monthly credit.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Early Cancellation Fee</span>
                  <span className="sm:col-span-2 text-slate-900 font-semibold text-emerald-700">
                    $0.00 (None). Standard residential customers may cancel anytime without termination penalties.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Forfeiture Rule</span>
                  <span className="sm:col-span-2 text-slate-900">
                    If customer cancels enrollment prior to completing the 6-month period, credits previously applied remain with the customer; remaining future monthly credits are forfeited.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2">
                  <span className="font-bold text-slate-700">Rate Structure After Credit Period</span>
                  <span className="sm:col-span-2 text-slate-900">
                    Following the 6-month promotional period, account continues under your chosen plan: Fixed Rate (9.45¢ per kWh / $0.68 per therm) or Variable Market Rate. Rates may change in accordance with wholesale NYISO market indices with advance written notice.
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <h3 className="font-bold text-slate-900 text-base">To Qualify, You Must:</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Be a new residential customer who switches energy supply to {COMPANY_NAME}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Hold an active residential account with an eligible New York utility (e.g. Con Edison, National Grid).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Remain enrolled in good standing across each billing cycle.</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base">Ready to enroll?</h4>
                <p className="text-xs text-slate-300">Switch your supply in under 2 minutes with your utility account number.</p>
              </div>
              <button
                onClick={() => onNavigate('signup')}
                className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 text-xs shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <span>Enroll Online Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
            <h2 className="text-2xl font-black text-slate-900">
              Uniform Energy Services Agreement & Terms
            </h2>
            <p className="text-slate-500 text-xs">
              Governed by the New York State Public Service Commission (NYS PSC) Uniform Business Practices (UBP).
            </p>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">1. Independent Energy Supplier Status</h3>
              <p>
                {COMPANY_NAME} is an independent Energy Services Company (ESCO) certified by the New York State Public Service Commission. {COMPANY_NAME} is not affiliated with your distribution utility (e.g., Con Edison, National Grid, NYSEG). You are not required to switch your energy supply.
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. Physical Delivery & Outage Responsibility</h3>
              <p>
                Your local distribution utility continues to be responsible for delivery of electricity and/or gas to your premises, reading your meter, billing, and responding to gas emergencies and power outages. {COMPANY_NAME} supplies only the commodity portion of your service.
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. Three-Day Right of Rescission</h3>
              <p>
                In accordance with New York General Business Law, residential customers have the right to rescind and cancel this agreement within three (3) business days of receiving the sales agreement without penalty or obligation by contacting us at {SUPPORT_PHONE} or {SUPPORT_EMAIL}.
              </p>

              <h3 className="font-bold text-slate-900 text-base">4. Cancellation & Termination Terms</h3>
              <p>
                You may cancel your enrollment at any time without penalty or early termination fees for standard residential contracts. Upon cancellation, your account will be transitioned back to your default utility or to an alternative ESCO on your next meter read date.
              </p>

              <h3 className="font-bold text-slate-900 text-base">5. Dispute Resolution</h3>
              <p>
                If you have a question or complaint regarding your bill or service, please contact {COMPANY_NAME} customer service first. If your complaint is not resolved, you may contact the New York State Public Service Commission Office of Consumer Services at 1-800-342-3377.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-200">
            <h2 className="text-2xl font-black text-slate-900">
              Customer Data & Privacy Policy
            </h2>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">1. Information We Collect</h3>
              <p>
                We collect information provided during enrollment and service management: full name, physical service address, email, telephone number, utility account number, and historic usage information provided through utility Electronic Data Interchange (EDI) systems.
              </p>

              <h3 className="font-bold text-slate-900 text-base">2. How We Use Your Information</h3>
              <p>
                Your information is used strictly to process your utility supply switch, calculate applicable promotional bill credits ($35/month for 6 months), generate billing statements, and provide customer support. We never sell or rent your personal information to third-party marketers.
              </p>

              <h3 className="font-bold text-slate-900 text-base">3. Consolidated Utility Billing & Financial Data</h3>
              <p>
                {COMPANY_NAME} does not request, collect, or store payment card numbers, bank account numbers, or CVV codes. All utility commodity billing is handled via consolidated billing by your local regulated distribution utility (e.g. Con Edison, National Grid, NYSEG).
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
