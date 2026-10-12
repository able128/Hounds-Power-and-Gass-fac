import React, { useState } from 'react';
import { PageType, SignUpFormData, UtilityProvider, TokenizedCardInfo } from '../types';
import { COMPANY_NAME, NY_UTILITIES } from '../data/mockData';
import { IndependentNotice } from '../components/IndependentNotice';
import { saveCustomerEnrollment } from '../services/storageService';
import { CardPaymentInput } from '../components/CardPaymentInput';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  Printer, 
  Zap, 
  Flame, 
  ArrowLeft, 
  CreditCard
} from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (page: PageType) => void;
  preselectedUtility?: UtilityProvider;
  onEnrollmentComplete?: (formData: SignUpFormData, refId: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onNavigate,
  preselectedUtility = 'Con Edison',
  onEnrollmentComplete,
}) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: '',
    email: '',
    phone: '',
    serviceAddress: '',
    city: 'New York',
    zipCode: '',
    utilityCompany: preselectedUtility,
    accountNumber: '',
    serviceType: 'both',
    agreedToTerms: false,
    paymentMethod: undefined,
  });

  const [paymentChoice, setPaymentChoice] = useState<'card' | 'utility_bill'>('card');
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData | 'payment', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    referenceId: string;
    submittedAt: string;
    data: SignUpFormData;
  } | null>(null);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpFormData | 'payment', string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full legal name.';
    } else if (formData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Please include both your first and last name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.serviceAddress.trim()) {
      newErrors.serviceAddress = 'Service street address is required.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    const zipRegex = /^\d{5}$/;
    if (!zipRegex.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid 5-digit New York ZIP code.';
    }

    if (!formData.utilityCompany) {
      newErrors.utilityCompany = 'Please select your current utility company.';
    }

    if (!formData.serviceType) {
      newErrors.serviceType = 'Please select a service type.';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must review and agree to the Offer Terms and enrollment authorization.';
    }

    if (paymentChoice === 'card' && !formData.paymentMethod) {
      newErrors.payment = 'Please enter and verify your payment card details below, or select regular utility billing.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = document.querySelector('.form-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const refId = `HPG-NY-${randomSuffix}`;

      const submitted = {
        referenceId: refId,
        submittedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        data: { ...formData },
      };

      // Persist customer record permanently to storage
      saveCustomerEnrollment(formData, refId);

      setConfirmationData(submitted);
      setIsSubmitting(false);

      if (onEnrollmentComplete) {
        onEnrollmentComplete(formData, refId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // If enrollment submitted, show Confirmation Screen
  if (confirmationData) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          {/* Header Card */}
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              Enrollment Submitted Successfully
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome to {COMPANY_NAME}!
            </h1>

            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Your application to switch your energy supply has been received. You have qualified for our <strong className="text-slate-900">$210 bill credit promotion ($35/month for 6 months)</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block text-left w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-6 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrollment Reference:</span>
                  <span className="font-mono font-bold text-blue-900 text-sm sm:text-base">{confirmationData.referenceId}</span>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted On:</span>
                  <span className="font-semibold text-slate-800 text-xs sm:text-sm">{confirmationData.submittedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Credit Timeline Schedule */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Your $210 Credit Schedule ($35 / month)</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                6 Consecutive Months
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Credits will be automatically deducted directly from your utility statement beginning with your first full billing cycle.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <div key={month} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Month {month}</span>
                  <span className="text-sm font-extrabold text-amber-600 my-1">-$35.00</span>
                  <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 rounded py-0.5">Approved</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Status Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-base text-slate-900">
              <CreditCard className="w-5 h-5 text-blue-900" />
              <span>Billing & Payment Configuration</span>
            </div>
            {confirmationData.data.paymentMethod ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-sm block text-emerald-900">
                    {confirmationData.data.paymentMethod.brand} ending in •••• {confirmationData.data.paymentMethod.last4}
                  </span>
                  <span className="text-slate-500">
                    Expires: {confirmationData.data.paymentMethod.expMonth}/{confirmationData.data.paymentMethod.expYear} • Card Verified & Attached
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] uppercase">
                  Verified
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                Consolidated Utility Statement (billed through {confirmationData.data.utilityCompany}).
              </div>
            )}
          </div>

          {/* Next Steps Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">What Happens Next?</h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <strong className="text-slate-900 block">Utility Notification (Within 2 Business Days):</strong>
                  We inform {confirmationData.data.utilityCompany} of your supply selection. You will also receive an acknowledgment notice by mail/email.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <strong className="text-slate-900 block">Seamless Transition (Next Meter Read):</strong>
                  Your energy delivery continues without any disruption. {confirmationData.data.utilityCompany} continues reading your meter and maintaining your wires and pipes.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <strong className="text-slate-900 block">First Credit Applied:</strong>
                  Your first $35 monthly promotional deduction appears directly on your consolidated utility statement.
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Summary */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 text-xs text-slate-600 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Enrollment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 border-t border-slate-100 pt-3">
              <div><strong>Name:</strong> {confirmationData.data.fullName}</div>
              <div><strong>Email:</strong> {confirmationData.data.email}</div>
              <div><strong>Phone:</strong> {confirmationData.data.phone}</div>
              <div><strong>Address:</strong> {confirmationData.data.serviceAddress}, {confirmationData.data.city}, NY {confirmationData.data.zipCode}</div>
              <div><strong>Utility:</strong> {confirmationData.data.utilityCompany}</div>
              <div><strong>Service Type:</strong> {confirmationData.data.serviceType.toUpperCase()}</div>
              <div><strong>Payment Method:</strong> {confirmationData.data.paymentMethod ? `${confirmationData.data.paymentMethod.brand} •••• ${confirmationData.data.paymentMethod.last4}` : 'Consolidated Utility Bill'}</div>
            </div>
          </div>

          {/* Mandatory Independent Supplier Notice */}
          <IndependentNotice variant="card" showOfferTerms={true} />

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('portal')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 transition-colors shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Go to Customer Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Confirmation</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Enrollment Form View
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Overview</span>
        </button>

        {/* Top Header Card */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-8 sm:p-10 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide uppercase">
            Special $210 Credit Offer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sign Up & Switch Your Energy Supply
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Switch in 2 minutes. Receive a <strong>$210 bill credit spread as $35/month for 6 months</strong> right on your utility statement. Zero disruption to your physical service.
          </p>
        </div>

        {/* Regulatory Disclosure Required near $210 mention */}
        <IndependentNotice variant="inline" showOfferTerms={true} />

        {/* Form Container */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-lg">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            
            {/* Step 1: Personal Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-base font-bold text-slate-900">Customer & Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Johnathan Miller"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      errors.fullName ? 'border-rose-500 bg-rose-50/50 form-error' : 'border-slate-300 focus:border-blue-900'
                    } focus:outline-hidden transition-colors`}
                  />
                  {errors.fullName && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      errors.email ? 'border-rose-500 bg-rose-50/50 form-error' : 'border-slate-300 focus:border-blue-900'
                    } focus:outline-hidden transition-colors`}
                  />
                  {errors.email && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(212) 555-0198"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      errors.phone ? 'border-rose-500 bg-rose-50/50 form-error' : 'border-slate-300 focus:border-blue-900'
                    } focus:outline-hidden transition-colors`}
                  />
                  {errors.phone && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: New York Service Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-base font-bold text-slate-900">Service Address in New York</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label htmlFor="serviceAddress" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Street Address & Apt / Suite <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="serviceAddress"
                    type="text"
                    required
                    value={formData.serviceAddress}
                    onChange={(e) => setFormData({ ...formData, serviceAddress: e.target.value })}
                    placeholder="e.g. 420 E 54th St, Apt 8B"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      errors.serviceAddress ? 'border-rose-500 bg-rose-50/50 form-error' : 'border-slate-300 focus:border-blue-900'
                    } focus:outline-hidden transition-colors`}
                  />
                  {errors.serviceAddress && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.serviceAddress}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York, Brooklyn, White Plains..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      errors.city ? 'border-rose-500 bg-rose-50/50 form-error' : 'border-slate-300 focus:border-blue-900'
                    } focus:outline-hidden transition-colors`}
                  />
                  {errors.city && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    NY ZIP Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    maxLength={5}
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="10022"
                    className={`w-full px-4 py-3 rounded-xl border text-sm ${
                      errors.zipCode ? 'border-rose-500 bg-rose-50/50 form-error' : 'border-slate-300 focus:border-blue-900'
                    } focus:outline-hidden transition-colors`}
                  />
                  {errors.zipCode && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Utility Company & Service Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="text-base font-bold text-slate-900">Utility Company & Service Type</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="utilityCompany" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Current Utility Company <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="utilityCompany"
                    required
                    value={formData.utilityCompany}
                    onChange={(e) => setFormData({ ...formData, utilityCompany: e.target.value as UtilityProvider })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-900 focus:outline-hidden"
                  >
                    {NY_UTILITIES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your utility delivers the energy. {COMPANY_NAME} supplies the commodity.
                  </p>
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Utility Account Number <span className="text-slate-400 font-normal">(Recommended)</span>
                  </label>
                  <input
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="e.g. 10 or 15-digit utility acc #"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:border-blue-900 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Found on the top right of your Con Edison or National Grid bill.
                  </p>
                </div>

                {/* Service Type Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Service Type to Switch <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: 'both' })}
                      className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                        formData.serviceType === 'both'
                          ? 'border-blue-900 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <Flame className="w-4 h-4 text-cyan-500" />
                        <span className="font-bold text-sm text-slate-900">Dual Fuel (Both)</span>
                      </div>
                      <p className="text-xs text-slate-500">Electricity & Natural Gas (Most Popular)</p>
                      <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                        Best Value
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: 'electricity' })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.serviceType === 'electricity'
                          ? 'border-blue-900 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-sm text-slate-900">Electricity Only</span>
                      </div>
                      <p className="text-xs text-slate-500">Electric supply switched to HPG</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: 'gas' })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.serviceType === 'gas'
                          ? 'border-blue-900 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="w-4 h-4 text-cyan-500" />
                        <span className="font-bold text-sm text-slate-900">Natural Gas Only</span>
                      </div>
                      <p className="text-xs text-slate-500">Gas supply switched to HPG</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Payment Method (Add Card) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">4</span>
                <h2 className="text-base font-bold text-slate-900">Payment Method Options</h2>
              </div>

              {/* Payment Choice Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentChoice('card')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentChoice === 'card'
                      ? 'border-blue-900 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                    <CreditCard className="w-4 h-4 text-blue-900" />
                    <span>Credit / Debit Card (Recommended)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Add card for automated monthly billing and prompt promotional credits.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentChoice('utility_bill');
                    setFormData({ ...formData, paymentMethod: undefined });
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentChoice === 'utility_bill'
                      ? 'border-blue-900 bg-blue-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Consolidated Utility Statement</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Continue paying through your monthly {formData.utilityCompany} bill directly.
                  </p>
                </button>
              </div>

              {/* Secure Card Input Component when card choice is selected */}
              {paymentChoice === 'card' && (
                <div className="pt-2">
                  <CardPaymentInput
                    cardholderName={formData.fullName || 'New Customer'}
                    email={formData.email || 'customer@example.com'}
                    tokenizedCard={formData.paymentMethod}
                    onCardTokenized={(card) => {
                      setFormData({ ...formData, paymentMethod: card });
                      setErrors((prev) => ({ ...prev, payment: undefined }));
                    }}
                  />
                  {errors.payment && (
                    <p className="text-rose-600 text-xs mt-2 font-medium bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                      {errors.payment}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Step 5: Terms Agreement & Explicit Authorization */}
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 text-xs text-slate-600 leading-relaxed space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <FileCheck className="w-4 h-4 text-blue-900" />
                  <span>Step 5: Enrollment Agreement & Disclosures</span>
                </div>
                <p>
                  By enrolling, I authorize {COMPANY_NAME} to act as my independent energy services company (ESCO) to supply electricity and/or natural gas for the designated service address and obtain billing history from my current utility ({formData.utilityCompany}).
                </p>
                <p>
                  <strong>Promotional Credit Terms:</strong> A total bill credit of $210 is distributed as a $35 monthly deduction for 6 consecutive billing cycles for new residential customers. Requires active service. If enrollment is terminated before the end of the 6-month period, remaining scheduled future credits are forfeited.
                </p>
                <p className="text-slate-500 italic">
                  <strong>Notice:</strong> {COMPANY_NAME} is an independent energy supplier, not affiliated with your utility. You are not required to switch.
                </p>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I confirm that I am at least 18 years old, authorized to make decisions for this utility account, agree to the{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('offer-details')}
                      className="text-blue-900 font-bold hover:underline cursor-pointer"
                    >
                      Offer Details
                    </button>
                    ,{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('terms')}
                      className="text-blue-900 font-bold hover:underline cursor-pointer"
                    >
                      Terms of Service
                    </button>
                    , and understand that my physical utility delivery is uninterrupted.
                  </span>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-rose-600 text-xs mt-1 font-medium">{errors.agreedToTerms}</p>
                )}
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                256-bit encrypted secure enrollment
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-blue-900 hover:bg-blue-950 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Enrollment...</span>
                ) : (
                  <>
                    <span>Submit Enrollment & Claim $210 Credit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
