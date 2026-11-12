'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ORDER_STATUS_TABS, OrderStatusTab } from '../constants/order.constants';

interface OrderStatusTabsProps {
  activeStatus: OrderStatusTab;
  onChange: (status: OrderStatusTab) => void;
}

export default function OrderStatusTabs({
  activeStatus,
  onChange,
}: OrderStatusTabsProps) {
  const t = useTranslations('Account.orders');

  return (
    <div className="flex gap-1.5 overflow-x-auto p-1 rounded-2xl bg-surface-container-low border border-outline-variant/30">
      {ORDER_STATUS_TABS.map((status) => {
        const isActive = activeStatus === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? 'text-white font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="order-status-pill"
                className="absolute inset-0 rounded-xl bg-primary shadow-2xs"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t(`status.${status}`)}</span>
          </button>
        );
      })}
    </div>
  );
}
