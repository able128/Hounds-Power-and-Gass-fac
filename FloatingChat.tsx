import React, { useState } from 'react';
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react';
import { PageType } from '../types';
import { COMPANY_NAME, SUPPORT_PHONE } from '../data/mockData';

interface FloatingChatProps {
  onNavigate: (page: PageType) => void;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `Hello! Welcome to ${COMPANY_NAME}. Have a question about our $210 bill credit, switching your supply, or your Con Edison bill?`,
      time: 'Just now',
    },
  ]);

  const quickPrompts = [
    'How does the $210 credit work?',
    'Will Con Edison cut my power?',
    'Where do I enter my account #?',
    'How do I make a payment?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || userQuery;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...chatMessages, { sender: 'user' as const, text, time }];
    setChatMessages(newMessages);
    setUserQuery('');

    // Instant helpful assistant replies based on context
    setTimeout(() => {
      let reply = `Thank you for asking! For personalized assistance, you can call us at ${SUPPORT_PHONE} or submit a ticket on our Contact page.`;
      const lower = text.toLowerCase();
      if (lower.includes('$210') || lower.includes('credit') || lower.includes('35')) {
        reply = `New residential customers receive $210 total in bill credits, applied as $35/month for 6 consecutive billing cycles right on your utility bill! You can enroll online in just 2 minutes.`;
      } else if (lower.includes('con edison') || lower.includes('interrupt') || lower.includes('cut')) {
        reply = `No interruption whatsoever! Con Edison continues to deliver your power, maintain the grid, and handle outages. Only the supply portion switches to Hounds Power and Gas.`;
      } else if (lower.includes('pay') || lower.includes('bill')) {
        reply = `No separate payment method is needed! In New York, your billing is consolidated with your local distribution utility (Con Edison, National Grid, etc.). Your $35 monthly promotional credit is automatically subtracted directly on your utility bill, and you continue paying your utility as usual.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[360px] max-w-[calc(100vw-32px)] h-[510px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                ⚡
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{COMPANY_NAME} Support</h4>
                <p className="text-[11px] text-amber-300">Live NY Help Center</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Independent supplier mini banner */}
          <div className="bg-amber-50 px-3 py-1.5 text-[10px] text-amber-900 border-b border-amber-200/60 leading-tight">
            Independent supplier, not affiliated with your utility. You are not required to switch.
          </div>

          {/* Messages body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Quick suggestion pills */}
            <div className="pt-2">
              <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Common questions:
              </p>
              <div className="flex flex-col gap-1.5">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 text-[11px] transition-colors cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat input */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask about rates, bills, credit..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-900 bg-slate-50 focus:bg-white"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('contact');
                }}
                className="text-blue-900 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                Open Full Contact Page <ArrowRight className="w-2.5 h-2.5" />
              </button>
              <span>{SUPPORT_PHONE.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-amber-400/40 cursor-pointer"
          aria-label="Open Chat and Help"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <MessageCircle className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm tracking-wide">Chat / Help</span>
        </button>
      )}
    </div>
  );
};
