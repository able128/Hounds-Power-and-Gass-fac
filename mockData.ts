import { CustomerAccount, UtilityProvider } from '../types';

export const COMPANY_NAME = 'Hounds Power and Gas';
export const TAGLINE = 'Powering a Brighter Tomorrow';
export const SUPPORT_PHONE = '1-800-555-HOUND (1-800-555-4686)';
export const SUPPORT_EMAIL = 'support@houndspowergas.com';

export const EMERGENCY_INFO = {
  conEd: '1-800-75-CONED (1-800-752-6633)',
  natGridGas: '1-800-867-5222',
  nyseg: '1-800-572-1131',
  centralHudson: '1-800-527-2714',
  psegLI: '1-800-490-0075',
};

export const NY_UTILITIES: UtilityProvider[] = [
  'Con Edison',
  'National Grid',
  'NYSEG',
  'Central Hudson',
  'PSEG Long Island',
  'Orange & Rockland',
  'Other',
];

export const INITIAL_DEMO_ACCOUNT: CustomerAccount = {
  id: 'cust_849204',
  accountNumber: 'HPG-9924-CONED',
  fullName: 'Johnathan Miller',
  email: 'j.miller@example.com',
  phone: '(212) 555-0198',
  serviceAddress: '420 E 54th St, Apt 8B, New York, NY 10022',
  utilityCompany: 'Con Edison',
  serviceType: 'both',
  enrollmentDate: 'January 14, 2026',
  planName: 'Hounds Fixed Secure 12-Month',
  currentRate: '9.45¢/kWh (Elec) & $0.68/therm (Gas)',
  totalPromoCreditsEarned: 105.00, // 3 months of $35 applied so far
  creditsHistory: [
    {
      monthIndex: 1,
      monthName: 'February 2026',
      amount: 35,
      status: 'applied',
      dateApplied: 'Feb 15, 2026',
      billNumber: 'INV-2026-02-CONED',
    },
    {
      monthIndex: 2,
      monthName: 'March 2026',
      amount: 35,
      status: 'applied',
      dateApplied: 'Mar 15, 2026',
      billNumber: 'INV-2026-03-CONED',
    },
    {
      monthIndex: 3,
      monthName: 'April 2026',
      amount: 35,
      status: 'applied',
      dateApplied: 'Apr 15, 2026',
      billNumber: 'INV-2026-04-CONED',
    },
    {
      monthIndex: 4,
      monthName: 'May 2026',
      amount: 35,
      status: 'scheduled',
      dateApplied: 'Scheduled May 15, 2026',
    },
    {
      monthIndex: 5,
      monthName: 'June 2026',
      amount: 35,
      status: 'scheduled',
      dateApplied: 'Scheduled June 15, 2026',
    },
    {
      monthIndex: 6,
      monthName: 'July 2026',
      amount: 35,
      status: 'scheduled',
      dateApplied: 'Scheduled July 15, 2026',
    },
  ],
  recentBills: [
    {
      id: 'INV-2026-04-CONED',
      billingPeriod: 'Mar 15 – Apr 14, 2026',
      statementDate: 'Apr 15, 2026',
      dueDate: 'May 05, 2026',
      electricityKWh: 480,
      gasTherms: 38,
      supplyCharge: 71.20,
      deliveryCharge: 48.30,
      promoCredit: -35.00,
      totalDue: 84.50,
      status: 'due',
    },
    {
      id: 'INV-2026-03-CONED',
      billingPeriod: 'Feb 15 – Mar 14, 2026',
      statementDate: 'Mar 15, 2026',
      dueDate: 'Apr 05, 2026',
      electricityKWh: 510,
      gasTherms: 45,
      supplyCharge: 78.80,
      deliveryCharge: 52.20,
      promoCredit: -35.00,
      totalDue: 96.00,
      status: 'paid',
    },
    {
      id: 'INV-2026-02-CONED',
      billingPeriod: 'Jan 15 – Feb 14, 2026',
      statementDate: 'Feb 15, 2026',
      dueDate: 'Mar 05, 2026',
      electricityKWh: 540,
      gasTherms: 52,
      supplyCharge: 86.40,
      deliveryCharge: 57.60,
      promoCredit: -35.00,
      totalDue: 109.00,
      status: 'paid',
    },
  ],
  currentBalance: 84.50,
};

export const FAQ_ITEMS = [
  {
    question: 'Who qualifies for the $210 credit?',
    answer:
      'New residential customers in New York (within Con Edison, National Grid, NYSEG, and participating utility service areas) who switch their electricity and/or natural gas supply to Hounds Power and Gas qualify. You must have an active residential account with your local utility and remain enrolled.',
  },
  {
    question: 'When will I see my credit?',
    answer:
      'You will receive a $35 credit on your bill each month for 6 consecutive billing cycles, starting with your very first full billing cycle following successful utility enrollment.',
  },
  {
    question: 'Will my service be interrupted when I switch?',
    answer:
      'No, absolutely not. Your local utility (such as Con Edison) continues to deliver your energy through the same physical power lines and pipes, reads your meter, and handles all emergency repairs and power outages. Only the supplier of your energy changes on your statement.',
  },
  {
    question: 'What happens after 6 months?',
    answer:
      'After the 6-month promotional period ends, your account continues smoothly at our competitive standard fixed or variable market rate. We always notify you in writing prior to any rate adjustment so you stay in total control.',
  },
  {
    question: 'Can I cancel my enrollment?',
    answer:
      'Yes. There are no cancellation fees for standard residential customers. If you cancel prior to completing the 6-month credit period, any credits already applied to your past bills remain yours, while remaining future scheduled monthly credits are forfeited.',
  },
  {
    question: 'How do I pay my bill?',
    answer:
      'You never need to set up a new payment method! Your energy billing remains consolidated with your local utility (such as Con Edison, National Grid, or NYSEG). You continue paying your normal utility bill as usual, and your $35 monthly promotional credits are automatically deducted right on your utility statement.',
  },
  {
    question: 'Do I have to switch my energy supplier?',
    answer:
      'No. Energy choice in New York is completely optional. Hounds Power and Gas is an independent energy services company (ESCO) licensed by the NY Public Service Commission. You are never required to switch your energy supplier.',
  },
];
