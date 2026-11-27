'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LazySectionProps {
  children: React.ReactNode
  id?: string
  ariaLabel?: string
  className?: string
  /**
   * When true, defers mounting children until the section approaches the viewport.
   * Keep false (default) for SEO-critical sections so SSR HTML remains intact
   * while JS chunks and images still lazy-load.
   */
  deferMount?: boolean
  /** Minimum height placeholder when deferMount is enabled to prevent CLS */
  minHeight?: number
  /** Animation delay in seconds */
  delay?: number
}

export default function LazySection({
  children,
  id,
  ariaLabel,
  className,
  deferMount = false,
  minHeight = 240,
  delay = 0,
}: LazySectionProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const [hasIntersected, setHasIntersected] = useState(!deferMount)

  useEffect(() => {
    if (!deferMount || hasIntersected) return
    const element = containerRef.current
    if (!element || typeof IntersectionObserver === 'undefined') {
      setHasIntersected(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasIntersected(true)
          observer.disconnect()
        }
      },
      { rootMargin: '160px 0px', threshold: 0.05 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [deferMount, hasIntersected])

  return (
    <motion.section
      ref={containerRef}
      id={id}
      aria-label={ariaLabel}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
      }
      style={!hasIntersected ? { minHeight } : undefined}
      className={cn('w-full p-4', className)}
    >
      {hasIntersected ? children : null}
    </motion.section>
  )
}
