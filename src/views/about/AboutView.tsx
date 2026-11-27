'use client'

import dynamic from 'next/dynamic'
import { MotionConfig } from 'framer-motion'
import LazySection from '@/components/common/LazySection'
import HeroSection from './components/HeroSection'

const StorySection = dynamic(() => import('./components/StorySection'), {
  ssr: true,
})
const CakeOptionsSection = dynamic(
  () => import('./components/CakeOptionsSection'),
  { ssr: true }
)
const GallerySection = dynamic(() => import('./components/GallerySection'), {
  ssr: true,
})
const CustomOrderSection = dynamic(
  () => import('./components/CustomOrderSection'),
  { ssr: true }
)

export default function AboutView() {
  return (
    <MotionConfig reducedMotion="user">
      <article className="flex flex-col gap-12 md:gap-20 py-4 pb-16">
        <HeroSection />

        <LazySection id="cau-chuyen" ariaLabel="Our story" className="p-0">
          <StorySection />
        </LazySection>

        <LazySection id="tuy-chon-banh" ariaLabel="Cake customization options" className="p-0">
          <CakeOptionsSection />
        </LazySection>

        <LazySection id="mau-banh" ariaLabel="Featured cake gallery" className="p-0">
          <GallerySection />
        </LazySection>

        <LazySection id="len-y-tuong" ariaLabel="Custom cake order" className="p-0">
          <CustomOrderSection />
        </LazySection>
      </article>
    </MotionConfig>
  )
}
