'use client';

import CartWarningsBanner from '@/components/cart/CartWarningsBanner';
import { BasketItemDto } from '@/interface/basket';
import { formatCurrency } from '@/lib/helper';
import { ArrowRight, Loader2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface CheckoutSummaryProps {
  items: BasketItemDto[];
  subtotal: number;
  shippingFee: number;
  fulfillmentType: 'Pickup' | 'Delivery';
  hasWarnings: boolean;
  hasBlockingWarning: boolean;
  isSubmitting: boolean;
}

export default function CheckoutSummary({
  items,
  subtotal,
  shippingFee,
  fulfillmentType,
  hasWarnings,
  hasBlockingWarning,
  isSubmitting,
}: CheckoutSummaryProps) {
  const t = useTranslations('Checkout');
  const effectiveShippingFee = fulfillmentType === 'Delivery' ? shippingFee : 0;
  const estimatedTotal = subtotal + effectiveShippingFee;

  return (
    <div className="rounded-lg border border-outline-variant/35 bg-surface-container-lowest p-5 sm:p-6 space-y-5 sticky top-24 shadow-xs">
      <div className="flex items-center justify-between border-b border-outline-variant/25 pb-4">
        <h2 className="font-heading text-lg font-bold text-on-surface">
          {t('orderSummaryTitle')}
        </h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {items.reduce((sum, i) => sum + i.quantity, 0)} {t('itemsUnit')}
        </span>
      </div>

      <CartWarningsBanner hasWarnings={hasWarnings} items={items} />

      <ul className="max-h-72 overflow-y-auto divide-y divide-outline-variant/20 pr-1">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId}`}
            className="py-3 first:pt-0 last:pb-0 flex items-center gap-3"
          >
            <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-on-surface">
                {item.productName}
              </p>
              <p className="text-xs text-on-surface-variant">
                {item.variantName ? `${item.variantName} • ` : ''}
                x{item.quantity}
              </p>
            </div>

            <p className="shrink-0 text-sm font-bold text-on-surface">
              {formatCurrency(item.finalPrice)}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-2.5 border-t border-outline-variant/25 pt-4 text-sm">
        <div className="flex items-center justify-between text-on-surface-variant">
          <span>{t('subtotalLabel')}</span>
          <span className="font-semibold text-on-surface">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant">
          <span>{t('shippingFeeLabel')}</span>
          <span className="font-semibold text-on-surface">
            {fulfillmentType === 'Pickup'
              ? t('freePickup')
              : effectiveShippingFee > 0
                ? formatCurrency(effectiveShippingFee)
                : t('shippingFeePending')}
          </span>
        </div>
      </div>

      <div className="border-t border-outline-variant/25 pt-4 flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">{t('totalLabel')}</span>
        <span className="font-heading text-2xl font-bold text-primary">
          {formatCurrency(estimatedTotal)}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || hasBlockingWarning || items.length === 0}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-5 py-3.5 text-sm sm:text-base font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('placingOrder')}</span>
          </>
        ) : (
          <>
            <span>{t('placeOrderButton')}</span>
          </>
        )}
      </button>
    </div>
  );
}

