'use client';

import { FulfillmentType } from '@/interface/basket';
import { LayoutGroup, motion } from 'framer-motion';
import { Store, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface CheckoutFulfillmentTabsProps {
  value: FulfillmentType;
  onChange: (value: FulfillmentType) => void;
}

export default function CheckoutFulfillmentTabs({
  value,
  onChange,
}: CheckoutFulfillmentTabsProps) {
  const t = useTranslations('Checkout');

  const tabs: { value: FulfillmentType; label: string; icon: typeof Truck }[] = [
    { value: 'Delivery', label: t('deliveryOption'), icon: Truck },
    { value: 'Pickup', label: t('pickupOption'), icon: Store },
  ];

  return (
    <LayoutGroup id="checkout-fulfillment-tabs">
      <div
        role="tablist"
        aria-label={t('fulfillmentTitle')}
        className="grid grid-cols-2 gap-1.5 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-1.5 shadow-sm"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = value === tab.value;

          return (
            <motion.button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(tab.value)}
              className={`relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors cursor-pointer ${
                isActive ? 'text-white' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="checkout-fulfillment-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-primary shadow-md shadow-primary/25"
                />
              )}
              <Icon
                className={`relative z-10 h-4 w-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-on-surface-variant'
                }`}
              />
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
