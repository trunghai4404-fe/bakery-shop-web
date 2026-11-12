import { MapPin, Package, User as UserIcon } from 'lucide-react';
import type { ComponentType } from 'react';

export type AccountTab = 'profile' | 'addresses' | 'orders';

export const VALID_ACCOUNT_TABS: readonly AccountTab[] = [
  'profile',
  'addresses',
  'orders',
];

export function normalizeAccountTab(raw?: string | null): AccountTab {
  if (raw && VALID_ACCOUNT_TABS.includes(raw as AccountTab)) {
    return raw as AccountTab;
  }
  return 'profile';
}

export interface AccountNavItem {
  id: AccountTab;
  translationKey: `tabs.${AccountTab}`;
  icon: ComponentType<{ className?: string }>;
}

export const ACCOUNT_NAV_ITEMS: readonly AccountNavItem[] = [
  { id: 'profile', translationKey: 'tabs.profile', icon: UserIcon },
  { id: 'addresses', translationKey: 'tabs.addresses', icon: MapPin },
  { id: 'orders', translationKey: 'tabs.orders', icon: Package },
];

