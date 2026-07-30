import {
  User as UserIcon,
  Calendar,
  Settings
} from 'lucide-react'

export const MENU_ITEMS_CONFIG = [
  {
    key: 'profile' as const,
    href: '/profile',
    icon: UserIcon,
  },
  {
    key: 'bookings' as const,
    href: '/bookings',
    icon: Calendar,
  },
  {
    key: 'settings' as const,
    href: '/settings',
    icon: Settings,
  },
]
