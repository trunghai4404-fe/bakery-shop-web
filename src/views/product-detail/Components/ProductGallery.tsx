'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImageInterface } from '@/interface/catalog';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
    images: ProductImageInterface[];
    productName: string;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

export default function ProductGallery({ images = [], productName }: ProductGalleryProps) {
    const displayImages = images;

    const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

    const selectedIndex = page;
    const activeImage = displayImages[selectedIndex] || displayImages[0];

    const handleSelectIndex = (newIndex: number) => {
        if (newIndex === selectedIndex) return;
        const dir = newIndex > selectedIndex ? 1 : -1;
        setPage([newIndex, dir]);
    };

    const handleNext = () => {
        if (!displayImages.length) return;
        const nextIndex = (selectedIndex + 1) % displayImages.length;
        setPage([nextIndex, 1]);
    };

    const handlePrev = () => {
        if (!displayImages.length) return;
        const prevIndex = (selectedIndex - 1 + displayImages.length) % displayImages.length;
        setPage([prevIndex, -1]);
    };

    if (!displayImages.length) {
        return (
            <div className="w-full aspect-square rounded-3xl bg-surface-container-low border border-outline-variant/30 flex flex-col items-center justify-center text-on-surface-variant/50">
                <ImageIcon className="h-16 w-16 mb-2 stroke-1" />
                <span className="text-sm font-medium">Chưa có hình ảnh</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="relative w-full aspect-square rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-2xs overflow-hidden group">
                <AnimatePresence custom={direction} initial={false}>
                    <motion.div
                        key={activeImage?.id || selectedIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.35 },
                            opacity: { duration: 0.25, ease: 'linear' },
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={activeImage?.desktopUrl || activeImage?.mobileUrl || '/placeholder.png'}
                            alt={productName}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            className="object-cover object-center"
                        />
                    </motion.div>
                </AnimatePresence>

                {displayImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md border border-outline-variant/30 flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface shadow-md cursor-pointer z-10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md border border-outline-variant/30 flex items-center justify-center text-on-surface opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface shadow-md cursor-pointer z-10"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {displayImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {displayImages.map((img, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                            <button
                                key={img.id || idx}
                                type="button"
                                onClick={() => handleSelectIndex(idx)}
                                className={`relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${isSelected
                                    ? 'border-primary ring-2 ring-primary/20 shadow-xs scale-95'
                                    : 'border-outline-variant/30 opacity-70 hover:opacity-100 hover:border-primary/50'
                                    }`}
                            >
                                <Image
                                    src={img.desktopUrl || img.mobileUrl}
                                    alt={`${productName} thumbnail ${idx + 1}`}
                                    fill
                                    sizes="90px"
                                    className="object-cover object-center"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
