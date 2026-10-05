'use client'

import { usePathname } from 'next/navigation'
import Header from './layouts/header'

export default function HeaderNavigationWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      {/* <Footer /> */}
    </>
  )
}
