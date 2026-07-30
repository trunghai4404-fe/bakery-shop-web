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
      <div className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
        <div className="text-sm font-bold truncate">{name}</div>
        <div className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{email}</div>
      </div>
      <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
      
      {accountItems.map((item) => (
        <DropdownMenuItem
          key={item.label}
          render={<Link href={item.href} />}
          className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          <item.icon className="h-4 w-4 stroke-[1.5] text-zinc-450" />
          {item.label}
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
      <DropdownMenuItem
        onClick={onLogout}
        variant="destructive"
        className="flex items-center gap-2 px-2.5 py-2 text-xs font-bold rounded-lg cursor-pointer"
      >
        <LogOut className="h-4 w-4 stroke-[1.5]" />
        {logoutLabel}
      </DropdownMenuItem>
    </>
  )
}
