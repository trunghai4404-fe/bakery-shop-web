'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  placeholder: string
}

export default function SearchInput({ placeholder }: SearchInputProps) {
  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3 h-4 w-4 stroke-[1.5] text-zinc-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
      />
    </div>
  )
}
