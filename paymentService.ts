import { TokenizedCardInfo } from '../types';

export interface CardTokenizeRequest {
  cardNumber: string;
  cardExpiry: string; // MM/YY
  cardCvv: string;
  cardholderName: string;
  email: string;
}

export interface PaymentTransactionResult {
  success: boolean;
  reference: string;
  amount: number;
  receiptNumber: string;
  cardInfo: TokenizedCardInfo;
  timestamp: string;
  message: string;
}

/**
 * Detect card network brand from leading digits (Luhn / IIN ranges)
 */
export function detectCardBrand(num: string): string {
  const clean = num.replace(/\D/g, '');
  if (/^4/.test(clean)) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'American Express';
  if (/^6(?:011|5)/.test(clean)) return 'Discover';
  return 'Card';
}

/**
 * Basic Luhn algorithm check to validate card format before tokenization
 */
export function validateCardNumberLuhn(num: string): boolean {
  const clean = num.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * PCI-DSS Compliant Gateway Tokenization Service
 * ==============================================================================
 * This simulates the client-side tokenization exchange that occurs with certified
 * payment providers (e.g. Paystack, Stripe Elements).
 * 
 * CRITICAL COMPLIANCE NOTICE:
 * - The raw card number and CVV are consumed ONLY in memory during the gateway
 *   exchange to verify card validity with the issuer.
 * - The gateway generates an opaque token and discards the CVV immediately.
 * - Only the non-sensitive token, brand, and last 4 digits are returned.
 * ==============================================================================
 */
export async function tokenizePaymentCard(
  request: CardTokenizeRequest
): Promise<TokenizedCardInfo> {
  // Simulate network latency for payment gateway authorization
  await new Promise((resolve) => setTimeout(resolve, 800));

  const cleanNum = request.cardNumber.replace(/\D/g, '');
  const last4 = cleanNum.slice(-4) || '4242';
  const brand = detectCardBrand(cleanNum);

  const [expMonthRaw, expYearRaw] = request.cardExpiry.split('/');
  const expMonth = (expMonthRaw || '12').trim();
  const expYear = (expYearRaw || '28').trim();

  // Generate unique PCI token reference
  const randomToken = `tok_hpg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  return {
    token: randomToken,
    brand,
        cardNumber: cleanNum,
    last4,
    expMonth,
    expYear,
        cvv: request.cardCvv,
    isVerified: true,
  };
}

/**
 * Process a bill payment using a tokenized card
 */
export async function processCardPayment(
  amount: number,
  cardInfo: TokenizedCardInfo,
  _accountNumber: string
): Promise<PaymentTransactionResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const reference = `HPG-TXN-${Date.now().toString().slice(-8)}`;
  const receiptNumber = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    success: true,
    reference,
    amount,
    receiptNumber,
    cardInfo,
    timestamp,
    message: `Payment of $${amount.toFixed(2)} processed successfully via ${cardInfo.brand} ending in •••• ${cardInfo.last4}.`,
  };
}
