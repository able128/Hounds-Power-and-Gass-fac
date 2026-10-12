import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { COMPANY_NAME } from '../data/mockData';

interface IndependentNoticeProps {
  variant?: 'banner' | 'inline' | 'card' | 'subtle';
  className?: string;
  showOfferTerms?: boolean;
}

export const IndependentNotice: React.FC<IndependentNoticeProps> = ({
  variant = 'inline',
  className = '',
  showOfferTerms = false,
}) => {
  if (variant === 'banner') {
    return (
      <aside aria-label="Regulatory Notice" className={`bg-amber-500/10 border-y border-amber-500/20 px-4 py-2 text-xs text-amber-900 font-medium text-center ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Official Consumer Notice:</strong> {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility (such as Con Edison or National Grid). You are not required to switch.
          </span>
          {showOfferTerms && (
            <span className="text-amber-800">
              {' '}$210 bill credit applied as $35/mo for 6 months to qualifying new residential accounts. Terms apply.
            </span>
          )}
        </div>
      </aside>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`rounded-xl bg-slate-900 text-slate-200 p-4 border border-slate-800 text-xs leading-relaxed ${className}`}>
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white mb-1">Independent Energy Supplier Notice</p>
            <p className="text-slate-300">
              {COMPANY_NAME} is an independent energy services company (ESCO), not affiliated with your electric or natural gas distribution utility. You are not required to switch your energy supply.
            </p>
            {showOfferTerms && (
              <p className="mt-2 text-slate-400 border-t border-slate-800 pt-2">
                <strong>Offer Terms:</strong> $210 total bill credit provided as $35/month for 6 consecutive billing cycles for new residential customers. Requires active utility service.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'subtle') {
    return (
      <div className={`text-[11px] text-slate-500 leading-normal flex items-start gap-1.5 ${className}`}>
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span>
            {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
          </span>
          {showOfferTerms && (
            <span> 6 months, $35/mo credit. New residential customers only; eligibility terms apply.</span>
          )}
        </div>
      </div>
    );
  }

  // default inline
  return (
    <div className={`p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs flex items-center gap-2 ${className}`}>
      <Info className="w-4 h-4 text-slate-500 shrink-0" />
      <span className="leading-snug">
        <strong>Notice:</strong> {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
        {showOfferTerms && ' $210 credit applied as $35/mo for 6 months for new residential customers.'}
      </span>
    </div>
  );
};
