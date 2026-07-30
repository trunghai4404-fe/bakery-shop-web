import React from 'react'
import { usePathname } from 'next/navigation'

export default function PageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMortalityPage = pathname.includes('mortality')
  return (
    <div
      className={`${isMortalityPage ? 'mortality-bg' : ''} page-container min-h-0`}
    >
      {children}
    </div>
  )
}
