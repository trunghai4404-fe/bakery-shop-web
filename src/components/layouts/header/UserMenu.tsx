'use client'

import React, { useState } from 'react'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hook/useIsMobile'
import { MENU_ITEMS_CONFIG } from '@/constants/constants'

import DesktopMenuContent from './UserMenu/DesktopMenuContent'
import MobileMenuContent from './UserMenu/MobileMenuContent'

interface UserMenuProps {
  labels: {
    profile: string
    bookings: string
    settings: string
    logout: string
  }
}

export default function UserMenu({ labels }: UserMenuProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const isMobile = useIsMobile()

  const accountItems = MENU_ITEMS_CONFIG.map(item => ({
    label: labels[item.key],
    href: item.href,
    icon: item.icon,
  }))

  const triggerButtonClasses = "flex items-center gap-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-zinc-200 dark:border-zinc-800 transition-transform active:scale-95 shrink-0"

  const renderAvatar = () => (
    <Avatar size="default" className="rounded-lg">
      <AvatarImage src="" alt="User Avatar" className="rounded-lg" />
      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-lg">
        TH
      </AvatarFallback>
    </Avatar>
  )

  const handleLogout = () => {
    console.log('Logout')
  }

  if (isMobile) {
    return (
      <Sheet open={isOpenMobile} onOpenChange={setIsOpenMobile}>
        <SheetTrigger className={triggerButtonClasses}>
          {renderAvatar()}
        </SheetTrigger>
        <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col gap-0 h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          <SheetTitle className="sr-only">Menu người dùng</SheetTitle>
          <MobileMenuContent
            name="Trung Hải"
            email="trunghai4404@gmail.com"
            accountItems={accountItems}
            logoutLabel={labels.logout}
            onClose={() => setIsOpenMobile(false)}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerButtonClasses}>
        {renderAvatar()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1 border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        <DesktopMenuContent
          name="Trung Hải"
          email="trunghai4404@gmail.com"
          accountItems={accountItems}
          logoutLabel={labels.logout}
          onLogout={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
