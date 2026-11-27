'use client'

import { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import { useLocale } from 'next-intl'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, RotateCw } from 'lucide-react'
import flavorImg from '@/public/images/about/option-flavor.jpg'
import decorationImg from '@/public/images/about/cake-details.jpg'
import messageImg from '@/public/images/about/option-message.jpg'
import { CakeOptionGroup, getAboutContent } from '../about.data'
import { cn } from '@/lib/utils'

const OPTION_IMAGES: Record<CakeOptionGroup['imageKey'], StaticImageData> = {
  flavor: flavorImg,
  decoration: decorationImg,
  message: messageImg,
}

function FlipOptionCard({ group }: { group: CakeOptionGroup }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleToggle = () => setIsFlipped((prev) => !prev)

  return (
    <div
      className="group relative h-[430px] sm:h-[450px] w-full [perspective:1200px]"
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`${group.title} — ${group.flipHint}`}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        className={cn(
          'relative h-full w-full cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          shouldReduceMotion
            ? 'transition-opacity duration-300'
            : 'transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]',
          !shouldReduceMotion && isFlipped && '[transform:rotateY(180deg)]'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant shadow-sm [backface-visibility:hidden]',
            shouldReduceMotion && isFlipped && 'opacity-0 pointer-events-none'
          )}
        >
          <div className="relative w-full h-56 sm:h-60 shrink-0 overflow-hidden bg-cream">
            <Image
              src={OPTION_IMAGES[group.imageKey]}
              alt={group.imageAlt}
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 100vw, 380px"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-3 left-3 rounded-full bg-surface-bright/95 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-on-primary-container shadow-sm">
              {group.tag}
            </span>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-foreground">
                {group.title}
              </h3>
              <p className="text-sm md:text-base font-normal leading-relaxed text-on-surface-variant">
                {group.preview}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-0 flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-rose-pale via-cream to-surface-container border border-outline-variant p-6 shadow-md [backface-visibility:hidden]',
            !shouldReduceMotion && '[transform:rotateY(180deg)]',
            shouldReduceMotion && !isFlipped && 'opacity-0 pointer-events-none'
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
                {group.tag}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
              {group.title}
            </h3>

            <p className="text-sm md:text-base font-normal leading-relaxed text-on-surface-variant">
              {group.description}
            </p>

            <ul className="flex flex-col gap-2 pt-1">
              {group.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm font-medium text-foreground"
                >
                  <Check
                    className="w-4 h-4 shrink-0 text-tertiary mt-1"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CakeOptionsSection() {
  const locale = useLocale()
  const { options } = getAboutContent(locale)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 max-w-3xl">
        <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
          {options.eyebrow}
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
          {options.title}
        </h2>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.groups.map((group) => (
          <FlipOptionCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}
