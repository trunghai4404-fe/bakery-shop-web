'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductCard from '@/components/products/ProductCard';
import ProductSkeletonGrid from '@/components/products/ProductCardSkeleton';
import { ProductInterface } from '@/interface/catalog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect, useState } from 'react';

interface ProductSliderProps {
    products: ProductInterface[];
    loading?: boolean;
}

export default function ProductSlider({ products, loading = false }: ProductSliderProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const displayProducts = products.slice(0, 6);

    if (loading || !mounted) {
        return <ProductSkeletonGrid count={4} />;
    }

    if (!displayProducts.length) {
        return null;
    }

    return (
        <div className="relative group/slider w-full">
            <button
                className="slider-prev-btn absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-surface/95 hover:bg-surface text-on-surface border border-outline-variant/40 shadow-md transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                aria-label="Scroll left"
            >
                <ChevronLeft className="h-5 w-5 stroke-2" />
            </button>

            <button
                className="slider-next-btn absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-surface/95 hover:bg-surface text-on-surface border border-outline-variant/40 shadow-md transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-0 disabled:pointer-events-none"
                aria-label="Scroll right"
            >
                <ChevronRight className="h-5 w-5 stroke-2" />
            </button>

            <Swiper
                modules={[Navigation]}
                navigation={{
                    prevEl: '.slider-prev-btn',
                    nextEl: '.slider-next-btn',
                }}
                spaceBetween={12}
                slidesPerView={1.65}
                breakpoints={{
                    480: {
                        slidesPerView: 2.2,
                        spaceBetween: 16,
                    },
                    640: {
                        slidesPerView: 2.8,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 3.2,
                        spaceBetween: 24,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 24,
                    },
                }}
                className="w-full py-2 px-1"
            >
                {displayProducts.map((product) => (
                    <SwiperSlide key={product.id} className="h-auto">
                        <ProductCard product={product} showAddToCartText={true} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
