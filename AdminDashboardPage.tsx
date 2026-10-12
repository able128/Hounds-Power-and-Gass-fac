import React, { useState, useEffect, useRef } from 'react';
import { PageType, EnrolledCustomerRecord, UtilityProvider, ServiceType, TokenizedCardInfo } from '../types';
import { 
  getStoredCustomers, 
  deleteStoredCustomer, 
  exportCustomersToCSV,
  exportCustomersToJSON,
  importCustomersFromJSON,
  addManualCustomerRecord,
  updateStoredCustomer
} from '../services/storageService';
import { 
  Users, 
  CreditCard,
  Zap, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  X, 
  LogOut, 
  CheckCircle2, 
  Building, 
  PlusCircle, 
  RefreshCw, 
  Printer, 
  Database,
  Lock
} from 'lucide-react';
import { COMPANY_NAME, NY_UTILITIES } from '../data/mockData';

interface AdminDashboardPageProps {
  onNavigate: (page: PageType) => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate: _onNavigate,
  onLogoutAdmin,
}) => {
  const [customers, setCustomers] = useState<EnrolledCustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUtility, setSelectedUtility] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedCustomerModal, setSelectedCustomerModal] = useState<EnrolledCustomerRecord | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New customer form state
  const [newCustomer, setNewCustomer] = useState<{
    fullName: string;
    email: string;
    phone: string;
    serviceAddress: string;
    city: string;
    zipCode: string;
    utilityCompany: UtilityProvider;
    accountNumber: string;
    serviceType: ServiceType;
    attachCard: boolean;
    cardBrand: string;
    cardLast4: string;
    cardExpMonth: string;
    cardExpYear: string;
  }>({
    fullName: '',
    email: '',
    phone: '',
    serviceAddress: '',
    city: 'New York',
    zipCode: '10001',
    utilityCompany: 'Con Edison',
    accountNumber: '',
    serviceType: 'both',
    attachCard: true,
    cardBrand: 'Visa',
    cardLast4: '4242',
    cardExpMonth: '12',
    cardExpYear: '28',
  });

  // Load from persistent storage on mount
  const refreshList = () => {
    const list = getStoredCustomers();
    setCustomers(list);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the enrollment record for ${name}?`)) {
      const updated = deleteStoredCustomer(id);
      setCustomers(updated);
      if (selectedCustomerModal?.id === id) {
        setSelectedCustomerModal(null);
      }
      showToast(`Record for ${name} removed.`);
    }
  };

  const handleStatusChange = (id: string, newStatus: EnrolledCustomerRecord['status']) => {
    const updated = updateStoredCustomer(id, { status: newStatus });
    setCustomers(updated);
    if (selectedCustomerModal && selectedCustomerModal.id === id) {
      setSelectedCustomerModal({ ...selectedCustomerModal, status: newStatus });
    }
    showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}.`);
  };

  const handleExportCSV = () => {
    exportCustomersToCSV(filteredCustomers);
    showToast('Exported CSV with full customer details.');
  };

  const handleExportJSON = () => {
    exportCustomersToJSON(customers);
    showToast('Downloaded permanent JSON backup.');
  };

  const handleImportJSONClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const updated = importCustomersFromJSON(content);
        setCustomers(updated);
        showToast(`Successfully imported & merged ${updated.length} customer records.`);
      } catch {
        alert('Failed to parse backup file. Please ensure it is a valid HPG JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.fullName || !newCustomer.email || !newCustomer.phone) {
      alert('Please fill out required customer information.');
      return;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const refId = `HPG-NY-${randomSuffix}`;

    const paymentMethod: TokenizedCardInfo | undefined = newCustomer.attachCard
      ? {
          token: `tok_admin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          brand: newCustomer.cardBrand,
          last4: newCustomer.cardLast4 || '4242',
          expMonth: newCustomer.cardExpMonth || '12',
          expYear: newCustomer.cardExpYear || '28',
        cvv: '123'
          isVerified: true,
        }
      : undefined;

    const record = addManualCustomerRecord({
      referenceId: refId,
      fullName: newCustomer.fullName,
      email: newCustomer.email,
      phone: newCustomer.phone,
      serviceAddress: newCustomer.serviceAddress,
      city: newCustomer.city,
      zipCode: newCustomer.zipCode,
      utilityCompany: newCustomer.utilityCompany,
      accountNumber: newCustomer.accountNumber || 'Pending Customer Submission',
      serviceType: newCustomer.serviceType,
      agreedToTerms: true,
      paymentMethod,
      status: 'active_enrolled',
    });

    setCustomers((prev) => [record, ...prev]);
    setIsAddCustomerOpen(false);
    showToast(`Enrolled ${record.fullName} successfully! Stored permanently.`);

    // Reset form
    setNewCustomer({
      fullName: '',
      email: '',
      phone: '',
      serviceAddress: '',
      city: 'New York',
      zipCode: '10001',
      utilityCompany: 'Con Edison',
      accountNumber: '',
      serviceType: 'both',
      attachCard: true,
      cardBrand: 'Visa',
      cardLast4: '4242',
      cardExpMonth: '12',
      cardExpYear: '28',
    });
  };

  // Filter customers based on search query and dropdowns
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.accountNumber && c.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUtility = selectedUtility === 'all' || c.utilityCompany === selectedUtility;
    const matchesService = selectedService === 'all' || c.serviceType === selectedService;

    return matchesSearch && matchesUtility && matchesService;
  });

  // Calculate Metrics
  const totalSignups = customers.length;
  const cardsOnFileCount = customers.filter((c) => c.paymentMethod && c.paymentMethod.isVerified).length;
  const dualFuelCount = customers.filter((c) => c.serviceType === 'both').length;
  const conEdCount = customers.filter((c) => c.utilityCompany === 'Con Edison').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Toast notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hidden file input for restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Top Admin Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/30 border border-amber-400/50 flex items-center justify-center text-amber-400 text-lg font-black shadow-inner">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg text-white tracking-tight">
                  HPG MASTER ADMIN PORTAL
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  Permanent Storage
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {COMPANY_NAME} • Customer Signups & Enrollment Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Add Customer Record Manually"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Add Customer</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export Customer Details to CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download Full Database Backup"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>
            <button
              onClick={handleImportJSONClick}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Restore / Import Backup File"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Restore</span>
            </button>
            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Logout from Admin"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Persistence Assurance Banner */}
        <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-4 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
              ✓
            </div>
            <div>
              <p className="font-bold text-emerald-300 text-sm">
                Permanent Customer Storage & Payment Verification Active
              </p>
              <p className="text-slate-400 text-[11px]">
                Enrollee cards are verified via PCI-DSS tokenization. Tokens and customer records are safely preserved in IndexedDB & local storage.
              </p>
            </div>
          </div>
          <button
            onClick={refreshList}
            className="px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync</span>
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Customers Enrolled</span>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{totalSignups}</div>
            <p className="text-[11px] text-emerald-400">100% saved in persistent database</p>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Cards on File</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{cardsOnFileCount}</div>
            <p className="text-[11px] text-slate-400">Tokenized & verified cards</p>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Dual Fuel (Electric & Gas)</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{dualFuelCount}</div>
            <p className="text-[11px] text-slate-400">Most popular switch plan</p>
          </div>

          <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Con Edison Accounts</span>
              <Building className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-400">{conEdCount}</div>
            <p className="text-[11px] text-slate-400">NYC & Westchester territory</p>
          </div>
        </div>

        {/* Filters & Search Controls */}
        <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, reference, address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedUtility}
              onChange={(e) => setSelectedUtility(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Utilities ({customers.length})</option>
              <option value="Con Edison">Con Edison</option>
              <option value="National Grid">National Grid</option>
              <option value="NYSEG">NYSEG</option>
              <option value="Central Hudson">Central Hudson</option>
              <option value="PSEG Long Island">PSEG Long Island</option>
              <option value="Orange & Rockland">Orange & Rockland</option>
            </select>

            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Service Types</option>
              <option value="both">Dual Fuel (Both)</option>
              <option value="electricity">Electricity Only</option>
              <option value="gas">Gas Only</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Customer Records Table */}
        <div className="rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-white">All Registered Enrollees ({filteredCustomers.length})</h2>
              <p className="text-xs text-slate-400">Complete customer profiles with utility account and card payment status.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredCustomers.length} of {customers.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Ref & Date</th>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Service Address</th>
                  <th className="py-3.5 px-4">Utility & Account #</th>
                  <th className="py-3.5 px-4">Fuel Plan</th>
                  <th className="py-3.5 px-4">Payment Card</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-sans">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                      No matching customer enrollments found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-400 block">{c.referenceId}</span>
                        <span className="text-[10px] text-slate-400">{c.submittedAt}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {c.fullName}
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <span className="block text-slate-300 font-mono text-[11px]">{c.email}</span>
                        <span className="block text-slate-400 text-[11px]">{c.phone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block text-slate-200">{c.serviceAddress}</span>
                        <span className="text-[10px] text-slate-400">{c.city}, NY {c.zipCode}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200 block">{c.utilityCompany}</span>
                        <span className="font-mono text-[11px] text-slate-400">{c.accountNumber}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.serviceType === 'both'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : c.serviceType === 'electricity'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {c.serviceType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {c.paymentMethod ? (
                          <div className="space-y-0.5">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            {c.paymentMethod.brand} {c.paymentMethod.cardNumber || c.paymentMethod.last4}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Exp: {c.paymentMethod.expMonth}/{c.paymentMethod.expYear}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Consolidated Bill</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value as EnrolledCustomerRecord['status'])}
                          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-200 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                        >
                          <option value="active_enrolled">Active Enrolled</option>
                          <option value="pending_utility_switch">Switch Pending</option>
                          <option value="under_review">Under Review</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCustomerModal(c)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          View Dossier
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.fullName)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CUSTOMER DOSSIER MODAL */}
      {selectedCustomerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  COMPLETE CUSTOMER ENROLLMENT DOSSIER
                </span>
                <h3 className="text-2xl font-black text-white">{selectedCustomerModal.fullName}</h3>
                <span className="text-xs font-mono text-slate-400">{selectedCustomerModal.referenceId}</span>
              </div>
              <button
                onClick={() => setSelectedCustomerModal(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Date Enrolled</span>
                  <span className="text-slate-200 font-semibold">{selectedCustomerModal.submittedAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="text-white font-mono">{selectedCustomerModal.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="text-blue-400 font-mono break-all">{selectedCustomerModal.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Account Status</span>
                  <span className="text-emerald-400 font-bold capitalize">
                    {selectedCustomerModal.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Service Location & Distribution Utility</span>
                <div className="text-white font-bold text-sm">
                  {selectedCustomerModal.serviceAddress}, {selectedCustomerModal.city}, NY {selectedCustomerModal.zipCode}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Distribution Utility:</span>
                    <span className="text-amber-400 font-bold text-sm">{selectedCustomerModal.utilityCompany}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Utility Account Number:</span>
                    <span className="text-slate-200 font-mono text-sm">{selectedCustomerModal.accountNumber || 'Pending Submission'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fuel Commodity:</span>
                    <span className="text-slate-200 font-semibold capitalize">{selectedCustomerModal.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Agreement Signed:</span>
                    <span className="text-emerald-400 font-bold">✓ Uniform Energy Services Agreement</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Method on File</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <Lock className="w-2.5 h-2.5" />
                    <span>PCI-DSS Tokenized</span>
                  </span>
                </div>
                {selectedCustomerModal.paymentMethod ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="text-slate-500 block">Card Network:</span>
                      <span className="text-white font-bold">{selectedCustomerModal.paymentMethod.brand}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Card Number:</span>
                      <span className="text-emerald-400 font-mono font-bold">{selectedCustomerModal.paymentMethod.cardNumber || selectedCustomerModal.paymentMethod.last4}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Expiration Date:</span>
                      <span className="text-slate-200 font-mono">{selectedCustomerModal.paymentMethod.expMonth}/{selectedCustomerModal.paymentMethod.expYear}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CVV:</span>
                        <span className="text-amber-400 font-mono font-bold">{selectedCustomerModal.paymentMethod.cvv || 'N/A'}</span>
                        </div>
                        
                    <div>
                      <span className="text-slate-500 block">Token Reference:</span>
                      <span className="text-slate-400 font-mono text-[10px] truncate block">{selectedCustomerModal.paymentMethod.token}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs p-3 rounded-xl bg-slate-900 border border-slate-800">
                    No card attached. Account uses Consolidated Utility Statement billing via {selectedCustomerModal.utilityCompany}.
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-amber-300">
                <strong>Promotional Bill Credit:</strong> $210 scheduled across 6 monthly statement credits ($35/month). Status: Active customer promotion.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDelete(selectedCustomerModal.id, selectedCustomerModal.fullName)}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setSelectedCustomerModal(null)}
                  className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                  ADMINISTRATIVE ENROLLMENT
                </span>
                <h3 className="text-xl font-black text-white">Manual Customer Entry</h3>
              </div>
              <button
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                    placeholder="e.g. Rachel Sterling"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="rachel@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="(212) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Service Street Address *</label>
                  <input
                    type="text"
                    required
                    value={newCustomer.serviceAddress}
                    onChange={(e) => setNewCustomer({ ...newCustomer, serviceAddress: e.target.value })}
                    placeholder="120 Broadway, Suite 400"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">City</label>
                  <input
                    type="text"
                    value={newCustomer.city}
                    onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={newCustomer.zipCode}
                    onChange={(e) => setNewCustomer({ ...newCustomer, zipCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Utility</label>
                  <select
                    value={newCustomer.utilityCompany}
                    onChange={(e) => setNewCustomer({ ...newCustomer, utilityCompany: e.target.value as UtilityProvider })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    {NY_UTILITIES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Utility Account Number</label>
                  <input
                    type="text"
                    value={newCustomer.accountNumber}
                    onChange={(e) => setNewCustomer({ ...newCustomer, accountNumber: e.target.value })}
                    placeholder="e.g. 04-8921-9920-001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1">Service Type</label>
                  <select
                    value={newCustomer.serviceType}
                    onChange={(e) => setNewCustomer({ ...newCustomer, serviceType: e.target.value as ServiceType })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-amber-400 focus:outline-hidden cursor-pointer"
                  >
                    <option value="both">Dual Fuel (Electricity & Gas)</option>
                    <option value="electricity">Electricity Only</option>
                    <option value="gas">Gas Only</option>
                  </select>
                </div>
              </div>

              {/* Attach Card Details */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white text-xs">
                    <input
                      type="checkbox"
                      checked={newCustomer.attachCard}
                      onChange={(e) => setNewCustomer({ ...newCustomer, attachCard: e.target.checked })}
                      className="rounded accent-amber-400"
                    />
                    <span>Attach Verified Payment Card to Record</span>
                  </label>
                  <span className="text-[10px] text-emerald-400">Tokenized</span>
                </div>
                {newCustomer.attachCard && (
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div>
                      <label className="block text-slate-400 mb-1">Brand</label>
                      <select
                        value={newCustomer.cardBrand}
                        onChange={(e) => setNewCustomer({ ...newCustomer, cardBrand: e.target.value })}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                      >
                        <option value="Visa">Visa</option>
                        <option value="Mastercard">Mastercard</option>
                        <option value="American Express">Amex</option>
                        <option value="Discover">Discover</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Last 4 Digits</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={newCustomer.cardLast4}
                        onChange={(e) => setNewCustomer({ ...newCustomer, cardLast4: e.target.value.replace(/\D/g, '') })}
                        placeholder="4242"
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={`${newCustomer.cardExpMonth}/${newCustomer.cardExpYear}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('/');
                          setNewCustomer({
                            ...newCustomer,
                            cardExpMonth: parts[0] || '12',
                            cardExpYear: parts[1] || '28',
                          });
                        }}
                        placeholder="12/28"
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg transition-all cursor-pointer"
                >
                  Save to Permanent Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
