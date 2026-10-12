/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PageType, CustomerAccount, SignUpFormData, UtilityProvider } from './types';
import { INITIAL_DEMO_ACCOUNT } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingChat } from './components/FloatingChat';
import { HomePage } from './pages/HomePage';
import { SignUpPage } from './pages/SignUpPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { PaymentPage } from './pages/PaymentPage';
import { ContactPage } from './pages/ContactPage';
import { LegalOfferPage } from './pages/LegalOfferPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginModal } from './components/AdminLoginModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [customerAccount, setCustomerAccount] = useState<CustomerAccount>(INITIAL_DEMO_ACCOUNT);
  const [selectedUtilityForSignup, setSelectedUtilityForSignup] = useState<UtilityProvider>('Con Edison');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Navigate handler with smooth scroll
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When card payment succeeds
  const handlePaymentSuccess = (amount: number, _reference: string) => {
    setCustomerAccount((prev) => {
      const newBalance = Math.max(0, prev.currentBalance - amount);
      const updatedBills = prev.recentBills.map((b) => {
        if (b.status === 'due' && amount >= b.totalDue) {
          return { ...b, status: 'paid' as const };
        }
        return b;
      });
      return {
        ...prev,
        currentBalance: newBalance,
        recentBills: updatedBills,
      };
    });
  };

  // When user completes enrollment on SignUpPage
  const handleEnrollmentComplete = (formData: SignUpFormData, refId: string) => {
    setCustomerAccount((prev) => ({
      ...prev,
      accountNumber: refId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      serviceAddress: `${formData.serviceAddress}, ${formData.city}, NY ${formData.zipCode}`,
      utilityCompany: formData.utilityCompany,
      serviceType: formData.serviceType,
      paymentMethod: formData.paymentMethod,
      currentBalance: 0,
      totalPromoCreditsEarned: 0,
    }));
  };

  // Triggered by holding the logo for 850ms on Navbar or Footer
  const handleAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAdminModalOpen(true);
    }
  };

  // Render dedicated Admin Dashboard if currentPage is 'admin'
  if (currentPage === 'admin' && isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-amber-500 selection:text-white">
        <AdminDashboardPage
          onNavigate={handleNavigate}
          onLogoutAdmin={() => {
            setIsAdminLoggedIn(false);
            handleNavigate('home');
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Navigation with long-press Admin trigger */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={true}
        onAdminTrigger={handleAdminTrigger}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectUtility={(u) => setSelectedUtilityForSignup(u)}
          />
        )}
        {currentPage === 'signup' && (
          <SignUpPage
            onNavigate={handleNavigate}
            preselectedUtility={selectedUtilityForSignup}
            onEnrollmentComplete={handleEnrollmentComplete}
          />
        )}
        {currentPage === 'portal' && (
          <CustomerPortalPage
            onNavigate={handleNavigate}
            account={customerAccount}
          />
        )}
        {currentPage === 'payment' && (
          <PaymentPage
            onNavigate={handleNavigate}
            defaultAmount={customerAccount.currentBalance}
            customerAccount={customerAccount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}
        {currentPage === 'offer-details' && (
          <LegalOfferPage initialTab="offer" onNavigate={handleNavigate} />
        )}
        {currentPage === 'terms' && (
          <LegalOfferPage initialTab="terms" onNavigate={handleNavigate} />
        )}
        {currentPage === 'privacy' && (
          <LegalOfferPage initialTab="privacy" onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer with long-press Admin trigger */}
      <Footer
        onNavigate={handleNavigate}
        onAdminTrigger={handleAdminTrigger}
      />

      {/* Floating Chat / Help Drawer Button */}
      <FloatingChat onNavigate={handleNavigate} />

      {/* Secret Admin Verification Modal (Triggered by long-pressing website logo, password: @3in1@) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminModalOpen(false);
          setCurrentPage('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
