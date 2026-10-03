'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDarkActive = theme === 'dark' || (!theme && isDarkSystem)
    setIsDark(isDarkActive)
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-8 w-8 border border-primary/50 items-center justify-center rounded-lg dark:border-primary/50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 dark:text-zinc-400 cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4 stroke-[1.5] text-primary" /> : <Moon className="h-4 w-4 stroke-[1.5] text-primary" />}
    </button>
  )
}
