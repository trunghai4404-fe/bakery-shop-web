'use client';

import React, { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Package,
  Sparkles,
  UserCheck,
} from 'lucide-react';

import { User } from '@/interface/auth';
import { SavedAddress } from '@/interface/address';
import { Link } from '@/i18n/routing';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AccountTab } from '../constants/account.constants';

interface AccountHeroBannerProps {
  user: User;
  addresses: SavedAddress[];
  activeTab: AccountTab;
  onSelectTab: (tab: AccountTab) => void;
}

export default function AccountHeroBanner({
  user,
  addresses,
  activeTab,
  onSelectTab,
}: AccountHeroBannerProps) {
  const t = useTranslations('Account');

  const completionPercent = useMemo(() => {
    const checks = [
      Boolean(user.fullName?.trim()),
      Boolean(user.email?.trim()),
      Boolean(user.phoneNumber?.trim()),
      Boolean(user.sex && user.sex !== 'Other'),
    ];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  }, [user.fullName, user.email, user.phoneNumber, user.sex]);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    [addresses]
  );

  const defaultAddressLine = defaultAddress
    ? [
      defaultAddress.address,
      defaultAddress.wardName,
      defaultAddress.districtName,
      defaultAddress.provinceName,
    ]
      .filter(Boolean)
      .join(', ')
    : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className={`group text-left rounded-2xl p-4 border transition-all cursor-pointer shadow-[0_2px_12px_rgba(74,53,51,0.03)] hover:-translate-y-0.5 ${activeTab === 'profile'
            ? 'bg-white border-primary/40 shadow-[0_6px_20px_rgba(168,59,85,0.08)]'
            : 'bg-white/95 border-primary/12 hover:border-primary/30 hover:bg-white'
            }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-pale text-primary">
                <UserCheck className="h-3.5 w-3.5" />
              </span>
              {t('overview.profileCompletion')}
            </span>
            <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {completionPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <p className="text-xs text-on-surface-variant truncate">
            {user.phoneNumber?.trim()
              ? t('overview.profileReady')
              : t('overview.profileMissingPhone')}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('addresses')}
          className={`group text-left rounded-2xl p-4 border transition-all cursor-pointer shadow-[0_2px_12px_rgba(74,53,51,0.03)] hover:-translate-y-0.5 ${activeTab === 'addresses'
            ? 'bg-white border-primary/40 shadow-[0_6px_20px_rgba(168,59,85,0.08)]'
            : 'bg-white/95 border-primary/12 hover:border-primary/30 hover:bg-white'
            }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-champagne/45 text-muted-gold">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              {t('overview.defaultAddress')}
            </span>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              {addresses.length} {t('overview.savedCount')}
            </span>
          </div>
          <p className="text-sm font-semibold text-on-surface line-clamp-1">
            {defaultAddress ? defaultAddress.recipientName : t('overview.noDefaultAddress')}
          </p>
          <p className="text-xs text-on-surface-variant truncate mt-0.5">
            {defaultAddressLine ?? t('addresses.emptyDesc')}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('orders')}
          className={`group text-left rounded-2xl p-4 border transition-all cursor-pointer shadow-[0_2px_12px_rgba(74,53,51,0.03)] hover:-translate-y-0.5 ${activeTab === 'orders'
            ? 'bg-white border-primary/40 shadow-[0_6px_20px_rgba(168,59,85,0.08)]'
            : 'bg-white/95 border-primary/12 hover:border-primary/30 hover:bg-white'
            }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sage-light text-sage">
                <Package className="h-3.5 w-3.5" />
              </span>
              {t('overview.ordersTitle')}
            </span>
            <CheckCircle2 className="h-4 w-4 text-sage opacity-80" />
          </div>
          <p className="text-sm font-semibold text-on-surface truncate">
            {t('tabs.orders')}
          </p>
          <p className="text-xs text-on-surface-variant truncate mt-0.5">
            {t('overview.ordersReady')}
          </p>
        </button>
      </div>
    </div>
  );
}

