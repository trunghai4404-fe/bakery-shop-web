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
    bookings: string
    settings: string
    logout: string
    login: string
    register: string
  }
  isLoggingOut: boolean
  onLogout: () => void
}

export default function UserMenu({ labels, isLoggingOut, onLogout }: UserMenuProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const isMobile = useIsMobile()
  const router = useRouter();

  const accountItems = MENU_ITEMS_CONFIG.map(item => ({
    label: labels[item.key as keyof typeof labels],
    href: item.href,
    icon: item.icon,
  }))

  const triggerButtonClasses = "flex items-center gap-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/40 hover:border-primary/40 transition-all active:scale-95 shrink-0"

  const renderAvatar = () => {
    return (
      <Avatar size="default" className="rounded-xl">
        <AvatarImage src={user?.avatar ?? ""} alt="User Avatar" className="rounded-xl" />
        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs rounded-xl">
          <User className='w-4 h-4' />
        </AvatarFallback>
      </Avatar>
    )
  }

  if (isMobile) {
    if (!user || isLoggingOut) {
      return (
        <Sheet open={isOpenMobile} onOpenChange={setIsOpenMobile}>
          <SheetTrigger className={triggerButtonClasses} aria-label="Tài khoản">
            {renderAvatar()}
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-xs p-5 flex flex-col h-full bg-surface border-l border-outline-variant/30">
            <SheetTitle className="sr-only">Tài khoản</SheetTitle>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/30">
                {renderAvatar()}
                <div>
                  <div className="text-sm font-bold text-on-surface">Tài khoản</div>
                  <div className="text-xs text-on-surface-variant/70">Đăng nhập để xem thông tin</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpenMobile(false)
                  dispatch(openLoginModal())
                }}
                className="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl font-bold text-sm bg-primary text-white shadow-xs active:scale-98 transition-all"
              >
                <LogIn className="h-4 w-4 stroke-2" />
                <span>{labels.login || 'Đăng nhập'}</span>
              </button>

              <button
                onClick={() => {
                  setIsOpenMobile(false)
                  dispatch(openRegisterModal())
                }}
                className="flex items-center gap-3 w-full py-2.5 px-3.5 rounded-xl font-bold text-sm border border-outline-variant bg-surface-container-low text-on-surface active:scale-98 transition-all"
              >
                <UserPlus className="h-4 w-4 stroke-2 text-primary" />
                <span>{labels.register || 'Đăng ký'}</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Sheet open={isOpenMobile} onOpenChange={setIsOpenMobile}>
        <SheetTrigger className={triggerButtonClasses}>
          {renderAvatar()}
        </SheetTrigger>
        <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col gap-0 h-full bg-white border-l border-zinc-200 transition-all duration-300">
          <SheetTitle className="sr-only">Menu người dùng</SheetTitle>
          <MobileMenuContent
            name={user.fullName}
            email={user.email}
            accountItems={accountItems}
            logoutLabel={labels.logout}
            onClose={() => setIsOpenMobile(false)}
            onLogout={() => onLogout()}
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
