'use client';

import { FulfillmentType, PaymentMethodDto, ShippingMethodDto } from '@/interface/basket';
import { formatCurrency } from '@/lib/helper';
import { AnimatePresence, motion } from 'framer-motion';
import { Banknote, Loader2, StickyNote, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { CheckoutFormValues } from '../schemas/checkout.schema';

interface CheckoutPaymentSectionProps {
  fulfillmentType: FulfillmentType;
  paymentMethods: PaymentMethodDto[];
  shippingMethods: ShippingMethodDto[];
  selectedShippingMethodCode: string;
  optionsLoading: boolean;
  onShippingMethodChange: (code: string) => void;
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

export default function CheckoutPaymentSection({
  fulfillmentType,
  paymentMethods,
  shippingMethods,
  selectedShippingMethodCode,
  optionsLoading,
  onShippingMethodChange,
  register,
  errors,
}: CheckoutPaymentSectionProps) {
  const t = useTranslations('Checkout');

  return (
    <div className="rounded-lg border border-outline-variant/35 bg-surface-container-lowest p-5 sm:p-6 shadow-2xs">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Banknote className="h-4 w-4 text-primary" />
          <label className="text-sm font-bold text-on-surface">
            {t('paymentMethodTitle')}
          </label>
          {optionsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
        </div>

        <div className="space-y-2.5">
          {paymentMethods.map((method) => (
            <label
              key={method.code}
              className="flex items-center justify-between gap-3 rounded-xl border border-primary/50 bg-rose-pale/25 px-4 py-3.5 transition-colors cursor-pointer"
            >
              <input
                type="radio"
                value={method.code}
                checked
                readOnly
                className="sr-only"
              />
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm font-bold text-on-surface truncate">
                  {method.name}
                </span>
              </div>

              <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-primary border border-primary/20">
                {method.code}
              </span>
            </label>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {fulfillmentType === 'Delivery' && (
          <motion.div
            key="checkout-shipping-methods"
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{
              height: 'auto',
              opacity: 1,
              transitionEnd: { overflow: 'visible' },
            }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                <label className="text-sm font-bold text-on-surface">
                  {t('shippingMethodLabel')}
                </label>
                {optionsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
              </div>

              {shippingMethods.length > 0 ? (
                <div
                  role="radiogroup"
                  aria-label={t('shippingMethodLabel')}
                  className="space-y-2.5"
                >
                  {shippingMethods.map((method) => {
                    const isSelected = selectedShippingMethodCode === method.code;
                    return (
                      <label
                        key={method.code}
                        className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-all cursor-pointer ${isSelected
                          ? 'border-primary/50 bg-rose-pale/25'
                          : 'border-outline-variant/45 bg-surface hover:border-primary/35'
                          }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={method.code}
                          checked={isSelected}
                          onChange={() => onShippingMethodChange(method.code)}
                          className="sr-only"
                        />

                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isSelected
                              ? 'border-primary bg-white'
                              : 'border-outline-variant/80 bg-white'
                              }`}
                          >
                            {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                          </span>
                          <span className="text-sm font-bold text-on-surface truncate">
                            {method.name}
                          </span>
                        </div>

                        {method.fee > 0 ? (
                          <span className="shrink-0 text-sm font-bold text-primary">
                            {formatCurrency(method.fee)}
                          </span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-surface-container-low/80 border border-outline-variant/35 px-3 py-1 text-xs font-medium text-on-surface-variant">
                            {t('shippingFeePending')}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">
                  {t('defaultShippingNote')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 space-y-2 border-t border-outline-variant/25 pt-5">
        <label className="flex items-center gap-2 text-sm font-bold text-on-surface">
          <span>{t('orderNoteLabel')}</span>
        </label>
        <textarea
          {...register('note')}
          rows={3}
          placeholder={t('orderNotePlaceholder')}
          className="w-full rounded-xl border border-outline-variant/60 bg-surface px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none"
        />
        {errors.note && (
          <p className="text-xs font-medium text-error">{errors.note.message}</p>
        )}
      </div>
    </div>
  );
}
