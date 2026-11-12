'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { OrderStatusTab } from './constants/order.constants';
import OrderStatusTabs from './components/OrderStatusTabs';
import OrderEmptyState from './components/OrderEmptyState';

export default function OrdersView() {
  const t = useTranslations('Account.orders');
  const [activeStatus, setActiveStatus] = useState<OrderStatusTab>('all');
  const [keyword, setKeyword] = useState('');

  return (
    <div className="rounded-3xl border border-primary/15 bg-white p-5 sm:p-7 shadow-[0_4px_24px_rgba(74,53,51,0.05)]">
      <div className="border-b border-outline-variant/30 pb-5 mb-5">
        <h2 className="font-heading text-xl font-bold text-on-surface">
          {t('title')}
        </h2>
        <p className="text-sm text-on-surface-variant mt-1">
          {t('description')}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <OrderStatusTabs
          activeStatus={activeStatus}
          onChange={setActiveStatus}
        />

        <div className="relative max-w-md">
          <Search className="h-4 w-4 text-on-surface-variant/70 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="h-10 pl-9 bg-surface-container-low/50 border-outline-variant/60 focus-visible:border-primary"
          />
        </div>
      </div>

      <OrderEmptyState />
    </div>
  );
}

