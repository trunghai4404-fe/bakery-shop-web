'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams, useRouter as useNextRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, LogIn, LogOut, User as UserIcon } from 'lucide-react';

import { usePathname, useRouter } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { openLoginModal } from '@/redux/store/slices/auth/authModal.reducer';
import { logOutUser } from '@/redux/store/slices/auth/auth.action';
import { User } from '@/interface/auth';
import { SavedAddress } from '@/interface/address';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ACCOUNT_NAV_ITEMS,
  AccountTab,
  normalizeAccountTab,
} from './constants/account.constants';
import AccountHeroBanner from './components/AccountHeroBanner';
import ProfileView from './profile/ProfileView';
import AddressesView from './addresses/AddressesView';
import { addressService } from './addresses/services/address.service';
import OrdersView from './orders/OrdersView';

interface AccountPageProps {
  initialTab?: string;
}

export default function AccountPage({ initialTab }: AccountPageProps) {
  const t = useTranslations('Account');
  const searchParams = useSearchParams();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.auth);

  const activeTab = useMemo(() => {
    const paramTab = searchParams.get('tab');
    return normalizeAccountTab(paramTab ?? initialTab);
  }, [searchParams, initialTab]);

  const handleSelectTab = (tab: AccountTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLogout = async () => {
    await dispatch(logOutUser());
    nextRouter.replace('/');
    nextRouter.refresh();
  };

  if (loading && !user) {
    return (
      <div className="py-8 md:py-10 space-y-5">
        <Skeleton className="h-36 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-3 h-64 rounded-2xl" />
          <Skeleton className="lg:col-span-9 h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 md:py-16">
        <div className="max-w-md mx-auto rounded-3xl border border-outline-variant/35 bg-surface-container-lowest p-8 text-center shadow-xs">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-rose-pale text-primary flex items-center justify-center mb-4">
            <UserIcon className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-xl font-bold text-on-surface">
            {t('loginRequiredTitle')}
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 mb-6">
            {t('loginRequiredDesc')}
          </p>
          <Button
            type="button"
            onClick={() => dispatch(openLoginModal())}
            className="h-10 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>{t('loginAction')}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthenticatedAccountContent
      key={user.id}
      user={user}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      onLogout={handleLogout}
    />
  );
}

interface AuthenticatedAccountContentProps {
  user: User;
  activeTab: AccountTab;
  onSelectTab: (tab: AccountTab) => void;
  onLogout: () => void;
}

function AuthenticatedAccountContent({
  user,
  activeTab,
  onSelectTab,
  onLogout,
}: AuthenticatedAccountContentProps) {
  const t = useTranslations('Account');
  const [addresses, setAddresses] = useState<SavedAddress[]>(() =>
    addressService.getAll(user.id)
  );

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-6">
      <AccountHeroBanner
        user={user}
        addresses={addresses}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
      />

      {/* Mobile Floating Pill Tab Bar */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex-1 justify-center ${
                isActive ? 'text-white font-bold' : 'text-on-surface-variant'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="account-active-tab-mobile"
                  className="absolute inset-0 rounded-xl bg-primary shadow-2xs"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4 shrink-0" />
              <span className="relative z-10">{t(item.translationKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Editorial Split Content + Sticky Left Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="hidden lg:flex lg:col-span-3 lg:sticky lg:top-24 flex-col rounded-2xl border border-primary/15 bg-white p-3.5 shadow-[0_4px_24px_rgba(74,53,51,0.05)]">
          <div className="px-2.5 pt-1 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/65">
            {t('title')}
          </div>

          <nav className="flex flex-col gap-1.5">
            {ACCOUNT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`group relative flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer text-left ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant font-semibold hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="account-active-tab-rail"
                      className="absolute inset-0 rounded-xl bg-rose-pale/85"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="account-active-tab-bar"
                      className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-primary z-10"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white text-primary shadow-2xs'
                          : 'bg-surface-container text-on-surface-variant group-hover:bg-white group-hover:text-primary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="truncate">{t(item.translationKey)}</span>
                  </div>

                  <ChevronRight
                    className={`relative z-10 h-4 w-4 shrink-0 transition-all ${
                      isActive
                        ? 'text-primary opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="my-3 border-t border-primary/10" />

          <button
            type="button"
            onClick={onLogout}
            className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/8 transition-colors cursor-pointer text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
              <LogOut className="h-4 w-4" />
            </span>
            <span>{t('logout')}</span>
          </button>
        </aside>

        <section className="lg:col-span-9 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {activeTab === 'profile' && <ProfileView user={user} />}
              {activeTab === 'addresses' && (
                <AddressesView
                  user={user}
                  addresses={addresses}
                  onAddressesChange={setAddresses}
                />
              )}
              {activeTab === 'orders' && <OrdersView />}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
