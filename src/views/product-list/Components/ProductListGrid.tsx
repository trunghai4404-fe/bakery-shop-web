'use client';

import React from 'react';
import { ProductInterface } from '@/interface/catalog';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton';
import { PackageX } from 'lucide-react';

interface ProductListGridProps {
    products: ProductInterface[];
    loading?: boolean;
}

export default function ProductListGrid({ products = [], loading = false }: ProductListGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 min-[640px]:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-container-lowest border border-outline-variant/30 rounded-3xl text-center w-full min-h-90">
                <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
                    <PackageX className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="font-heading text-lg font-bold text-on-surface mb-1">
                    Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed">
                    Rất tiếc, chưa có sản phẩm nào phù hợp với bộ lọc hoặc danh mục bạn đã chọn.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 min-[640px]:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
