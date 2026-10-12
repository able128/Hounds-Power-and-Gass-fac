import { EnrolledCustomerRecord, SignUpFormData } from '../types';

const STORAGE_KEY = 'HPG_ENROLLED_CUSTOMERS_V3';
const BACKUP_STORAGE_KEY = 'HPG_ENROLLED_CUSTOMERS_PERMANENT_BACKUP_V3';
const IDB_NAME = 'HPG_DATABASE_V3';
const IDB_STORE = 'customers';

// Initial pre-loaded customer records so admin sees historical signups
const INITIAL_RECORDS: EnrolledCustomerRecord[] = [
  {
    id: 'rec_1001',
    referenceId: 'HPG-NY-992401',
    fullName: 'Johnathan Miller',
    email: 'j.miller@example.com',
    phone: '(212) 555-0198',
    serviceAddress: '420 E 54th St, Apt 8B',
    city: 'New York',
    zipCode: '10022',
    utilityCompany: 'Con Edison',
    accountNumber: '04-8921-9920-001',
    serviceType: 'both',
    agreedToTerms: true,
    paymentMethod: {
      token: 'tok_hpg_992401_sec',
      brand: 'Visa',
      last4: '4242',
      expMonth: '12',
      expYear: '28',
      isVerified: true,
    },
    submittedAt: 'Oct 04, 2026, 09:14 AM',
    status: 'active_enrolled',
  },
  {
    id: 'rec_1002',
    referenceId: 'HPG-NY-841920',
    fullName: 'Sarah Jenkins',
    email: 'sarah.j@nycmail.org',
    phone: '(718) 555-8392',
    serviceAddress: '185 Atlantic Ave, Fl 3',
    city: 'Brooklyn',
    zipCode: '11201',
    utilityCompany: 'National Grid',
    accountNumber: 'NG-883920194',
    serviceType: 'gas',
    agreedToTerms: true,
    paymentMethod: {
      token: 'tok_hpg_841920_sec',
      brand: 'Mastercard',
      last4: '8821',
      expMonth: '08',
      expYear: '27',
      isVerified: true,
    },
    submittedAt: 'Oct 05, 2026, 02:40 PM',
    status: 'pending_utility_switch',
  },
  {
    id: 'rec_1003',
    referenceId: 'HPG-NY-729401',
    fullName: 'Marcus Vance',
    email: 'm.vance@techcorp.io',
    phone: '(914) 555-4811',
    serviceAddress: '72 Main St',
    city: 'White Plains',
    zipCode: '10601',
    utilityCompany: 'Con Edison',
    accountNumber: 'CE-100482910',
    serviceType: 'electricity',
    agreedToTerms: true,
    submittedAt: 'Oct 06, 2026, 11:15 AM',
    status: 'pending_utility_switch',
  },
];

// In-memory cache to guarantee zero data loss during session
let inMemoryCustomers: EnrolledCustomerRecord[] = [...INITIAL_RECORDS];

// Request persistent storage from browser if available
if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().catch(() => {});
}

/**
 * Open or create IndexedDB connection
 */
function openIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Save records to IndexedDB in background
 */
async function syncToIndexedDB(records: EnrolledCustomerRecord[]): Promise<void> {
  const db = await openIndexedDB();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    store.clear();
    for (const rec of records) {
      store.put(rec);
    }
  } catch (err) {
    console.warn('IndexedDB sync error:', err);
  }
}

/**
 * Merge two lists of records by unique ID/referenceId without duplicates
 */
function mergeRecords(existing: EnrolledCustomerRecord[], fallback: EnrolledCustomerRecord[]): EnrolledCustomerRecord[] {
  const map = new Map<string, EnrolledCustomerRecord>();
  for (const item of fallback) {
    map.set(item.id, item);
  }
  for (const item of existing) {
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

/**
 * Get all stored customer signups from persistent storage
 */
export function getStoredCustomers(): EnrolledCustomerRecord[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    
    // If primary key missing, attempt restore from permanent backup key
    if (!raw) {
      raw = localStorage.getItem(BACKUP_STORAGE_KEY);
    }
    if (!raw) {
      // First run: save seed records
      const initial = [...INITIAL_RECORDS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(initial));
      syncToIndexedDB(initial);
      inMemoryCustomers = initial;
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with initial seed so default demo accounts remain available
      const merged = mergeRecords(parsed, INITIAL_RECORDS);
      inMemoryCustomers = merged;
      // Keep backup updated
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(merged));
      syncToIndexedDB(merged);
      return merged;
    }
    return inMemoryCustomers.length > 0 ? inMemoryCustomers : INITIAL_RECORDS;
  } catch (err) {
    console.error('Failed to read from localStorage:', err);
    return inMemoryCustomers.length > 0 ? inMemoryCustomers : INITIAL_RECORDS;
  }
}

