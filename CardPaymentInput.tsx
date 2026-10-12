import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { TokenizedCardInfo } from '../types';
import { detectCardBrand, tokenizePaymentCard, validateCardNumberLuhn } from '../services/paymentService';

interface CardPaymentInputProps {
  onCardTokenized: (cardInfo: TokenizedCardInfo) => void;
  tokenizedCard?: TokenizedCardInfo;
  cardholderName?: string;
  email?: string;
}

export const CardPaymentInput: React.FC<CardPaymentInputProps> = ({
  onCardTokenized,
  tokenizedCard,
  cardholderName = 'Customer',
  email = 'customer@example.com',
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const brand = detectCardBrand(cardNumber);

  // Format Card Number (grouped in 4s)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    setValidationError(null);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
    setValidationError(null);
  };

  // Format CVV (3 or 4 digits)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
    setValidationError(null);
  };

  const handleAuthorize = async () => {
    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.length < 15) {
      setValidationError('Please enter a valid 15 or 16-digit card number.');
      return;
    }
    if (!validateCardNumberLuhn(cleanNum)) {
      setValidationError('Please enter a valid credit or debit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setValidationError('Please enter expiration in MM/YY format.');
      return;
    }
    const [month, year] = cardExpiry.split('/').map(Number);
    if (month < 1 || month > 12) {
      setValidationError('Expiration month must be between 01 and 12.');
      return;
    }
    if (cardCvv.length < 3) {
      setValidationError('Please enter a valid 3 or 4-digit CVV code.');
      return;
    }

    setIsTokenizing(true);
    setValidationError(null);

    try {
      const tokenized = await tokenizePaymentCard({
        cardNumber,
        cardExpiry,
        cardCvv,
        cardholderName,
        email,
      });

      // Clear raw inputs from memory immediately for PCI-DSS compliance
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');

      onCardTokenized(tokenized);
    } catch {
      setValidationError('Failed to authorize card with payment gateway. Please check your details.');
    } finally {
      setIsTokenizing(false);
    }
  };

  // If card is already verified & tokenized
  if (tokenizedCard && tokenizedCard.isVerified) {
    return (
      <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 block">
                {tokenizedCard.brand} Ending in •••• {tokenizedCard.last4}
              </span>
              <span className="text-[11px] text-slate-400">
                Expires {tokenizedCard.expMonth}/{tokenizedCard.expYear} • Tokenized & Verified
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/30">
            Active on file
          </span>
        </div>
        <p className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2.5">
          Your card has been safely tokenized. Raw card numbers and security codes are never stored on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-700/80 p-5 sm:p-6 text-slate-200 space-y-4 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">Payment Method (Credit or Debit Card)</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
          <Lock className="w-3 h-3" />
          <span>PCI-DSS Tokenized</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Attach your Visa, Mastercard, or American Express for automated monthly statement deductions and billing credits.
      </p>

      <div className="space-y-3.5">
        {/* Card Number input with live brand detector */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Card Number *
            </label>
            <span className="text-[11px] font-bold text-amber-400">
              {brand !== 'Card' ? brand : 'Visa / Mastercard / Amex'}
            </span>
          </div>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-hidden focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Expiration (MM/YY) *
            </label>
            <input
              type="text"
              value={cardExpiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-hidden focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Security Code (CVV) *
              </label>
              <span className="text-[10px] text-slate-400">3-4 digits</span>
            </div>
            <input
              type="password"
              value={cardCvv}
              onChange={handleCvvChange}
              placeholder="•••"
              maxLength={4}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-hidden focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {validationError && (
          <p className="text-rose-400 text-xs font-medium bg-rose-950/30 border border-rose-800/60 p-2.5 rounded-xl">
            {validationError}
          </p>
        )}

        <div className="pt-1">
          <button
            type="button"
            disabled={isTokenizing || !cardNumber || !cardExpiry || !cardCvv}
            onClick={handleAuthorize}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isTokenizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authorizing & Tokenizing Card...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>Verify & Attach Card to Account</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
          <span>🔒 256-bit encryption</span>
          <span>Zero raw card numbers stored</span>
        </div>
      </div>
    </div>
  );
};
