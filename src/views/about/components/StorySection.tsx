'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'
import bakerStoryImg from '@/public/images/about/baker-story.jpg'
import { getAboutContent } from '../about.data'

export default function StorySection() {
  const locale = useLocale()
  const { story } = getAboutContent(locale)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      {/* Ảnh góc bếp / người làm bánh với khung nền lệch nhẹ */}
      <div className="lg:col-span-5 order-2 lg:order-1 relative">
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -top-4 -left-4 w-full h-full rounded-3xl bg-secondary-container/70 -z-10"
        />
        <div className="relative w-full aspect-[4/3] lg:aspect-[4/5] overflow-hidden rounded-3xl bg-cream shadow-md">
          <Image
            src={bakerStoryImg}
            alt={story.imageAlt}
            fill
            placeholder="blur"
            sizes="(max-width: 1023px) 100vw, 460px"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Câu chuyện tiệm */}
      <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-5">
        <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
          {story.eyebrow}
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-foreground">
          {story.title}
        </h2>

        <div className="flex flex-col gap-4">
          {story.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base md:text-lg font-normal leading-relaxed text-on-surface-variant"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-outline-variant">
          {story.highlights.map((item) => (
            <div key={item.label} className="flex flex-col gap-1 py-2">
              <span className="text-xs font-medium text-on-surface-variant">
                {item.label}
              </span>
              <span className="text-lg md:text-xl font-semibold text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
