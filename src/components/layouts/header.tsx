'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import {
    Bell,
    Heart,
    Menu
} from 'lucide-react'
import { appImages } from '@/constants/appInfo'

import AboutButton from './header/AboutButton'
import SearchInput from './header/SearchInput'
import LanguageSwitcher from './header/LanguageSwitcher'
import ThemeToggle from './header/ThemeToggle'
import UserMenu from './header/UserMenu'

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hook/useIsMobile'
import { useRouter } from 'next/navigation'

export default function Header() {
    const locale = useLocale()
    const t = useTranslations('Header')
    const lang = locale as "vi" | "en"
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const isMobile = useIsMobile();
    const router = useRouter();

    const userMenuLabels = {
        profile: t('profile'),
        bookings: t('bookings'),
        settings: t('settings'),
        logout: t('logout')
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-[#E5E5E5] bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-950/80 transition-all duration-300">
            {isMobile ? (
                <div className='flex flex-col py-4 gap-3 items-center justify-between'>
                    <div className='flex h-10 gap-2 items-center justify-between w-full px-4'>
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2 group transition-transform duration-200 active:scale-98">
                                <div className="relative w-18 h-8 overflow-hidden sm:w-32 sm:h-10">
                                    <Image
                                        src={appImages.LogoMain}
                                        alt="SportHub Logo"
                                        fill
                                        sizes="(max-width: 640px) 112px, 128px"
                                        priority
                                        className="object-fill"
                                    />
                                </div>
                            </Link>

                            <AboutButton label={t('introduce')} />
                        </div>
                        <div className='flex gap-3 justify-center items-center'>
                            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-primary/50 dark:border-primary-container/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer">
                                <Bell className="h-4 w-4 stroke-[1.5] text-primary" />
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white  ">
                                    2
                                </span>
                            </div>
                            <ThemeToggle />
                            <UserMenu labels={userMenuLabels} />
                        </div>
                    </div>
                    <div className='w-full flex gap-2 px-4 items-center justify-between border-t border-[#E5E5E5] dark:border-zinc-800/60 pt-4'>
                        <SearchInput placeholder={t('searchPlaceholder')} />
                        <div
                            onClick={() => {
                                router.push('/favorites')
                            }}
                            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/50 dark:border-primary-container/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer'>
                            <Heart className="h-4.5 w-4.5 stroke-[1.5] hover:fill-destructive text-primary" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 group transition-transform duration-200 active:scale-98">
                            <div className="relative w-28 h-9 overflow-hidden sm:w-32 sm:h-10">
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

                        <AboutButton label={t('introduce')} />
                    </div>

                    <div className="hidden md:block flex-1 max-w-xs md:max-w-md mx-4">
                        <SearchInput placeholder={t('searchPlaceholder')} />
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <LanguageSwitcher currentLang={lang} />

                        <ThemeToggle />

                        <div
                            onClick={() => {
                                router.push('/favorites')
                            }}
                            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/50 dark:border-primary-container/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer'>
                            <Heart className="h-4.5 w-4.5 stroke-[1.5] hover:fill-destructive text-primary" />
                        </div>

                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-primary/50 dark:border-primary-container/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer">
                            <Bell className="h-4 w-4 stroke-[1.5] text-primary" />
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white  ">
                                2
                            </span>
                        </div>

                        <UserMenu labels={userMenuLabels} />
                    </div>
                </div>
            )}
        </header>
    )
}
