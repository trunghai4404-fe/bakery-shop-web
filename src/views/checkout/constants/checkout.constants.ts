import { CheckoutResultDto } from '@/interface/basket';

export const CHECKOUT_RESULT_STORAGE_KEY = 'bakery_last_checkout_result';

export function persistCheckoutResult(result: CheckoutResultDto): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CHECKOUT_RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Ignore storage quota errors
  }
}

export function readPersistedCheckoutResult(): CheckoutResultDto | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_RESULT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CheckoutResultDto>;
    if (!parsed.orderCode) return null;
    return {
      orderCode: String(parsed.orderCode),
      totalAmount: Number(parsed.totalAmount ?? 0),
      paymentStatus: String(parsed.paymentStatus ?? 'Unpaid'),
    };
  } catch {
    return null;
  }
}

