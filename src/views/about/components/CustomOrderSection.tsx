'use client'

import { useLocale } from 'next-intl'
import { CalendarClock, CheckCircle2, MapPin, MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { BAKERY_INFO, getAboutContent } from '../about.data'

export default function CustomOrderSection() {
  const locale = useLocale()
  const { cta } = getAboutContent(locale)
  const address = locale === 'en' ? BAKERY_INFO.address.en : BAKERY_INFO.address.vi

  return (
    <div
      id="dat-banh"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-pale via-cream to-surface-container p-6 md:p-10 lg:p-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-rose-light/40 blur-3xl"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            {cta.eyebrow}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
            {cta.title}
          </h2>

          <p className="text-base md:text-lg font-normal leading-relaxed text-on-surface-variant">
            {cta.description}
          </p>

          <ul className="flex flex-col gap-3 pt-1">
            {cta.checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm md:text-base font-medium text-foreground"
              >
                <CheckCircle2
                  className="w-5 h-5 shrink-0 text-tertiary mt-1"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href={cta.primaryHref}
              className="inline-flex items-center justify-center gap-2 min-h-12 px-7 py-3 rounded-full bg-primary text-primary-foreground text-base font-semibold shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{cta.primaryCta}</span>
            </Link>

            <a
              href={cta.zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-12 px-5 py-3 rounded-full bg-surface-container-lowest/90 border border-outline text-foreground text-sm md:text-base font-semibold transition-colors hover:bg-surface-container-low"
            >
              {cta.zaloLabel}
            </a>

            <a
              href={cta.messengerHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-12 px-5 py-3 rounded-full bg-surface-container-lowest/90 border border-outline text-foreground text-sm md:text-base font-semibold transition-colors hover:bg-surface-container-low"
            >
              {cta.messengerLabel}
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant p-5 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-on-secondary-container font-semibold text-base">
              <CalendarClock className="w-5 h-5 shrink-0 text-secondary" aria-hidden="true" />
              <h3>{cta.advancePolicyTitle}</h3>
            </div>
            <p className="text-sm md:text-base font-normal leading-relaxed text-on-surface-variant">
              {cta.advancePolicyText}
            </p>
          </div>

          <div className="rounded-2xl bg-surface-container-lowest/90 backdrop-blur-sm border border-outline-variant p-5 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <MapPin className="w-5 h-5 shrink-0 text-primary" aria-hidden="true" />
              <h3>{cta.addressCardTitle}</h3>
            </div>
            <p className="text-sm md:text-base font-normal leading-relaxed text-on-surface-variant">
              {address}
            </p>
            <p className="text-xs md:text-sm font-medium text-secondary">
              {cta.addressNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
