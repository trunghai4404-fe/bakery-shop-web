import type { Metadata } from 'next'
import AboutView from '@/views/about/AboutView'
import { BAKERY_INFO, getAboutContent } from '@/views/about/about.data'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const content = getAboutContent(locale)

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: {
      canonical: locale === 'en' ? '/en/about' : '/about',
      languages: {
        vi: '/about',
        en: '/en/about',
      },
    },
    openGraph: {
      title: content.seo.title,
      description: content.hero.description,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'vi_VN',
      images: [
        {
          url: '/images/about/hero-cake.jpg',
          width: 1200,
          height: 900,
          alt: content.hero.imageAlt,
        },
      ],
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const products = isEn ? BAKERY_INFO.products.en : BAKERY_INFO.products.vi

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: isEn ? BAKERY_INFO.nameEn : BAKERY_INFO.name,
    description: getAboutContent(locale).seo.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: isEn ? 'Cuu Loi Junction' : 'Ngã ba Cửu Lợi',
      addressLocality: 'Cam Lâm',
      addressRegion: 'Khánh Hòa',
      addressCountry: 'VN',
    },
    makesOffer: products.map((product) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: product,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutView />
    </>
  )
}
