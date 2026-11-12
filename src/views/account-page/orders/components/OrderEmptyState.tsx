'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default function OrderEmptyState() {
  const t = useTranslations('Account.orders');

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl bg-surface-container-low/60 border border-dashed border-outline-variant/60">
      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Package className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-base font-bold text-on-surface">
        {t('emptyTitle')}
      </h3>
      <p className="text-sm text-on-surface-variant max-w-md mt-1 mb-5">
        {t('emptyDesc')}
      </p>
      <Link href="/product-list">
        <Button
          type="button"
          className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer"
        >
          {t('exploreMenu')}
        </Button>
      </Link>
    </div>
  );
}

