'use client'

import Link from 'next/link'
import { Flame, Home, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white px-6">
      <div className="absolute top-1/4 left-1/4 h-75 w-75 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-75 w-75 translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center max-w-lg">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 animate-pulse">
          <Flame className="h-10 w-10" />
        </div>

        <h1 className="text-8xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)] mb-4">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
          {t('title')}
        </h2>

        <p className="text-zinc-400 text-base sm:text-lg mb-8 leading-relaxed">
          {t('description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-6 py-3.5 text-sm font-semibold text-black transition-all duration-300 transform hover:scale-[1.03] shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            {t('backHome')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800/80 px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </button>
        </div>
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        backgroundPosition: 'center'
      }} />
    </div>
  )
}
