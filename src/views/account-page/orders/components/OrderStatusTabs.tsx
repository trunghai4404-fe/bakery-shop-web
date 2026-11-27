'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { OrderSummaryDto } from '@/interface/order';
import { ORDER_STATUS_TABS, OrderStatusTab } from '../constants/order.constants';

interface OrderStatusTabsProps {
  activeStatus: OrderStatusTab;
  summary?: OrderSummaryDto | null;
  onChange: (status: OrderStatusTab) => void;
}

export default function OrderStatusTabs({
  activeStatus,
  summary,
  onChange,
}: OrderStatusTabsProps) {
  const t = useTranslations('Account.orders');

  return (
    <div className="flex items-center gap-1 overflow-x-auto lg:overflow-x-visible p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {ORDER_STATUS_TABS.map((status) => {
        const isActive = activeStatus === status;
        const count = summary ? summary[status] : undefined;

        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`relative inline-flex shrink-0 lg:shrink lg:flex-1 items-center justify-center gap-1.5 px-2.5 lg:px-2 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${isActive
              ? 'text-white font-bold'
              : 'text-on-surface-variant hover:text-primary'
              }`}
          >
            {isActive && (
              <motion.span
                layoutId="order-status-pill"
                className="absolute inset-0 rounded-lg bg-primary shadow-2xs"
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t(`status.${status}`)}</span>
            {typeof count === 'number' && (count > 0 || status === 'all') && (
              <span
                className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold ${isActive
                  ? 'bg-white/20 text-white'
                  : 'bg-outline-variant/25 text-on-surface-variant'
                  }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
