'use client'

import React from 'react'
import { LucideIcon, LogOut, Globe } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useLocale } from 'next-intl'
import LanguageSwitcher from '../LanguageSwitcher'
import MobileMenuItem from './MobileMenuItem'

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

interface MobileMenuContentProps {
  name: string
  email: string
  accountItems: MenuItem[]
  logoutLabel: string
  onClose: () => void
  onLogout: () => void
}

export default function MobileMenuContent({
  name,
  email,
  accountItems,
  logoutLabel,
  onClose,
  onLogout,
}: MobileMenuContentProps) {
  const lang = useLocale() as 'vi' | 'en'

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="relative border-b border-zinc-200 px-5 pb-5 pt-6 bg-zinc-50/50">
        <div className="flex items-center gap-3 pr-10">
          <Avatar size="lg" className="border border-zinc-200 rounded-lg">
            <AvatarImage src="" alt="User Avatar" className="rounded-lg" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm rounded-lg">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-base font-bold text-zinc-900 truncate">
              {name}
            </div>
            <div className="text-xs text-zinc-400 truncate mt-0.5">
              {email}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-5">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-2 px-1">
            Tài khoản
          </h3>
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
          </div>
        </div>

        <div className="px-5 mt-4">
          <div className="border-t border-zinc-150 pt-4">
            <MobileMenuItem
              label={logoutLabel}
              icon={LogOut}
              danger
              onClick={() => {
                onLogout()
                onClose()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
