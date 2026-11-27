'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'
import heroCakeImg from '@/public/images/about/hero-cake.jpg'
import { getAboutContent } from '../about.data'

export default function HeroSection() {
  const locale = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const { hero } = getAboutContent(locale)

  return (
    <section
      aria-label={hero.eyebrow}
      className="relative w-full py-4 md:py-10 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="lg:col-span-6 flex flex-col gap-5"
        >
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-rose-pale border border-outline-variant px-4 py-2 text-xs md:text-sm font-semibold text-on-primary-container">
            <Sparkles className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{hero.eyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-foreground">
            {hero.title}
          </h1>

          <p className="text-base md:text-lg font-normal leading-relaxed text-on-surface-variant max-w-xl">
            {hero.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={hero.primaryHref}
              className="inline-flex items-center justify-center gap-2 min-h-12 px-7 py-3 rounded-full bg-primary text-primary-foreground text-base font-semibold shadow-sm transition-all hover:opacity-95 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span>{hero.primaryCta}</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>

            <a
              href={hero.secondaryHref}
              className="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-full bg-surface-container-lowest/80 border border-outline text-foreground text-base font-semibold transition-colors hover:bg-surface-container"
            >
              {hero.secondaryCta}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
          }
          className="lg:col-span-6 relative"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-rose-light/50 via-champagne/40 to-sage-light/40 blur-2xl -z-10"
          />

          <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-3xl bg-cream shadow-md">
            <Image
              src={heroCakeImg}
              alt={hero.imageAlt}
              fill
              priority
              fetchPriority="high"
              placeholder="blur"
              sizes="(max-width: 1023px) 100vw, 580px"
              className="object-cover object-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
