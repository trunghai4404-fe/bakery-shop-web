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
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { User, LogIn, UserPlus } from 'lucide-react'
import { useIsMobile } from '@/hook/useIsMobile'
import { MENU_ITEMS_CONFIG } from '@/constants/constants'
import DesktopMenuContent from './UserMenu/DesktopMenuContent'
import MobileMenuContent from './UserMenu/MobileMenuContent'
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks'
import { openLoginModal, openRegisterModal } from '@/redux/store/slices/auth/authModal.reducer'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  labels: {
    profile: string
    logout: string
    login: string
    register: string
  }
  isLoggingOut: boolean
  onLogout: () => void
  onOpenMobileDrawer?: () => void
}

export default function UserMenu({ labels, isLoggingOut, onLogout, onOpenMobileDrawer }: UserMenuProps) {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isMobile = useIsMobile()

  const accountItems = MENU_ITEMS_CONFIG.map(item => ({
    label: labels[item.key as keyof typeof labels],
    href: item.href,
    icon: item.icon,
  }))

  const triggerButtonClasses = "flex items-center gap-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/40 hover:border-primary/40 transition-all active:scale-95 shrink-0"

  const renderAvatar = () => {
    return (
      <Avatar size="default" className="rounded-lg">
        <AvatarImage src={user?.avatar ?? ""} alt="User Avatar" className="rounded-lg" />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-lg">
          <User className='w-4 h-4' />
        </AvatarFallback>
      </Avatar>
    )
  }

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={onOpenMobileDrawer}
        className={triggerButtonClasses}
        aria-label="Tài khoản"
      >
        {renderAvatar()}
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={triggerButtonClasses}>
        {renderAvatar()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5 border border-outline-variant/40 bg-surface rounded-xl shadow-lg">
        {user && !isLoggingOut ? (
          <DesktopMenuContent
            name={user.fullName}
            email={user.email}
            accountItems={accountItems}
            logoutLabel={labels.logout}
            onLogout={() => onLogout()}
          />
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => dispatch(openLoginModal())}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-extrabold rounded-lg bg-primary text-white hover:bg-primary/90 cursor-pointer transition-colors shadow-xs"
            >
              <LogIn className="h-4 w-4 stroke-[2.2]" />
              <span>{labels.login || 'Đăng nhập'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => dispatch(openRegisterModal())}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 mt-1.5 text-sm font-bold rounded-lg border border-outline-variant/60 hover:bg-surface-container text-on-surface hover:text-primary cursor-pointer transition-colors"
            >
              <UserPlus className="h-4 w-4 stroke-[2.2] text-primary" />
              <span>{labels.register || 'Đăng ký'}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
