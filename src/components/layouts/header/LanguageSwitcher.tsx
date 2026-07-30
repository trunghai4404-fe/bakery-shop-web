'use client'

import React from 'react'
import Cookies from 'js-cookie'
import { LOCALE_COOKIE } from '@/constants/cookies'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

interface LanguageSwitcherProps {
  currentLang: 'vi' | 'en'
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onChangeLanguage = (newLang: 'vi' | 'en') => {
    if (newLang === currentLang) return
    Cookies.set(LOCALE_COOKIE, newLang)
    const params = searchParams.toString()
    const targetPath = params ? `${pathname}?${params}` : pathname
    router.replace(targetPath, { locale: newLang })
  }

  return (
    <div className="relative flex p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200/50 dark:border-zinc-700/30">
      <button
        onClick={() => onChangeLanguage("vi")}
        className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full transition-all duration-200 cursor-pointer ${
          currentLang === "vi" ? "bg-primary text-white shadow-xs" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => onChangeLanguage("en")}
        className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full transition-all duration-200 cursor-pointer ${
          currentLang === "en" ? "bg-primary text-white shadow-xs" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
        }`}
      >
        EN
      </button>
    </div>
  )
}
