export type PageType = 
  | 'home' 
  | 'signup' 
  | 'portal' 
  | 'payment'
  | 'contact' 
  | 'offer-details' 
  | 'terms' 
  | 'privacy'
  | 'admin';

export type UtilityProvider = 
  | 'Con Edison' 
  | 'National Grid' 
  | 'NYSEG' 
  | 'Central Hudson' 
  | 'PSEG Long Island' 
  | 'Orange & Rockland' 
  | 'Other';

export type ServiceType = 'electricity' | 'gas' | 'both';

export interface TokenizedCardInfo {
  token: string;
  brand: string;
    cardNumber?: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isVerified: boolean;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  city: string;
  zipCode: string;
  utilityCompany: UtilityProvider;
  accountNumber?: string;
  serviceType: ServiceType;
  agreedToTerms: boolean;
  paymentMethod?: TokenizedCardInfo;
}

export interface EnrolledCustomerRecord {
  id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  city: string;
  zipCode: string;
  utilityCompany: UtilityProvider;
  accountNumber?: string;
  serviceType: ServiceType;
  agreedToTerms: boolean;
  paymentMethod?: TokenizedCardInfo;
  submittedAt: string;
  status: 'pending_utility_switch' | 'active_enrolled' | 'under_review';
}

export interface CreditMonthStatus {
  monthIndex: number; // 1 to 6
  monthName: string;
  amount: number; // $35
  status: 'applied' | 'pending' | 'scheduled';
  dateApplied?: string;
  billNumber?: string;
}

export interface BillRecord {
  id: string;
  billingPeriod: string;
  statementDate: string;
  dueDate: string;
  electricityKWh?: number;
  gasTherms?: number;
  supplyCharge: number;
  deliveryCharge: number;
  promoCredit: number; // e.g. -35.00
  totalDue: number;
  status: 'paid' | 'due' | 'overdue';
}

export interface CustomerAccount {
  id: string;
  accountNumber: string;
  fullName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  utilityCompany: UtilityProvider;
  serviceType: ServiceType;
  enrollmentDate: string;
  planName: string;
  currentRate: string;
  totalPromoCreditsEarned: number; // out of $210
  creditsHistory: CreditMonthStatus[];
  recentBills: BillRecord[];
  currentBalance: number;
  paymentMethod?: TokenizedCardInfo;
}
