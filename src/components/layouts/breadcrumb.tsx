'use client'

import {
  selectBreadcrumb,
  useBreadcrumbStore,
} from '@/zustand/breadcrumb/store'
import Link from 'next/link'
import { Icons } from '../icons'


const Breadcrumb = () => {
  const { crumb } = useBreadcrumbStore(selectBreadcrumb)

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <div className="flex items-center gap-2 text-xs leading-5 w-full overflow-hidden">
        <Link href="/" className="text-sm text-[#737373] hover:text-black shrink-0">
          Trang chủ
        </Link>

        <Icons.chevronRight size={15} className="text-[#737373] shrink-0" />

        {crumb.childName ? (
          <>
            <Link
              href={crumb.pathname}
              className="text-sm text-[#737373] hover:text-black truncate shrink min-w-0"
            >
              {crumb.name}
            </Link>

            <Icons.chevronRight size={14} className="shrink-0" />

            <span className="text-sm font-semibold text-[#0A0A0A] truncate shrink min-w-0">
              {crumb.childName}
            </span>
          </>
        ) : (
          <span className="text-sm font-semibold text-[#0A0A0A] truncate shrink min-w-0">
            {crumb.name}
          </span>
        )}

      </div>
    </div>
  )
}

export default Breadcrumb
