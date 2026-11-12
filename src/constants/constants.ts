import {
  MapPin,
  Package,
  User as UserIcon,
} from 'lucide-react'
import { ROUTES } from './routes-path'

export const MENU_ITEMS_CONFIG = [
  {
    key: 'profile' as const,
    href: ROUTES.ACCOUNT_PROFILE,
    icon: UserIcon,
  },
  {
    key: 'addressBook' as const,
    href: ROUTES.ACCOUNT_ADDRESSES,
    icon: MapPin,
  },
  {
    key: 'orders' as const,
    href: ROUTES.ACCOUNT_ORDERS,
    icon: Package,
  },
]
