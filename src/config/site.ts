import { SiteConfig } from '@/types'
import { env } from '@/env.mjs'

export const siteConfig: SiteConfig = {
  name: 'SportHub',
  author: 'SportHub Team',

  description:
    'SportHub là ứng dụng đặt sân, đặt lịch tập trực tuyến, tìm kiếm đồng đội và kết nối cộng đồng đam mê thể thao hàng đầu Việt Nam. Tiện lợi, nhanh chóng, uy tín.',

  keywords: [
    'SportHub',
    'đặt sân trực tuyến',
    'đặt sân bóng',
    'đặt lịch tập',
    'tìm đối cáp kèo',
    'cộng đồng thể thao',
    'book sân online',
    'thể thao việt nam',
  ],

  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: env.NEXT_PUBLIC_APP_URL,
  },

  ogImage: `${env.NEXT_PUBLIC_APP_URL}/images/sporthub_og_banner.png`
}