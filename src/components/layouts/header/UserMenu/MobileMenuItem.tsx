'use client'

import React from 'react'
import { Link } from '@/i18n/routing'
import { LucideIcon } from 'lucide-react'

interface MobileMenuItemProps {
  label: string
  href?: string
  icon: LucideIcon
  onClick?: () => void
  danger?: boolean
}

export default function MobileMenuItem({
  label,
  href,
  icon: Icon,
  onClick,
  danger = false,
}: MobileMenuItemProps) {
  const textClass = danger
    ? "text-destructive hover:bg-destructive/10"
    : "text-zinc-700 dark:text-zinc-300 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900"

  const content = (
    <>
      <Icon className={`h-4.5 w-4.5 stroke-[1.5] ${danger ? "text-destructive" : "text-zinc-400"}`} />
      <span>{label}</span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${textClass}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-colors text-left cursor-pointer ${textClass}`}
    >
      {content}
    </button>
  )
}