/**
 * Save a newly completed enrollment permanently into persistent storage
 */
export function saveCustomerEnrollment(
  formData: SignUpFormData,
  referenceId: string
): EnrolledCustomerRecord {
  const current = getStoredCustomers();
  const newRecord: EnrolledCustomerRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    referenceId,
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    serviceAddress: formData.serviceAddress,
    city: formData.city,
    zipCode: formData.zipCode,
    utilityCompany: formData.utilityCompany,
    accountNumber: formData.accountNumber || 'Not provided (requested by mail)',
    serviceType: formData.serviceType,
    agreedToTerms: formData.agreedToTerms,
    paymentMethod: formData.paymentMethod,
    submittedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'pending_utility_switch',
  };

  // Prepend to top of list
  const updated = [newRecord, ...current];
  inMemoryCustomers = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
  // Also sync to IndexedDB
  syncToIndexedDB(updated);
  return newRecord;
}

/**
 * Manually add a customer record from the Admin Dashboard
 */
export function addManualCustomerRecord(record: Omit<EnrolledCustomerRecord, 'id' | 'submittedAt'>): EnrolledCustomerRecord {
  const current = getStoredCustomers();
  const newRecord: EnrolledCustomerRecord = {
    ...record,
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    submittedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
  const updated = [newRecord, ...current];
  inMemoryCustomers = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save manual record to localStorage:', err);
  }
  syncToIndexedDB(updated);
  return newRecord;
}

/**
 * Update an existing customer record (e.g., change status)
 */
export function updateStoredCustomer(id: string, updates: Partial<EnrolledCustomerRecord>): EnrolledCustomerRecord[] {
  const current = getStoredCustomers();
  const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
  inMemoryCustomers = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update localStorage:', err);
  }
  syncToIndexedDB(updated);
  return updated;
}

/**
 * Delete a customer record (Admin action)
 */
export function deleteStoredCustomer(id: string): EnrolledCustomerRecord[] {
  const current = getStoredCustomers();
  const updated = current.filter((c) => c.id !== id);
  inMemoryCustomers = updated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update localStorage:', err);
  }
  syncToIndexedDB(updated);
  return updated;
}

/**
 * Export all customer details to downloadable CSV
 */
export function exportCustomersToCSV(customers: EnrolledCustomerRecord[]): void {
  const headers = [
    'Reference ID',
    'Date Submitted',
    'Full Name',
    'Email',
    'Phone',
    'Street Address',
    'City',
    'ZIP Code',
    'Utility Provider',
    'Utility Account #',
    'Service Type',
    'Payment Method (Tokenized)',
    'Status',
  ];

  const rows = customers.map((c) => [
    `"${c.referenceId}"`,
    `"${c.submittedAt}"`,
    `"${c.fullName.replace(/"/g, '""')}"`,
    `"${c.email.replace(/"/g, '""')}"`,
    `"${c.phone}"`,
    `"${c.serviceAddress.replace(/"/g, '""')}"`,
    `"${c.city}"`,
    `"${c.zipCode}"`,
    `"${c.utilityCompany}"`,
    `"${(c.accountNumber || '').replace(/"/g, '""')}"`,
    `"${c.serviceType}"`,
    `"${c.paymentMethod ? `${c.paymentMethod.brand} •••• ${c.paymentMethod.last4} (${c.paymentMethod.expMonth}/${c.paymentMethod.expYear})` : 'Consolidated Utility Bill'}"`,
    `"${c.status}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `hounds_power_customers_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export raw JSON database backup for long-term safe archiving
 */
export function exportCustomersToJSON(customers: EnrolledCustomerRecord[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customers, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `HPG_CUSTOMER_DATABASE_BACKUP_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Import and merge customer records from a backup JSON file
 */
export function importCustomersFromJSON(jsonString: string): EnrolledCustomerRecord[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) throw new Error('Invalid backup format: expected array.');
    const current = getStoredCustomers();
    const merged = mergeRecords(parsed, current);
    
    inMemoryCustomers = merged;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(merged));
    syncToIndexedDB(merged);
    return merged;
  } catch (err) {
    console.error('Failed to import JSON backup:', err);
    throw err;
  }
}
