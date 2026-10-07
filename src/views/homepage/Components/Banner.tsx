'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BannerResponse, BannerActionType } from '@/interface/content';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface BannerProps {
    banners?: BannerResponse[];
    loading?: boolean;
}

const parseMetadata = (metadata?: string | null): string | null => {
    if (!metadata) return null;
    try {
        const parsed = JSON.parse(metadata);
        if (parsed.badgeText) return parsed.badgeText;
        if (parsed.campaignTag) return parsed.campaignTag;
        if (parsed.featuredTheme) return parsed.featuredTheme;
        if (typeof parsed === 'object') {
            const firstVal = Object.values(parsed)[0];
            if (typeof firstVal === 'string') return firstVal;
        }
    } catch {
        return metadata;
    }
    return metadata;
};

export default function Banner({ banners = [], loading = false }: BannerProps) {
    const router = useRouter();
    const [swiperRef, setSwiperRef] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const displayBanners = useMemo(() => {
        if (banners.length > 1 && banners.length < 6) {
            return [...banners, ...banners, ...banners];
        }
        return banners;
    }, [banners]);

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

    if (!isSkeleton && (!banners || banners.length === 0)) {
        return null;
    }

    return (
        <section className="relative w-full overflow-hidden bg-linear-to-b from-surface-container-low via-surface to-surface py-4 md:py-8 border-b border-outline-variant/30">
            <div className="w-full relative z-10">
                <div className="relative w-full group/banner-wrapper">
                    {!isSkeleton && banners.length > 1 && (
                        <>
                            <button
                                onClick={() => swiperRef?.slidePrev()}
                                className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-surface/90 hover:bg-surface text-on-surface border border-outline-variant/40 backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer opacity-90 hover:opacity-100 hover:scale-110 shadow-sm"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
                            </button>
                            <button
                                onClick={() => swiperRef?.slideNext()}
                                className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-surface/90 hover:bg-surface text-on-surface border border-outline-variant/40 backdrop-blur-md transition-all duration-300 active:scale-95 cursor-pointer opacity-90 hover:opacity-100 hover:scale-110 shadow-sm"
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                            </button>
                        </>
                    )}

                    <Swiper
                        onSwiper={setSwiperRef}
                        onSlideChange={(swiper) => {
                            if (!isSkeleton && banners.length > 0) {
                                setActiveIndex(swiper.realIndex % banners.length);
                            }
                        }}
                        modules={[EffectCoverflow, Autoplay]}
                        effect={'coverflow'}
                        grabCursor={!isSkeleton}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        spaceBetween={16}
                        breakpoints={{
                            640: {
                                spaceBetween: 24,
                            },
                            1024: {
                                spaceBetween: 32,
                            },
                        }}
                        loop={!isSkeleton && displayBanners.length > 1}
                        loopAdditionalSlides={isSkeleton ? 0 : 4}
                        watchSlidesProgress={true}
                        observer={true}
                        observeParents={true}
                        autoplay={
                            !isSkeleton && banners.length > 1
                                ? {
                                    delay: 4000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }
                                : false
                        }
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 1.2,
                            slideShadows: false,
                        }}
                        className="hero-expo-swiper w-full py-2 sm:py-4 overflow-visible"
                    >
                        {isSkeleton
                            ? [1, 2, 3].map((_, index) => (
                                <SwiperSlide
                                    key={`skeleton-${index}`}
                                    className="w-[80%]! transition-all duration-500 select-none"
                                >
                                    {({ isActive }) => (
                                        <div
                                            className={`relative w-full aspect-video sm:aspect-16/8 md:aspect-21/9 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 bg-surface-container-high animate-pulse border border-outline-variant/40 flex items-center justify-center ${isActive
                                                ? 'scale-100 opacity-100'
                                                : 'scale-90 opacity-60'
                                                }`}
                                        >
                                            {isActive && (
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-surface-container-highest animate-pulse" />
                                            )}
                                        </div>
                                    )}
                                </SwiperSlide>
                            ))
                            : displayBanners.map((banner, index) => {
                                const badge = parseMetadata(banner.metadata);
                                return (
                                    <SwiperSlide
                                        key={`${banner.id || index}-${index}`}
                                        className="w-[80%]! transition-all duration-500 select-none"
                                    >
                                        {({ isActive }) => (
                                            <div
                                                onClick={() => handleBannerClick(banner)}
                                                className={`relative w-full aspect-video sm:aspect-16/8 md:aspect-21/9 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer group/slide ${isActive
                                                    ? 'scale-100 opacity-100'
                                                    : 'scale-90 opacity-60 filter brightness-90 hover:opacity-80'
                                                    }`}
                                            >
                                                <img
                                                    src={banner.imageUrl || banner.mobileImageUrl}
                                                    alt={banner.title || 'Bakery Shop Banner'}
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop';
                                                    }}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/slide:scale-105"
                                                />

                                                {(banner.title || badge) && (
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3.5 sm:p-6 text-white">
                                                        {banner.title && (
                                                            <h3 className="font-heading text-sm sm:text-lg md:text-xl font-bold tracking-tight mb-0.5 sm:mb-1">
                                                                {banner.title}
                                                            </h3>
                                                        )}
                                                        {badge && (
                                                            <span className="inline-self-start text-[10px] sm:text-xs text-white/90 font-medium capitalize bg-white/20 backdrop-blur-md px-2 sm:px-2.5 py-0.5 rounded-full w-fit mt-1">
                                                                {badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>

                    {!isSkeleton && banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 mt-2 sm:mt-4 min-h-4 z-20">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => swiperRef?.slideToLoop(index)}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index
                                        ? 'w-7 bg-primary'
                                        : 'w-2 bg-outline-variant/60 hover:bg-outline-variant'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
