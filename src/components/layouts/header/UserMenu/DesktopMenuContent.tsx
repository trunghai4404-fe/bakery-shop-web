'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { LogOut, LucideIcon } from 'lucide-react'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
}

interface DesktopMenuContentProps {
  name: string
  email: string
  accountItems: MenuItem[]
  logoutLabel: string
  onLogout: () => void
}

export default function DesktopMenuContent({
  name,
  email,
  accountItems,
  logoutLabel,
  onLogout,
}: DesktopMenuContentProps) {
  return (
    <>
      <div className="px-3 py-2 text-on-surface">
        <div className="text-base font-bold truncate">{name}</div>
        <div className="text-xs text-on-surface-variant/80 font-medium truncate mt-0.5">{email}</div>
      </div>
      <DropdownMenuSeparator className="bg-outline-variant/30" />
      
      {accountItems.map((item) => (
        <DropdownMenuItem
          key={item.label}
          render={<Link href={item.href} />}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-primary/10 hover:text-primary text-on-surface cursor-pointer transition-colors"
        >
          <item.icon className="h-4 w-4 stroke-[1.8] text-primary" />
          {item.label}
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator className="bg-outline-variant/30" />
      <DropdownMenuItem
        onClick={onLogout}
        variant="destructive"
        className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-bold rounded-lg cursor-pointer"
      >
        <LogOut className="h-4 w-4 stroke-[1.8]" />
        {logoutLabel}
      </DropdownMenuItem>
    </>
  )
}
