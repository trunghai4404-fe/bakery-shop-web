import React, { Suspense } from 'react';
import AccountPage from '@/views/account-page/AccountPage';

export default async function AccountRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  return (
    <Suspense fallback={null}>
      <AccountPage initialTab={tab} />
    </Suspense>
  );
}

