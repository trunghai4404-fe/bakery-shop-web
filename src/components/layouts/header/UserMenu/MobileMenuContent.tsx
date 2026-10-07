'use client'

import React from 'react'
import { LucideIcon, LogOut, Globe, LogIn, UserPlus, User, X } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SheetClose } from '@/components/ui/sheet'
import LanguageSwitcher from '../LanguageSwitcher'
import MobileMenuItem from './MobileMenuItem'
import Image from 'next/image'
import { appImages } from '@/constants/appInfo'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact: boolean
}

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

interface UserInfo {
  fullName: string
  email: string
  avatar?: string | null
}

interface MobileMenuContentProps {
  user: UserInfo | null
  isLoggingOut: boolean
  accountItems: MenuItem[]
  navItems: NavItem[]
  logoutLabel: string
  loginLabel: string
  registerLabel: string
  lang: 'vi' | 'en'
  isLinkActive: (href: string, exact?: boolean) => boolean
  onClose: () => void
  onLogout: () => void
  onLogin: () => void
  onRegister: () => void
}

export default function MobileMenuContent({
  user,
  isLoggingOut,
  accountItems,
  navItems,
  logoutLabel,
  loginLabel,
  registerLabel,
  lang,
  isLinkActive,
  onClose,
  onLogout,
  onLogin,
  onRegister,
}: MobileMenuContentProps) {
  return (
    <div className="flex h-full flex-col bg-surface text-on-surface">
      <div className="flex h-16 items-center justify-between px-5 border-b border-outline-variant/30 shrink-0">
        {user ? (
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar size="lg" className="border-2 border-primary/20 rounded-lg shrink-0">
              <AvatarImage src={user?.avatar ?? ''} alt={user?.fullName} className="rounded-lg object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm rounded-md">
                {user?.fullName && user.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-base font-bold text-on-surface truncate">
                {user?.fullName}
              </div>
              <div className="text-xs text-on-surface-variant truncate mt-0.5 font-medium">
                {user?.email}
              </div>
            </div>
          </div>
        ) : (
          <Image src={appImages.BakeryLogo} alt="Logo" width={40} height={40} />
        )}

        <SheetClose
          render={
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center text-on-surface hover:bg-primary/10 hover:text-primary transition-all active:scale-95 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant/70">
            {lang === 'vi' ? 'Danh mục' : 'Menu'}
          </div>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <MobileMenuItem
                key={item.href}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={isLinkActive(item.href, item.exact)}
                onClick={onClose}
              />
            ))}
          </div>
        </div>

        {user && !isLoggingOut && (
          <div className="space-y-1">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant/70">
              {lang === 'vi' ? 'Tài khoản' : 'My Account'}
            </div>
            <div className="flex flex-col gap-1">
              {accountItems.map((item) => (
                <MobileMenuItem
                  key={item.label}
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  onClick={onClose}
                />
              ))}
              <MobileMenuItem
                label={logoutLabel}
                icon={LogOut}
                danger
                onClick={() => {
                  onClose()
                  onLogout()
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-variant/70">
            {lang === 'vi' ? 'Tùy chọn' : 'Options'}
          </div>
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-low">
            <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface-variant">
              <Globe className="h-4 w-4 stroke-[1.8] text-primary" />
              <span>{lang === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
            </div>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>

      {!user && (
        <div className="flex gap-4 p-4">
          <button
            onClick={() => onLogin()}
            className="flex items-center justify-center gap-3 w-full py-2 px-4 rounded-xl font-bold text-base bg-primary text-white shadow-xs active:scale-98 transition-all"
          >
            <span>{loginLabel}</span>
          </button>
          <button
            onClick={() => onRegister()}
            className="flex items-center justify-center gap-3 w-full py-2 px-4 rounded-xl font-bold text-base border border-outline-variant bg-surface-container-low text-on-surface active:scale-98 transition-all"
          >
            <span>{registerLabel}</span>
          </button>
        </div>
      )}

      <div className="px-5 py-4 border-t border-outline-variant/20 text-center text-xs text-on-surface-variant/60 font-medium shrink-0">
        Bakery Shop © 2026. All rights reserved.
      </div>
    </div>
  )
}

