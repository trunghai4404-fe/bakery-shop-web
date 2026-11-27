'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AccountLoadingSkeleton() {
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

interface AccountLoginPromptProps {
  onLogin: () => void;
}

export function AccountLoginPrompt({ onLogin }: AccountLoginPromptProps) {
  const t = useTranslations('Account');

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
          onClick={onLogin}
          className="h-10 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold cursor-pointer"
        >
          <LogIn className="h-4 w-4" />
          <span>{t('loginAction')}</span>
        </Button>
      </div>
    </div>
  );
}
