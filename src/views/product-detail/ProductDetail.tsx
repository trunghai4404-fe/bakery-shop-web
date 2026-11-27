'use client';

import React, { useEffect } from 'react';
import Breadcrumb from '@/components/layouts/breadcrumb';
import { useBreadcrumbStore } from '@/zustand/breadcrumb/store';
import { ProductInterface } from '@/interface/catalog';
import ProductGallery from './Components/ProductGallery';
import ProductInfo from './Components/ProductInfo';
import ProductDescription from './Components/ProductDescription';
import ConcentricRingsLoader from '@/components/ui/loading-animation-1';
import { useLoading } from '@/context/LoadingContext';

interface ProductDetailProps {
    product: ProductInterface;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const setCrumb = useBreadcrumbStore((state) => state.setCrumb);
    const { hideLoading } = useLoading();

    useEffect(() => {
        hideLoading();
    }, [hideLoading]);

    useEffect(() => {
        if (product) {
            setCrumb({
                name: product.name,
                pathname: `/product-detail/${product.slug}`,
            });
        }
    }, [product, setCrumb]);

    if (!product) {
        return (
            <div className="flex min-h-[65vh] w-full flex-col items-center justify-center py-16">
                <div className="flex flex-col items-center justify-center rounded-3xl border border-outline-variant/40 bg-surface-container-lowest/90 p-8 shadow-sm backdrop-blur-xs min-w-[240px]">
                    <ConcentricRingsLoader
                        size={120}
                        color="#A83B55"
                        text="Đang tải thông tin sản phẩm..."
                        showText={true}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 sm:py-6 flex flex-col gap-4 w-full">
            <Breadcrumb />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start w-full">
                <div className="lg:col-span-6 w-full">
                    <ProductGallery images={product.images} productName={product.name} />
                </div>

                <div className="lg:col-span-6 w-full">
                    <ProductInfo product={product} />
                </div>
            </div>

            <div className="w-full pt-4">
                <ProductDescription description={product.description} />
            </div>
        </div>
    );
}
