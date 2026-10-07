'use client'

import React, { useState, useEffect } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import {
  Home,
  Info,
  PhoneCall,
  ShoppingCart,
  Menu as MenuIcon,
  Globe,
  Cake
} from 'lucide-react'
import { motion } from 'framer-motion'

import LanguageSwitcher from './header/LanguageSwitcher'
import UserMenu from './header/UserMenu'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/redux/store/hooks'
import { logOutUser } from '@/redux/store/slices/auth/auth.action'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import Image from 'next/image'
import { appImages } from '@/constants/appInfo'

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('Header')
  const lang = locale as 'vi' | 'en'
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY > 50) {
        setIsScrolled(true)
      } else if (scrollY < 10) {
        setIsScrolled(false)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await dispatch(logOutUser())
    } finally {
      setIsLoggingOut(false)
      router.replace('/')
      router.refresh()
    }
  }

  const userMenuLabels = {
    profile: t('profile'),
    bookings: t('bookings'),
    settings: t('settings'),
    logout: t('logout'),
    login: t('login'),
    register: t('register')
  }

  const leftNavItems = [
    {
      href: '/',
      label: t('home'),
      icon: Home,
      exact: true
    },
    {
      href: '/product-list',
      label: t('products'),
      icon: Cake,
      exact: false
    }
  ]

  const rightNavItems = [
    {
      href: '/about',
      label: t('introduce'),
      icon: Info,
      exact: false
    },
    {
      href: '/contact',
      label: t('contact'),
      icon: PhoneCall,
      exact: false
    }
  ]

  const allNavItems = [...leftNavItems, ...rightNavItems]

  const isLinkActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === '/' || pathname === `/${lang}`
    }
    return pathname.startsWith(href)
  }

  const handleCartClick = () => {
    router.push('/product-list')
  }

  const renderNavLink = (item: { href: string; label: string; exact: boolean }) => {
    const active = isLinkActive(item.href, item.exact)
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`relative px-2.5 py-1 text-sm font-semibold tracking-wide transition-colors duration-200 ${active
          ? 'text-primary font-bold cursor-default'
          : 'text-on-surface hover:text-primary'
          }`}
      >
        <span>{item.label}</span>
        {active && (
          <motion.div
            layoutId="header-active-nav"
            className="absolute -bottom-1 left-1.5 right-1.5 h-0.5 rounded-full bg-primary"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    )
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transform-gpu transition-colors duration-300 ease-in-out ${isScrolled
        ? 'border-primary/40 bg-surface/95 shadow-[0_8px_30px_rgba(74,53,51,0.08)]'
        : 'border-primary/25 bg-surface/85 shadow-[0_4px_20px_rgba(74,53,51,0.04)]'
        }`}
    >
      <div className="hidden md:flex mx-auto px-4 lg:px-0 max-w-7xl h-20 items-center justify-between relative">
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-4">
            {leftNavItems.map(renderNavLink)}
          </nav>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-50 pointer-events-auto">
          <Link
            href="/"
            className="group flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <Image
              src={appImages.BakeryLogo}
              alt="Bakery Logo"
              priority
              className='object-contain transition-all duration-300 ease-in-out filter h-14 sm:h-20 w-auto translate-y-2 drop-shadow-xs'
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            {rightNavItems.map(renderNavLink)}
          </nav>

          <div className="h-4 w-px bg-outline-variant/50" />

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher currentLang={lang} />

            <button
              onClick={handleCartClick}
              className="relative flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low/60 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 text-on-surface-variant hover:text-primary cursor-pointer active:scale-95"
              title={lang === 'vi' ? 'Sản phẩm / Giỏ hàng' : 'Products / Cart'}
            >
              <ShoppingCart className="h-4 w-4 stroke-[1.8]" />
            </button>

            <UserMenu
              labels={userMenuLabels}
              isLoggingOut={isLoggingOut}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      <div className="flex md:hidden mx-auto h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 group"
        >
          <Image
            src={appImages.BakeryLogo}
            alt="Bakery Logo"
            priority
            className={`object-contain h-11 w-auto drop-shadow-xs`}
          />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCartClick}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface-variant cursor-pointer active:scale-95"
            title={lang === 'vi' ? 'Sản phẩm / Giỏ hàng' : 'Products / Cart'}
          >
            <ShoppingCart className="h-4 w-4 stroke-[1.8] text-primary" />
          </button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-outline-variant/40 bg-surface-container-low text-on-surface hover:text-primary transition-all duration-200 cursor-pointer active:scale-95"
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-4 w-4" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] max-w-xs p-0 flex flex-col h-full bg-surface border-l border-outline-variant/30 transition-all duration-300">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <div className="flex flex-col h-full justify-between p-5">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <span className="font-heading text-lg font-bold text-primary">
                      Bakery<span className="text-secondary">.</span>
                    </span>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {allNavItems.map((item) => {
                      const active = isLinkActive(item.href, item.exact)
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${active
                            ? 'text-primary font-bold cursor-default'
                            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
                            }`}
                        >
                          <Icon className={`h-4 w-4 stroke-[1.8] ${active ? 'text-primary' : 'text-on-surface-variant/70'}`} />
                          <span>{item.label}</span>
                          {active && (
                            <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      )
                    })}
                  </nav>
                </div>

                <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg border border-outline-variant/30 bg-surface-container-low">
                    <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                      <Globe className="h-3.5 w-3.5 stroke-[1.8] text-primary" />
                      <span>{lang === 'vi' ? 'Ngôn ngữ' : 'Language'}</span>
                    </div>
                    <LanguageSwitcher currentLang={lang} />
                  </div>

                  <div className="w-full">
                    <UserMenu
                      labels={userMenuLabels}
                      isLoggingOut={isLoggingOut}
                      onLogout={handleLogout}
                    />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
