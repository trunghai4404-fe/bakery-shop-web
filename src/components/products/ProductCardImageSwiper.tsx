'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Cake } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { ProductImageInterface } from '@/interface/catalog';

import 'swiper/css';
import 'swiper/css/effect-fade';

interface ProductCardImageSwiperProps {
    images?: ProductImageInterface[];
    productName: string;
    categoryName?: string;
}

const SLIDE_DURATION = 1500;

export default function ProductCardImageSwiper({
    images = [],
    productName,
    categoryName,
}: ProductCardImageSwiperProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
    const swiperRef = useRef<SwiperClass | null>(null);

    const imageUrlList = useMemo(() => {
        if (!images || !Array.isArray(images) || images.length === 0) return [];
        return images
            .map((img: any) => {
                if (typeof img === 'string') return img;
                return img?.desktopUrl || img?.mobileUrl || img?.url || img?.src || '';
            })
            .filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim().length > 0));
    }, [images]);

    const validImageUrls = useMemo(() => {
        return imageUrlList.filter((url) => !failedImages[url]);
    }, [imageUrlList, failedImages]);

    const totalCount = validImageUrls.length;
    const hasMultiple = totalCount > 1;

    useEffect(() => {
        if (!isHovered || !hasMultiple) return;

        const timer = setInterval(() => {
            if (swiperRef.current) {
                const nextIdx = (swiperRef.current.realIndex + 1) % totalCount;
                swiperRef.current.slideTo(nextIdx);
            }
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, [isHovered, hasMultiple, totalCount]);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setActiveIndex(0);
        if (swiperRef.current) {
            swiperRef.current.slideTo(0);
        }
    };

    const handleSegmentHover = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveIndex(index);
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    const handleImageError = (url: string) => {
        setFailedImages((prev) => ({ ...prev, [url]: true }));
    };

    if (totalCount === 0) {
        return (
            <div className="relative aspect-4/3 w-full bg-surface-container overflow-hidden">
                <div className="flex flex-col items-center justify-center h-full w-full text-on-surface-variant/40">
                    <Cake className="h-10 w-10 stroke-[1.2] mb-1 text-secondary/60" />
                    <span className="text-[11px] font-medium text-on-surface-variant/60">
                        Bakery Shop
                    </span>
                </div>
                {categoryName && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[11px] font-semibold text-secondary bg-surface/90 backdrop-blur-md rounded-full shadow-xs border border-outline-variant/20">
                        {categoryName}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div
            className="relative aspect-4/3 w-full bg-surface-container-low overflow-hidden group/swiper select-none"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {categoryName && (
                <span className="absolute top-3 left-3 z-20 px-2.5 py-1 text-[11px] font-semibold text-secondary bg-surface/90 backdrop-blur-md rounded-full shadow-xs border border-outline-variant/20 pointer-events-none">
                    {categoryName}
                </span>
            )}

            {hasMultiple && (
                <div
                    className={`absolute top-2 left-2.5 right-2.5 z-30 flex gap-1 transition-opacity duration-300 pointer-events-auto ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {validImageUrls.map((_, idx) => {
                        const isCurrent = idx === activeIndex;
                        const isPast = idx < activeIndex;

                        return (
                            <div
                                key={idx}
                                onMouseEnter={(e) => handleSegmentHover(idx, e)}
                                onClick={(e) => handleSegmentHover(idx, e)}
                                className="flex-1 py-1.5 -my-1.5 flex items-center cursor-pointer group/segment"
                                title={`Hình ${idx + 1} / ${totalCount}`}
                            >
                                <div className="h-0.5 w-full rounded-full bg-black/25 dark:bg-white/30 backdrop-blur-xs overflow-hidden">
                                    <div
                                        key={`${idx}-${activeIndex}-${isHovered}`}
                                        className={`h-full bg-white shadow-xs rounded-full ${isPast ? 'w-full' : isCurrent && !isHovered ? 'w-0' : 'w-0'
                                            }`}
                                        style={
                                            isCurrent && isHovered
                                                ? {
                                                    animation: `cardProgressFill ${SLIDE_DURATION}ms linear forwards`,
                                                }
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Swiper
                modules={[EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={500}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="w-full h-full"
            >
                {validImageUrls.map((url, idx) => (
                    <SwiperSlide key={url + idx} className="relative w-full h-full">
                        <Image
                            src={url}
                            alt={`${productName} - ${idx + 1}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover/swiper:scale-105"
                            onError={() => handleImageError(url)}
                            priority={idx === 0}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
