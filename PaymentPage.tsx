import React, { useState } from 'react';
import { PageType, CustomerAccount, TokenizedCardInfo } from '../types';
import { COMPANY_NAME, SUPPORT_PHONE } from '../data/mockData';
import { CardPaymentInput } from '../components/CardPaymentInput';
import { processCardPayment } from '../services/paymentService';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Printer, 
  Lock, 
  Receipt, 
  RefreshCw 
} from 'lucide-react';

interface PaymentPageProps {
  onNavigate: (page: PageType) => void;
  defaultAmount?: number;
  customerAccount?: CustomerAccount;
  onPaymentSuccess?: (amount: number, reference: string) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  onNavigate,
  defaultAmount = 84.50,
  customerAccount,
  onPaymentSuccess,
}) => {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [accountNumber, setAccountNumber] = useState(customerAccount?.accountNumber || 'HPG-9924-CONED');
  const [email, setEmail] = useState(customerAccount?.email || 'j.miller@example.com');
  const [tokenizedCard, setTokenizedCard] = useState<TokenizedCardInfo | undefined>(customerAccount?.paymentMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    reference: string;
    amount: number;
    receiptNumber: string;
    timestamp: string;
    last4: string;
    brand: string;
  } | null>(null);

  const handlePayNow = async () => {
    if (!tokenizedCard) return;
    setIsProcessing(true);

    try {
      const res = await processCardPayment(amount, tokenizedCard, accountNumber);
      setPaymentResult({
        reference: res.reference,
        amount: res.amount,
        receiptNumber: res.receiptNumber,
        timestamp: res.timestamp,
        last4: res.cardInfo.last4,
        brand: res.cardInfo.brand,
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(amount, res.reference);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('portal')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer Portal</span>
        </button>

        {/* Top Header Card */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-8 shadow-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800 text-amber-400 text-xs font-bold border border-blue-700">
            <Lock className="w-3.5 h-3.5" />
            256-Bit SSL Encrypted Card Payment
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Pay Your Energy Bill by Card
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Quick, secure card payments for your {COMPANY_NAME} energy account. Tokenized under PCI-DSS compliance.
          </p>
        </div>

        {/* SUCCESS RECEIPT VIEW */}
        {paymentResult ? (
          <div className="rounded-3xl bg-white border border-emerald-200 p-8 sm:p-10 shadow-xl space-y-6 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Successful
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Thank You! Your Payment Was Received
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your payment of <strong className="text-slate-900">${paymentResult.amount.toFixed(2)}</strong> has been processed via {paymentResult.brand} (•••• {paymentResult.last4}).
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Transaction Reference</span>
                <span className="font-mono font-bold text-blue-900">{paymentResult.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Receipt Number</span>
                <span className="font-mono font-bold text-slate-800">{paymentResult.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Customer Account</span>
                <span className="font-semibold text-slate-800">{accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Timestamp</span>
                <span className="text-slate-700">{paymentResult.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-extrabold text-slate-900">
                <span>Amount Paid</span>
                <span className="text-emerald-700">${paymentResult.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('portal')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Customer Portal</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM */
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email for Receipt
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                  />
                </div>

                {/* Amount to pay */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Payment Amount ($ USD)
                    </label>
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full">
                      Current balance: ${customerAccount?.currentBalance.toFixed(2) || '84.50'}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-base font-bold text-slate-900 focus:border-blue-900 focus:outline-hidden"
                    />
                  </div>

                  {/* Quick amount chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[25, 50, 84.50, 100, 150].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          amount === val
                            ? 'bg-blue-900 text-white border-blue-900'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        ${val.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Tokenization Input */}
              <div className="pt-2">
                <CardPaymentInput
                  cardholderName={customerAccount?.fullName || 'Customer'}
                  email={email}
                  tokenizedCard={tokenizedCard}
                  onCardTokenized={(card) => setTokenizedCard(card)}
                />
              </div>

              {/* Pay Button */}
              {tokenizedCard && (
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessing || amount <= 0}
                    onClick={handlePayNow}
                    className="w-full py-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Processing Card Payment...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>Pay ${amount.toFixed(2)} with {tokenizedCard.brand} (•••• {tokenizedCard.last4})</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
