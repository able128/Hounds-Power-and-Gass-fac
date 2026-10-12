import React, { useState } from 'react';
import { PageType } from '../types';
import { COMPANY_NAME, SUPPORT_PHONE, SUPPORT_EMAIL, EMERGENCY_INFO } from '../data/mockData';
import { IndependentNotice } from '../components/IndependentNotice';
import { 
  Phone, 
  Mail, 
  Clock, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Building 
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageType) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accountNumber: '',
    topic: 'billing-credit',
    message: '',
  });

  const [submittedTicket, setSubmittedTicket] = useState<{
    id: string;
    createdAt: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    const ticketNumber = `TICK-NY-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket({
      id: ticketNumber,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-900 bg-blue-100/70 px-3.5 py-1 rounded-full">
            We're Here For You
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Contact & Customer Support
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Have questions about your bill, the $210 promotional credit, or switching your supply? Our New York support specialists are ready to help.
          </p>
        </div>

        {/* Regulatory Disclosure */}
        <IndependentNotice variant="inline" showOfferTerms={true} />

        {/* EMERGENCY OUTAGE BOX (Crucial utility notice) */}
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 sm:p-6 text-xs sm:text-sm text-amber-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h2 className="font-bold text-slate-900 text-base">Important Emergency Notice: Gas Leaks & Power Outages</h2>
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                If you suspect a natural gas leak (smell of sulfur / rotten eggs) or see downed wires, evacuate immediately. Do not use electrical switches or phones indoors. Call your local distribution utility directly:
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono font-semibold">
                <div className="p-2 bg-white rounded-lg border border-amber-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">Con Edison</span>
                  <a href="tel:18007526633" className="text-blue-900 underline">{EMERGENCY_INFO.conEd}</a>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">National Grid</span>
                  <a href="tel:18008675222" className="text-blue-900 underline">{EMERGENCY_INFO.natGridGas}</a>
                </div>
                <div className="p-2 bg-white rounded-lg border border-amber-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">NYSEG</span>
                  <a href="tel:18005721131" className="text-blue-900 underline">{EMERGENCY_INFO.nyseg}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-blue-950 text-white p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Direct Communication</h3>
                <p className="text-xs text-slate-300">Fast, courteous customer care based in New York.</p>
              </div>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Toll-Free Phone</span>
                    <a href="tel:18005554686" className="font-semibold text-white hover:text-amber-400 transition-colors text-base">
                      {SUPPORT_PHONE}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Prompt response during business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Email Support</span>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-white hover:text-amber-400 transition-colors">
                      {SUPPORT_EMAIL}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Average reply time under 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">Hours of Operation</span>
                    <p className="font-medium text-slate-200">Monday – Friday: 8:00 AM – 7:00 PM EST</p>
                    <p className="font-medium text-slate-200">Saturday: 9:00 AM – 2:00 PM EST</p>
                    <p className="text-[11px] text-slate-400">Sunday: Closed (Online ticket queue active)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-slate-400 block">New York Headquarters</span>
                    <p className="font-medium text-slate-200">{COMPANY_NAME}</p>
                    <p className="text-slate-300">350 Fifth Avenue, Suite 4100</p>
                    <p className="text-slate-300">New York, NY 10118</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-900 text-[11px] text-slate-400">
                Notice: {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              {submittedTicket ? (
                <div className="p-8 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Your ticket has been logged and assigned to a customer service specialist.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono font-bold text-blue-900 inline-block">
                    Ticket ID: {submittedTicket.id}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          accountNumber: '',
                          topic: 'billing-credit',
                          message: '',
                        });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Send Us a Message</h3>
                    <p className="text-slate-500 text-xs">Fill out the form below and we will respond promptly.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Johnathan Miller"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(212) 555-0198"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Account # (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        placeholder="e.g. HPG-9924-CONED"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Inquiry Topic <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-blue-900 focus:outline-hidden"
                      >
                        <option value="billing-credit">$210 Credit Inquiry ($35/mo)</option>
                        <option value="switching-status">Status of Utility Switch (Con Edison/Nat Grid)</option>
                        <option value="billing">Consolidated Utility Bill & Credit Question</option>
                        <option value="rate-plans">Rate Plans & Renewal Terms</option>
                        <option value="general">General Support</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you today?"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors shadow-md text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
