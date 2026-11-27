'use client';

import { motion } from 'framer-motion';
import { ChevronRight, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ACCOUNT_NAV_ITEMS, AccountTab } from '../constants/account.constants';

interface AccountMobileTabsProps {
  activeTab: AccountTab;
  onSelectTab: (tab: AccountTab) => void;
}

export function AccountMobileTabs({
  activeTab,
  onSelectTab,
}: AccountMobileTabsProps) {
  const t = useTranslations('Account');

  return (
    <div className="lg:hidden flex gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {ACCOUNT_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer flex-1 justify-center ${isActive ? 'text-white font-bold' : 'text-on-surface-variant'
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
  );
}

interface AccountSidebarProps {
  activeTab: AccountTab;
  onSelectTab: (tab: AccountTab) => void;
  onLogout: () => void;
}

export function AccountSidebar({
  activeTab,
  onSelectTab,
  onLogout,
}: AccountSidebarProps) {
  const t = useTranslations('Account');

  return (
    <aside className="hidden lg:flex lg:col-span-3 lg:sticky lg:top-24 flex-col rounded-2xl border border-primary/15 bg-white p-3.5 shadow-[0_4px_24px_rgba(74,53,51,0.05)]">
      <div className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
        {t('title')}
      </div>
      <div className="my-2 border-t border-primary/10" />

      <nav className="flex flex-col gap-1.5">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`group relative flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer text-left ${isActive
                ? 'text-primary font-bold'
                : 'text-on-surface-variant font-semibold hover:bg-surface-container-low hover:text-on-surface'
                }`}
            >
              {isActive && (
                <>
                  <motion.div
                    layoutId="account-active-tab-rail"
                    className="absolute inset-0 rounded-xl bg-rose-pale/85"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                  <motion.div
                    layoutId="account-active-tab-bar"
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-primary z-10"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                </>
              )}

              <div className="relative z-10 flex items-center gap-3 min-w-0">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive
                    ? 'bg-white text-primary shadow-2xs'
                    : 'bg-surface-container text-on-surface-variant group-hover:bg-white group-hover:text-primary'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{t(item.translationKey)}</span>
              </div>

              <ChevronRight
                className={`relative z-10 h-4 w-4 shrink-0 transition-all ${isActive
                  ? 'text-primary opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0'
                  }`}
              />
            </button>
          );
        })}
      </nav>

      <div className="my-2 border-t border-primary/10" />

      <button
        type="button"
        onClick={onLogout}
        className="group flex items-center gap-3 w-full rounded-lg text-sm font-bold text-destructive hover:bg-destructive/8 transition-colors cursor-pointer text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-white transition-colors">
          <LogOut className="h-4 w-4" />
        </span>
        <span>{t('logout')}</span>
      </button>
    </aside>
  );
}
