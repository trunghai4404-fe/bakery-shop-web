'use client'

import Image, { StaticImageData } from 'next/image'
import { useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import birthdayRoseImg from '@/public/images/about/gallery-birthday-rose.jpg'
import weddingCreamImg from '@/public/images/about/gallery-wedding-cream.jpg'
import passionfruitMousseImg from '@/public/images/about/gallery-passionfruit-mousse.jpg'
import saltedEggImg from '@/public/images/about/gallery-salted-egg.jpg'
import { GallerySample, getAboutContent } from '../about.data'

const GALLERY_IMAGES: Record<GallerySample['imageKey'], StaticImageData> = {
  birthdayRose: birthdayRoseImg,
  weddingCream: weddingCreamImg,
  passionfruitMousse: passionfruitMousseImg,
  saltedEgg: saltedEggImg,
}

export default function GallerySection() {
  const locale = useLocale()
  const { gallery } = getAboutContent(locale)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            {gallery.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
            {gallery.title}
          </h2>
          <p className="text-base font-normal text-on-surface-variant">
            {gallery.subtitle}
          </p>
        </div>

        <Link
          href={gallery.viewMoreHref}
          className="inline-flex items-center gap-2 self-start md:self-auto min-h-11 px-5 py-2 rounded-full bg-secondary-container text-on-secondary-container text-sm font-semibold transition-colors hover:bg-surface-container-highest"
        >
          <span>{gallery.viewMoreLabel}</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.items.map((item, idx) => (
          <figure
            key={item.id}
            className={`group flex flex-col gap-3 ${
              idx % 2 === 1 ? 'lg:translate-y-4' : ''
            }`}
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-cream shadow-sm transition-shadow group-hover:shadow-md">
              <Image
                src={GALLERY_IMAGES[item.imageKey]}
                alt={item.alt}
                fill
                placeholder="blur"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 280px"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-surface-bright/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-on-primary-container shadow-sm">
                {item.category}
              </span>
            </div>

            <figcaption className="px-1">
              <p className="text-sm md:text-base font-medium leading-snug text-foreground">
                {item.caption}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
