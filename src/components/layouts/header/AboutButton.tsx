'use client'

import React, { useState } from 'react'
import { Link } from '@/i18n/routing'
import { useIsMobile } from '@/hook/useIsMobile'

interface AboutButtonProps {
  label: string
}

export default function AboutButton({ label }: AboutButtonProps) {
  const isMobile = useIsMobile()
  const [hoverStyle, setHoverStyle] = useState<React.CSSProperties>({
    transform: 'translate(-100%, 0)'
  })

  const getDirection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 180
    return Math.round(angle / 90 + 3) % 4
  }

  const getStyleForDirection = (direction: number) => {
    switch (direction) {
      case 0:
        return { transform: 'translate(0, -100%)' }
      case 1:
        return { transform: 'translate(100%, 0)' }
      case 2:
        return { transform: 'translate(0, 100%)' }
      case 3:
        return { transform: 'translate(-100%, 0)' }
      default:
        return { transform: 'translate(-100%, 0)' }
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const dir = getDirection(e)
    setHoverStyle({
      ...getStyleForDirection(dir),
      transition: 'none'
    })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHoverStyle({
          transform: 'translate(0, 0)',
          transition: 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)'
        })
      })
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const dir = getDirection(e)
    setHoverStyle({
      ...getStyleForDirection(dir),
      transition: 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1)'
    })
  }

  return (
    isMobile ? (
      <Link
        href="/about"
        className="relative inline-flex items-center justify-center h-auto px-3 py-1.5 text-xs font-bold tracking-widest text-primary bg-linear-to-r from-primary/5 to-primary-container/10 rounded-lg border border-primary/20 hover:shadow-[0_0_12px_rgba(157,67,0,0.15)] active:scale-95 transition-all duration-200 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-1">
          {label}
        </span>
      </Link>
    ) : (
      <Link
        href="/about"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative sm:inline-flex items-center justify-center px-4 py-2 text-xs font-bold tracking-wider rounded-lg border border-zinc-200 bg-white/50 text-zinc-700 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(157,67,0,0.25)] hover:border-primary/40 cursor-pointer"
      >
        <span
          className="absolute inset-0 bg-linear-to-r from-primary to-primary-container pointer-events-none"
          style={hoverStyle}
        />
        <span className="absolute inset-0 w-[50%] h-full bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out pointer-events-none z-5" />
        <span className="relative z-10 flex items-center gap-1.5 transition-colors duration-300 group-hover:text-white">
          {label}
        </span>
      </Link>
    )
  )
}
