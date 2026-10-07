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
  active?: boolean
}

export default function MobileMenuItem({
  label,
  href,
  icon: Icon,
  onClick,
  danger = false,
  active = false,
}: MobileMenuItemProps) {
  const textClass = danger
    ? "text-destructive hover:bg-destructive/10"
    : active
      ? "text-primary font-bold bg-primary/10 border-l-4 border-primary rounded-r-xl rounded-l-none"
      : "text-on-surface hover:text-primary hover:bg-surface-container"

  const content = (
    <>
      <Icon className={`h-4.5 w-4.5 stroke-[1.8] ${danger ? "text-destructive" : active ? "text-primary" : "text-on-surface-variant/70"}`} />
      <span className="flex-1">{label}</span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${textClass}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-bold rounded-xl transition-all text-left cursor-pointer ${textClass}`}
    >
      {content}
    </button>
  )
}

