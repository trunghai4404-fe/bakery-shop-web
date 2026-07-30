'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link, usePathname } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, X, CircleStar, Globe } from 'lucide-react'
import { appImages } from '@/constants/appInfo'
import LanguageSwitcher from './header/LanguageSwitcher'
import ThemeToggle from './header/ThemeToggle'
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet"

const NAV_ITEMS = [
    { href: '/about', key: 'introduce' },
    { href: '/contact', key: 'contact' },
    { href: '/news', key: 'news' },
] as const;

const AboutHeader = () => {
    const locale = useLocale();
    const t = useTranslations('Header')
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const lang = locale as "vi" | "en";

    const navLinks = NAV_ITEMS.map((item) => ({
        href: item.href,
        label: t(item.key as any)
    }));

    const isActive = (href: string) => {
        return pathname.startsWith(href)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/80 backdrop-blur-md transition-all duration-300 dark:border-zinc-800/60 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

                <div className="flex items-center gap-6">
                    <Link href="/about" className="flex items-center gap-2 group transition-transform duration-200 active:scale-98">
                        <div className="relative w-18 h-8 overflow-hidden sm:w-32 sm:h-10">
                            <Image
                                src={appImages.LogoMain}
                                alt="SportHub Logo"
                                fill
                                sizes="(max-width: 640px) 112px, 128px"
                                priority
                                className="object-contain"
                            />
                        </div>
                    </Link>

                </div>
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => {
                        const active = isActive(link.href)
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`group relative text-sm font-bold tracking-wide transition-all duration-300 py-2 cursor-pointer ${active
                                    ? 'text-primary'
                                    : 'text-zinc-600 hover:text-primary dark:text-zinc-400 dark:hover:text-primary'
                                    }`}
                            >
                                <span>{link.label}</span>
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${active
                                    ? 'w-full'
                                    : 'w-0 group-hover:w-full'
                                    }`} />
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />

                        <Link
                            href="/"
                            className="relative group overflow-hidden rounded-xl bg-linear-to-r from-primary to-primary-container px-5 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:shadow-[0_8px_25px_rgba(157,67,0,0.3)] active:scale-95 transform hover:-translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                        >
                            <span className="relative z-10 flex items-center gap-1.5">
                                {t('goToApp')}
                                <CircleStar className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            </span>
                            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 md:hidden">
                        <ThemeToggle />

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none dark:text-zinc-400 transition-all duration-200 cursor-pointer border border-zinc-200/50 dark:border-zinc-800/80"
                                aria-label="Toggle menu"
                            >
                                <Menu className="h-4.5 w-4.5" />
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[80vw] max-w-xs p-0 flex flex-col h-full bg-white dark:bg-zinc-950 border-l border-[#E5E5E5] dark:border-zinc-800/60 transition-all duration-300">
                                <SheetTitle className="sr-only">Menu</SheetTitle>
                                <div className="flex flex-col gap-6 px-4 py-4 h-full justify-between">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center pb-4 border-b border-[#E5E5E5] dark:border-zinc-800/60">
                                            <div className="relative w-28 h-9 overflow-hidden">
                                                <Image
                                                    src={appImages.LogoMain}
                                                    alt="SportHub Logo"
                                                    fill
                                                    sizes="112px"
                                                    priority
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>

                                        <nav className="flex flex-col gap-2">
                                            {navLinks.map((link) => {
                                                const active = isActive(link.href)
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={`text-sm font-bold transition-all duration-200 py-2.5 px-3 rounded-xl flex items-center ${active
                                                            ? 'text-primary bg-primary/5 dark:bg-primary/10 border-l-2 border-primary rounded-l-none'
                                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900'
                                                            }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                )
                                            })}
                                        </nav>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="pt-4 border-t border-[#E5E5E5] dark:border-zinc-800/60">
                                            <div className="flex items-center justify-between px-3 py-2 border border-[#E5E5E5] dark:border-zinc-800/60 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/20">
                                                <div className="flex items-center gap-3">
                                                    <Globe className="h-4.5 w-4.5 stroke-[1.5] text-zinc-400" />
                                                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                        {lang === 'vi' ? 'Ngôn ngữ' : 'Language'}
                                                    </span>
                                                </div>
                                                <LanguageSwitcher currentLang={lang} />
                                            </div>
                                        </div>

                                        <div>
                                            <Link
                                                href="/"
                                                onClick={() => setIsOpen(false)}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container py-2.5 text-xs font-bold text-white transition-all duration-200 shadow-md active:scale-98"
                                            >
                                                {t('goToApp')}
                                                <CircleStar className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

            </div>
        </header>
    )
}

export default AboutHeader