'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { SavedAddress } from '@/interface/address';
import { User } from '@/interface/auth';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { logOutUser } from '@/redux/store/slices/auth/auth.action';
import { openLoginModal } from '@/redux/store/slices/auth/authModal.reducer';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter as useNextRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import AddressesView from './addresses/AddressesView';
import { AccountMobileTabs, AccountSidebar } from './components/AccountNavigation';
import {
  AccountLoadingSkeleton,
  AccountLoginPrompt,
} from './components/AccountStateViews';
import { addressService } from './addresses/services/address.service';
import { AccountTab, normalizeAccountTab } from './constants/account.constants';
import OrdersView from './orders/OrdersView';
import ProfileView from './profile/ProfileView';

interface AccountPageProps {
  initialTab?: string;
}

export default function AccountPage({ initialTab }: AccountPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { user, loading } = useAppSelector((state) => state.auth);

  const activeTab = useMemo(
    () => normalizeAccountTab(searchParams.get('tab') ?? initialTab),
    [searchParams, initialTab]
  );

  const handleSelectTab = (tab: AccountTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    params.delete('orderCode');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLogout = async () => {
    await dispatch(logOutUser());
    nextRouter.replace('/');
    nextRouter.refresh();
  };

  if (loading && !user) {
    return <AccountLoadingSkeleton />;
  }

  if (!user) {
    return <AccountLoginPrompt onLogin={() => dispatch(openLoginModal())} />;
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
  const [addresses, setAddresses] = useState<SavedAddress[]>(() =>
    addressService.getAll(user.id)
  );

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-4">
      <AccountMobileTabs activeTab={activeTab} onSelectTab={onSelectTab} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <AccountSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onLogout={onLogout}
        />

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
