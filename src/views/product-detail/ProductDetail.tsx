'use client';

import React, { useEffect } from 'react';
import Breadcrumb from '@/components/layouts/breadcrumb';
import { useBreadcrumbStore } from '@/zustand/breadcrumb/store';
import { ProductInterface } from '@/interface/catalog';
import ProductGallery from './Components/ProductGallery';
import ProductInfo from './Components/ProductInfo';
import ProductDescription from './Components/ProductDescription';

interface ProductDetailProps {
    product: ProductInterface;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const setCrumb = useBreadcrumbStore((state) => state.setCrumb);

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
            <div className="py-16 text-center text-on-surface-variant">
                Không tìm thấy thông tin sản phẩm.
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
