import React, { useState } from 'react';
import { PageType, CustomerAccount, BillRecord } from '../types';
import { COMPANY_NAME } from '../data/mockData';
import { IndependentNotice } from '../components/IndependentNotice';
import { saveCustomerEnrollment } from '../services/storageService';
import { 
  User, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  LogOut, 
  CreditCard,
  X
} from 'lucide-react';

interface CustomerPortalPageProps {
  onNavigate: (page: PageType) => void;
  account: CustomerAccount;
}

export const CustomerPortalPage: React.FC<CustomerPortalPageProps> = ({
  onNavigate,
  account,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('j.miller@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [registerName, setRegisterName] = useState('');
  const [selectedBillForModal, setSelectedBillForModal] = useState<BillRecord | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const refId = `HPG-PORTAL-${randomSuffix}`;
      saveCustomerEnrollment(
        {
          fullName: registerName || loginEmail.split('@')[0],
          email: loginEmail,
          phone: '(555) 019-2831',
          serviceAddress: 'New York Residence',
          city: 'New York',
          zipCode: '10001',
          utilityCompany: 'Con Edison',
          accountNumber: 'Pending Portal Sync',
          serviceType: 'both',
          agreedToTerms: true,
          paymentMethod: {
            token: `tok_reg_${Date.now()}`,
            brand: 'Visa',
            last4: '4242',
            expMonth: '12',
            expYear: '28',
            isVerified: true,
          },
        },
        refId
      );
    }
    setIsAuthenticated(true);
  };

  // If not logged in, show clean Auth View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Customer Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Access your bill history, 6-month credit tracker, and online card payments.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xl space-y-6">
            {/* Tab switch */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
              <button
                onClick={() => setAuthMode('login')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('register')}
                className={`py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors shadow-md text-sm mt-2 cursor-pointer"
              >
                {authMode === 'login' ? 'Sign In to Portal' : 'Register Customer Account'}
              </button>
            </form>

            {/* Quick 1-click Demo Account sign-in */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('j.miller@example.com');
                  setLoginPassword('password123');
                  setIsAuthenticated(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>1-Click Demo Login (Johnathan Miller - Con Edison)</span>
              </button>
            </div>
          </div>

          <IndependentNotice variant="subtle" showOfferTerms={true} className="justify-center" />
        </div>
      </div>
    );
  }

  // Calculate Credit Progress
  const totalCredits = 210;
  const appliedCreditsCount = account.creditsHistory.filter((c) => c.status === 'applied').length;
  const appliedAmount = appliedCreditsCount * 35;
  const remainingAmount = totalCredits - appliedAmount;
  const progressPercent = Math.round((appliedAmount / totalCredits) * 100);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Account Bar */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
                Residential Account
              </span>
              <span className="text-xs font-mono text-slate-500">#{account.accountNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome back, {account.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Service Address: {account.serviceAddress} • Connected via {account.utilityCompany}
            </p>
          </div>

          {/* Balance & Pay by Card */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Due
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ${account.currentBalance.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => onNavigate('payment')}
              className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>Pay by Card</span>
            </button>
          </div>
        </div>

        {/* 6-MONTH BILL CREDIT TRACKER ($35 / month for 6 months = $210) */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                6-Month Bill Credit Guarantee
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                $210 New Customer Credit Tracker
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Applied as $35/month for 6 consecutive billing cycles right on your {account.utilityCompany} statement.
              </p>
            </div>
            <div className="text-left sm:text-right bg-white/5 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Credit Balance</span>
              <span className="text-2xl font-black text-amber-400">
                ${appliedAmount} <span className="text-sm font-normal text-slate-300">/ $210 Earned</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>{appliedCreditsCount} of 6 Months Applied ({progressPercent}%)</span>
              <span>${remainingAmount}.00 Remaining in Months 4–6</span>
            </div>
          </div>

          {/* 6 Months Visual Step Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {account.creditsHistory.map((item) => {
              const isApplied = item.status === 'applied';
              return (
                <div
                  key={item.monthIndex}
                  className={`rounded-2xl p-4 border transition-all ${
                    isApplied
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-white'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                      Mo {item.monthIndex}
                    </span>
                    {isApplied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="text-lg font-black text-amber-400">
                    -${item.amount}.00
                  </div>
                  <div className="text-[11px] font-medium text-slate-300 mt-1 truncate">
                    {item.monthName}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/60 text-[10px]">
                    {isApplied ? (
                      <span className="text-emerald-400 font-semibold">Credited on bill</span>
                    ) : (
                      <span className="text-slate-400">Scheduled</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mandatory regulatory reminder */}
          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch. Promotional credits are applied to active residential accounts across 6 consecutive billing cycles.
          </div>
        </div>

        {/* TWO-COLUMN DETAILS: Account Details & Plan Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Account Information */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <User className="w-4 h-4 text-blue-900" />
              <span>Account Details</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Holder</span>
                <span className="font-semibold text-slate-900">{account.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Account Number</span>
                <span className="font-mono font-semibold text-slate-900">{account.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Service Utility</span>
                <span className="font-semibold text-slate-900">{account.utilityCompany}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Service Type</span>
                <span className="font-semibold text-slate-900 uppercase">Dual Fuel (Elec & Gas)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Enrolled Since</span>
                <span className="font-semibold text-slate-900">{account.enrollmentDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Billing Mode</span>
                <span className="font-semibold text-slate-900">Consolidated Utility Bill</span>
              </div>
            </div>
          </div>

          {/* Card 2: Plan & Rate Structure */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active Rate Plan</span>
            </h2>
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Plan Name</span>
              <h3 className="font-bold text-slate-900 text-sm">{account.planName}</h3>
              <p className="text-xs text-blue-950 font-medium">{account.currentRate}</p>
            </div>
            <div className="space-y-2 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Price protection against seasonal market surges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero early termination fees for standard residential</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Includes 100% NY Clean Energy standard certificates</span>
              </div>
            </div>
          </div>

          {/* Card 3: Payment Card on File & Actions */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-blue-900" />
                <span>Payment Method on File</span>
              </h2>
              {account.paymentMethod ? (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>{account.paymentMethod.brand} •••• {account.paymentMethod.last4}</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Expires {account.paymentMethod.expMonth}/{account.paymentMethod.expYear} • Tokenized under PCI-DSS
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  No card currently saved. Payments can be made online via card or through your utility.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('payment')}
                className="w-full py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Current Bill (${account.currentBalance.toFixed(2)})</span>
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-2.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Contact Customer Care</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-rose-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
              <span>Support: 1-800-555-4686</span>
            </div>
          </div>

        </div>

        {/* BILL HISTORY TABLE */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Bill History & Statements</h2>
              <p className="text-xs text-slate-500">
                Consolidated billing with supply, delivery, and your promotional $35 credit deduction.
              </p>
            </div>
            <button
              onClick={() => onNavigate('payment')}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Pay by Card</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Statement</th>
                  <th className="py-3 px-3">Billing Period</th>
                  <th className="py-3 px-3">HPG Supply</th>
                  <th className="py-3 px-3">Utility Delivery</th>
                  <th className="py-3 px-3 text-amber-700">Promo Credit</th>
                  <th className="py-3 px-3">Total Due</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {account.recentBills.map((bill) => {
                  const isDue = bill.status === 'due';
                  return (
                    <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-3 font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>{bill.id}</span>
                      </td>
                      <td className="py-4 px-3 text-slate-600">{bill.billingPeriod}</td>
                      <td className="py-4 px-3 text-slate-700 font-medium">${bill.supplyCharge.toFixed(2)}</td>
                      <td className="py-4 px-3 text-slate-500">${bill.deliveryCharge.toFixed(2)}</td>
                      <td className="py-4 px-3 font-black text-amber-600">
                        -${Math.abs(bill.promoCredit).toFixed(2)}
                      </td>
                      <td className="py-4 px-3 font-black text-slate-900 text-sm">
                        ${bill.totalDue.toFixed(2)}
                      </td>
                      <td className="py-4 px-3">
                        {isDue ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                            Due May 5
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedBillForModal(bill)}
                          className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-[11px] cursor-pointer"
                        >
                          Details
                        </button>
                        {isDue && (
                          <button
                            onClick={() => onNavigate('payment')}
                            className="px-3 py-1 rounded-lg bg-blue-900 hover:bg-blue-950 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                          >
                            Pay by Card
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Bill Statement Detail Modal */}
      {selectedBillForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Statement Details</h3>
                <p className="text-xs text-slate-500">{selectedBillForModal.id} • {selectedBillForModal.billingPeriod}</p>
              </div>
              <button
                onClick={() => setSelectedBillForModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Account Number</span>
                <span className="font-semibold text-slate-900">{account.accountNumber}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Utility Delivery Provider</span>
                <span className="font-semibold text-slate-900">{account.utilityCompany}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Electricity Usage</span>
                <span className="font-semibold text-slate-900">{selectedBillForModal.electricityKWh} kWh</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Natural Gas Usage</span>
                <span className="font-semibold text-slate-900">{selectedBillForModal.gasTherms} Therms</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 border-t border-slate-100 pt-2">
                <span>Hounds Power Supply Charge</span>
                <span className="font-semibold text-slate-900">${selectedBillForModal.supplyCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>Utility Delivery & Transmission</span>
                <span className="font-semibold text-slate-900">${selectedBillForModal.deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-amber-600 font-bold bg-amber-50 p-2 rounded-lg">
                <span>Promotional Bill Credit (Mo. Deductions)</span>
                <span>-${Math.abs(selectedBillForModal.promoCredit).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-black text-slate-900 border-t border-slate-200">
                <span>Net Total Amount</span>
                <span>${selectedBillForModal.totalDue.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedBillForModal(null);
                  onNavigate('payment');
                }}
                className="flex-1 py-3 rounded-xl bg-blue-900 hover:bg-blue-950 font-bold text-white text-xs shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Pay This Bill Online</span>
              </button>
              <button
                onClick={() => setSelectedBillForModal(null)}
                className="px-4 py-3 rounded-xl border border-slate-300 font-semibold text-slate-700 text-xs hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
