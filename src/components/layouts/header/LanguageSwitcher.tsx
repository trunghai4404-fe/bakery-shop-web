'use client'

import React from 'react'
import Cookies from 'js-cookie'
import { LOCALE_COOKIE } from '@/constants/cookies'
import { useRouter, usePathname } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import { motion } from "framer-motion";

interface LanguageSwitcherProps {
  currentLang: 'vi' | 'en'
}

export default function LanguageSwitcher({
  currentLang,
}: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onChangeLanguage = (newLang: 'vi' | 'en') => {
    if (newLang === currentLang) return

    Cookies.set(LOCALE_COOKIE, newLang, { expires: 365, path: '/' })

    const params = searchParams.toString()
    const targetPath = params ? `${pathname}?${params}` : pathname

    router.replace(targetPath, { locale: newLang })
  }

  return (
    <div className="relative flex rounded-full border border-zinc-200/50 bg-zinc-100 p-0.5">
      {currentLang === "vi" && (
        <motion.div
          layoutId="language-switcher"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
          className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-primary shadow-xs"
        />
      )}

      {currentLang === "en" && (
        <motion.div
          layoutId="language-switcher"
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
          className="absolute inset-y-0.5 right-0.5 w-[calc(50%-2px)] rounded-full bg-primary shadow-xs"
        />
      )}

      <button
        onClick={() => onChangeLanguage("vi")}
        className={`relative z-10 flex-1 cursor-pointer rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors duration-200 ${currentLang === "vi"
          ? "text-white"
          : "text-zinc-500 hover:text-zinc-800"
          }`}
      >
        VI
      </button>

      <button
        onClick={() => onChangeLanguage("en")}
        className={`relative z-10 flex-1 cursor-pointer rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors duration-200 ${currentLang === "en"
          ? "text-white"
          : "text-zinc-500 hover:text-zinc-800"
          }`}
      >
        EN
      </button>
    </div>
  );
}