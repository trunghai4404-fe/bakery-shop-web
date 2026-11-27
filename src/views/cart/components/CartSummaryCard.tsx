'use client';

import { ROUTES } from '@/constants/routes-path';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/helper';
import { ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CartSummaryCardProps {
  totalQuantity: number;
  subtotal: number;
  hasBlockingWarning: boolean;
  disabled?: boolean;
}

export default function CartSummaryCard({
  totalQuantity,
  subtotal,
  hasBlockingWarning,
  disabled = false,
}: CartSummaryCardProps) {
  const t = useTranslations('Cart');

  return (
    <div className="rounded-lg border border-outline-variant/35 bg-surface-container-lowest p-5 sm:p-6 space-y-5 sticky top-24 shadow-xs">
      <div className="flex items-center justify-between border-b border-outline-variant/25 pb-4">
        <h2 className="font-heading text-lg font-bold text-on-surface">
          {t('summaryTitle')}
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {t('itemsCount', { count: totalQuantity })}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span>{t('subtotal')}</span>
          <span className="font-semibold text-on-surface">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant">
          <span>{t('shippingLabel')}</span>
          <span className="text-xs italic">{t('shippingCalculatedAtCheckout')}</span>
        </div>
      </div>

      <div className="border-t border-outline-variant/25 pt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-on-surface">{t('estimatedTotal')}</span>
        <span className="font-heading text-xl font-bold text-primary">
          {formatCurrency(subtotal)}
        </span>
      </div>

      {hasBlockingWarning && (
        <p className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs font-medium text-amber-800">
          {t('blockingCheckoutHint')}
        </p>
      )}

      <div className="space-y-2.5">
        {hasBlockingWarning ? (
          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary/40 px-5 py-3 text-sm font-bold text-white cursor-not-allowed"
          >
            <span>{t('proceedToCheckout')}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href={ROUTES.CHECKOUT}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-5 py-3 text-sm font-bold text-white shadow-xs transition-colors"
          >
            <span>{t('proceedToCheckout')}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
