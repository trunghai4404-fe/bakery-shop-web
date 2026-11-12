'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BannerResponse, BannerActionType } from '@/interface/content';
import { ChevronLeft, ChevronRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

interface HeroBannerProps {
    banners?: BannerResponse[];
    loading?: boolean;
}

const parseMetadata = (metadata?: string | null): { badge: string | null; description: string | null } => {
    if (!metadata) return { badge: null, description: null };
    try {
        const parsed = JSON.parse(metadata);
        const badge =
            parsed.badgeText ||
            parsed.campaignTag ||
            parsed.featuredTheme ||
            (typeof parsed === 'object' && typeof Object.values(parsed)[0] === 'string'
                ? (Object.values(parsed)[0] as string)
                : null);
        const description = parsed.description || parsed.subtitle || parsed.tagline || null;
        return { badge, description };
    } catch {
        return { badge: metadata, description: null };
    }
};

export default function HeroBanner({ banners = [], loading = false }: HeroBannerProps) {
    const router = useRouter();
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const isSkeleton = loading;

    const handleBannerClick = (banner: BannerResponse) => {
        if (!banner.targetValue && !banner.actionType) return;

        if (banner.actionType === BannerActionType.ExternalLink && banner.targetValue) {
            if (banner.openInNewTab) {
                window.open(banner.targetValue, '_blank');
            } else {
                window.location.href = banner.targetValue;
            }
        } else if (banner.actionType === BannerActionType.Category && banner.targetValue) {
            router.push(`/product-list?category=${banner.targetValue}`);
        } else if (banner.actionType === BannerActionType.Product && banner.targetValue) {
            router.push(`/product-list?id=${banner.targetValue}`);
        } else if (banner.targetValue) {
            router.push(banner.targetValue);
        }
    };

    const handleScrollDown = () => {
        const bannerElement = document.getElementById('hero-banner-section');
        if (bannerElement) {
            const nextElement = bannerElement.nextElementSibling;
            if (nextElement) {
                nextElement.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo({
            top: window.innerHeight - 80,
            behavior: 'smooth',
        });
    };

    if (!isSkeleton && (!banners || banners.length === 0)) {
        return null;
    }

    return (
        <section id="hero-banner-section" className="relative w-full overflow-hidden bg-surface-container-lowest border-b border-outline-variant/30">
            <div className="relative w-full h-60 sm:h-100 md:h-[calc(100vh-5rem)] md:min-h-137.5">
                {isSkeleton ? (
                    <div className="w-full h-full relative bg-surface-container-high animate-pulse flex items-end p-6 sm:p-10 md:p-14">
                        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-5 sm:p-8 rounded-2xl md:rounded-3xl bg-surface/70 backdrop-blur-md border border-outline-variant/30 space-y-3">
                            <div className="h-4 w-24 bg-surface-container-highest rounded-full" />
                            <div className="h-8 sm:h-10 w-3/4 bg-surface-container-highest rounded-lg" />
                            <div className="h-4 w-1/2 bg-surface-container-highest rounded" />
                        </div>
                        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex gap-2">
                            <div className="w-8 h-2.5 bg-surface-container-highest rounded-full" />
                            <div className="w-2.5 h-2.5 bg-surface-container-highest rounded-full" />
                            <div className="w-2.5 h-2.5 bg-surface-container-highest rounded-full" />
                        </div>
                    </div>
                ) : (
                    <>
                        <Swiper
                            onSwiper={setSwiperRef}
                            onSlideChange={(swiper) => {
                                if (banners.length > 0) {
                                    setActiveIndex(swiper.realIndex % banners.length);
                                }
                            }}
                            modules={[Autoplay]}
                            grabCursor={banners.length > 1}
                            slidesPerView={1}
                            spaceBetween={0}
                            speed={700}
                            loop={banners.length > 1}
                            autoplay={
                                banners.length > 1
                                    ? {
                                        delay: 5000,
                                        disableOnInteraction: false,
                                        pauseOnMouseEnter: true,
                                    }
                                    : false
                            }
                            className="w-full h-full"
                        >
                            {banners.map((banner, index) => {
                                const { badge, description } = parseMetadata(banner.metadata);
                                const hasAction = Boolean(banner.targetValue);

                                return (
                                    <SwiperSlide key={`${banner.id || index}-${index}`} className="w-full h-full">
                                        <div
                                            onClick={() => handleBannerClick(banner)}
                                            className={`relative w-full h-full overflow-hidden group/slide ${hasAction ? 'cursor-pointer' : 'cursor-default'
                                                }`}
                                        >
                                            <picture className="w-full h-full block">
                                                {banner.mobileImageUrl && (
                                                    <source
                                                        media="(max-width: 768px)"
                                                        srcSet={banner.mobileImageUrl}
                                                    />
                                                )}
                                                <img
                                                    src={banner.imageUrl || banner.mobileImageUrl}
                                                    alt={banner.title || 'Bakery Shop Banner'}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop&q=80';
                                                    }}
                                                    className="w-full h-full object-cover select-none transition-transform duration-1000 ease-out group-hover/slide:scale-105"
                                                />
                                            </picture>

                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10 pointer-events-none" />

                                            <div className="absolute bottom-4 left-4  z-20 max-w-[calc(100%-100px)] sm:max-w-md md:max-w-xl lg:max-w-2xl pointer-events-auto">
                                                <div className="p-4 rounded-xl bg-black/10 backdrop-blur-xs border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.4)] text-white transition-all duration-300">
                                                    {badge && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-primary text-white shadow-xs mb-2 sm:mb-3">
                                                            {badge}
                                                        </span>
                                                    )}

                                                    {banner.title && (
                                                        <h2 className="font-heading text-lg sm:text-2xl font-black tracking-tight leading-tight drop-shadow-md text-white line-clamp-2">
                                                            {banner.title}
                                                        </h2>
                                                    )}

                                                    {description && (
                                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-white/85 line-clamp-2 font-normal leading-relaxed">
                                                            {description}
                                                        </p>
                                                    )}

                                                    {hasAction && (
                                                        <div className="mt-3 sm:mt-5">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleBannerClick(banner);
                                                                }}
                                                                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 group/btn cursor-pointer"
                                                            >
                                                                <span>Khám phá ngay</span>
                                                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                        <button
                            type="button"
                            onClick={handleScrollDown}
                            className="absolute bottom-2 md:bottom-5 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-1 text-white/70 hover:text-white transition-all duration-300 cursor-pointer group select-none"
                            aria-label="Cuộn xuống xem sản phẩm"
                        >
                            <div className="w-4.5 h-7 md:w-5.5 md:h-8.5 rounded-full border border-white/40 group-hover:border-white/80 bg-black/15 backdrop-blur-xs flex items-start justify-center p-1 transition-colors shadow-xs">
                                <motion.div
                                    animate={{
                                        y: [0, 8, 0],
                                        opacity: [1, 0.2, 1],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="w-1 h-1.5 md:w-1 md:h-2 rounded-full bg-white shadow-xs"
                                />
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-white/75 group-hover:text-white animate-bounce -mt-0.5 group-hover:translate-y-0.5 transition-transform" />
                        </button>

                        {banners.length > 1 && (
                            <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1 sm:gap-2 bg-black/10 backdrop-blur-xs px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 shadow-xl">
                                <button
                                    type="button"
                                    onClick={() => swiperRef?.slidePrev()}
                                    className="text-white/75 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 active:scale-90 cursor-pointer"
                                    aria-label="Previous Slide"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                                </button>

                                <div className="flex items-center gap-1.5 sm:gap-2 px-1">
                                    {banners.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => swiperRef?.slideToLoop(index)}
                                            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index
                                                ? 'w-4 sm:w-6 bg-primary shadow-sm'
                                                : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
                                                }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => swiperRef?.slideNext()}
                                    className="text-white/75 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 active:scale-90 cursor-pointer"
                                    aria-label="Next Slide"
                                >
                                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
