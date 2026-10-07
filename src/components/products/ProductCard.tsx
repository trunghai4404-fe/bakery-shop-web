'use client';

import React from 'react';
import { ProductInterface } from '@/interface/catalog';
import { Link } from '@/i18n/routing';

import ProductCardImageSwiper from './ProductCardImageSwiper';
import { formatCurrency } from '@/lib/helper';
import { ShoppingCartIcon } from 'lucide-react';

interface ProductCardProps {
    product: ProductInterface;
    showAddToCartText?: boolean;
}

export default function ProductCard({ product, showAddToCartText = false }: ProductCardProps) {
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
                <h3
                    className="font-heading text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1.5 tracking-tight"
                    title={product.name}
                >
                    {product.name}
                </h3>

                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-3.5 h-9 overflow-hidden">
                    {product.description || 'Bánh tươi thơm ngon được chế biến từ nguyên liệu cao cấp mỗi ngày.'}
                </p>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-outline-variant/25 mt-auto">
                    <div className="flex flex-col shrink-0">
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-on-surface-variant/70">
                            Giá bán
                        </span>
                        <span className="text-sm sm:text-base font-bold text-primary font-heading tracking-tight whitespace-nowrap">
                            {formatCurrency(price)}
                        </span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`shrink-0 whitespace-nowrap inline-flex items-center justify-center text-primary bg-primary/10 hover:bg-primary hover:text-white active:scale-95 border border-primary/15 transition-all duration-200 cursor-pointer group/btn shadow-2xs ${showAddToCartText
                            ? 'gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl'
                            : 'p-2 sm:p-2.5 rounded-xl'
                            }`}
                        title="Thêm vào giỏ hàng"
                    >
                        <ShoppingCartIcon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/btn:scale-110" />
                        {showAddToCartText && <span className="whitespace-nowrap">Thêm vào giỏ</span>}
                    </button>
                </div>
            </div>
        </Link>
    );
}
