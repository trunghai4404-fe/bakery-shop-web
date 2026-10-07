'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProductInterface } from '@/interface/catalog';
import { Link } from '@/i18n/routing';

import ProductCardImageSwiper from './ProductCardImageSwiper';
import { formatCurrency } from '@/lib/helper';

interface ProductCardProps {
    product: ProductInterface;
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryVariant =
        product.variants?.find((v) => v.isActive) || product.variants?.[0];
    const price = primaryVariant?.price;

    const categoryName = product.categories?.[0]?.name;
    const productUrl = product.slug ? `/product-list?slug=${product.slug}` : '/product-list';

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Thêm vào giỏ hàng (Add to cart):', product);
    };

    return (
        <Link
            href={productUrl}
            className="group relative flex flex-col h-full rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer"
        >
            <ProductCardImageSwiper
                images={product.images}
                productName={product.name}
                categoryName={categoryName}
            />

            <div className="flex flex-col flex-1 p-3.5 sm:p-4">
                <h3 className="font-heading text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1 tracking-tight">
                    {product.name}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed flex-1 min-h-9">
                    {product.description || 'Bánh tươi thơm ngon được chế biến từ nguyên liệu cao cấp mỗi ngày.'}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/25 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/70">
                            Giá bán
                        </span>
                        <span className="text-base font-bold text-primary font-heading tracking-tight">
                            {formatCurrency(price)}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white active:scale-95 rounded-xl border border-primary/15 transition-all duration-200 cursor-pointer group/btn shadow-2xs"
                        title="Thêm vào giỏ hàng"
                    >
                        <ShoppingCart className="h-3.5 w-3.5 stroke-2 transition-transform duration-200 group-hover/btn:-translate-y-0.5" />
                        <span className="hidden sm:inline">Thêm vào giỏ</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}
