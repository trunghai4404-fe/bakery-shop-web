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
import { User } from 'lucide-react'
import { useIsMobile } from '@/hook/useIsMobile'
import { MENU_ITEMS_CONFIG } from '@/constants/constants'
import { useMe } from '@/features/auths/hooks/useMe'
import { useLogout } from '@/features/auths/hooks/useLogout'
import { useAuthModal } from '@/components/auths/AuthModalProvider'

import DesktopMenuContent from './UserMenu/DesktopMenuContent'
import MobileMenuContent from './UserMenu/MobileMenuContent'

interface UserMenuProps {
  labels: {
    profile: string
    bookings: string
    settings: string
    logout: string
    login: string
    register: string
  }
}

export default function UserMenu({ labels }: UserMenuProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false)

  const isMobile = useIsMobile()
  const { data: profileResponse } = useMe()
  const logoutMutation = useLogout()
  const { openLogin } = useAuthModal()

  const profile = profileResponse?.data
  const isLoggedIn = !!profile
  const name = profile?.fullName || ""
  const email = profile?.email || ""

  const accountItems = MENU_ITEMS_CONFIG.map(item => ({
    label: labels[item.key as keyof typeof labels],
    href: item.href,
    icon: item.icon,
  }))

  const triggerButtonClasses = "flex items-center gap-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-zinc-200 dark:border-zinc-800 transition-transform active:scale-95 shrink-0"

  const renderAvatar = () => {
    const initials = name
      ? name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
      : <User className="h-4 w-4" />;

    return (
      <Avatar size="default" className="rounded-lg">
        <AvatarImage src="" alt="User Avatar" className="rounded-lg" />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
    )
  }

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  if (isMobile) {
    if (!isLoggedIn) {
      return (
        <button
          onClick={openLogin}
          className={triggerButtonClasses}
          aria-label="Đăng nhập"
        >
          {renderAvatar()}
        </button>
      )
    }

    return (
      <Sheet open={isOpenMobile} onOpenChange={setIsOpenMobile}>
        <SheetTrigger className={triggerButtonClasses}>
          {renderAvatar()}
        </SheetTrigger>
        <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col gap-0 h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 transition-all duration-300">
          <SheetTitle className="sr-only">Menu người dùng</SheetTitle>
          <MobileMenuContent
            name={name}
            email={email}
            accountItems={accountItems}
            logoutLabel={labels.logout}
            onClose={() => setIsOpenMobile(false)}
            onLogout={handleLogout}
          />
        </SheetContent>
      </Sheet>
    )
  }

  if (!isLoggedIn) {
    return (
      <button
        onClick={openLogin}
        className="inline-flex cursor-pointer items-center justify-center h-8 px-4 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary/95 transition-all shadow-sm active:translate-y-px"
      >
        {labels.login}
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerButtonClasses}>
        {renderAvatar()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1 border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        <DesktopMenuContent
          name={name}
          email={email}
          accountItems={accountItems}
          logoutLabel={labels.logout}
          onLogout={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
