import { SiteConfig } from '@/types'
import { env } from '@/env.mjs'

export const siteConfig: SiteConfig = {
  name: 'bakery-shop',
  author: 'bakery shop',

  description:
    'Khám phá các loại bánh ngon nhất, được làm từ những nguyên liệu tươi ngon và chất lượng nhất. bakery-shop - Bánh ngon mỗi ngày.',

  keywords: [
    'bakery-shop',
    'bánh ngọt',
    'bánh mì',
    'đặt bánh online',
    'bánh ngon',
    'bánh tươi',
  ],

  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: env.NEXT_PUBLIC_APP_URL,
  },

  ogImage: `${env.NEXT_PUBLIC_APP_URL}/images/sporthub_og_banner.png`
}