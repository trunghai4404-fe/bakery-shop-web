'use client';

import React, { useState } from 'react';
import { ProductInterface } from '@/interface/catalog';
import { Link, useRouter } from '@/i18n/routing';

import ProductCardImageSwiper from './ProductCardImageSwiper';
import { formatCurrency } from '@/lib/helper';
import { showCustomToast } from '@/components/toast/CustomToast';
import { useAppDispatch } from '@/redux/store/hooks';
import { addItemsToBasketThunk } from '@/redux/store/slices/cart/cart.action';
import { ShoppingCartIcon } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';

interface ProductCardProps {
    product: ProductInterface;
    showAddToCartText?: boolean;
}

export default function ProductCard({ product, showAddToCartText = false }: ProductCardProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showLoading } = useLoading();
    const [isAdding, setIsAdding] = useState(false);

    const primaryVariant =
        product.variants?.find((v) => v.isActive) || product.variants?.[0];
    const price = primaryVariant?.price;

    const categoryName = product.categories?.[0]?.name;
    const productUrl = product.slug ? `/product-detail/${product.slug}` : '/product-list';

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!primaryVariant || primaryVariant.stockQuantity <= 0) {
            showCustomToast({
                message: 'Sản phẩm tạm hết hàng',
                type: 'error',
            });
            return;
        }

        const hasRequiredAccessories = product.accessories?.some(
            (acc) => !acc.isIncluded && acc.isRequired && acc.variants && acc.variants.length > 0
        );
        if (hasRequiredAccessories) {
            showCustomToast({
                message: 'Vui lòng chọn phụ kiện đi kèm cho sản phẩm',
                type: 'error',
            });
            router.push(productUrl);
            return;
        }

        if (isAdding) return;
        setIsAdding(true);
        try {
            const result = await dispatch(
                addItemsToBasketThunk({
                    items: [
                        {
                            productId: product.id,
                            variantId: primaryVariant.id,
                            quantity: 1,
                        },
                    ],
                    openDrawer: true,
                })
            );
            if (addItemsToBasketThunk.fulfilled.match(result)) {
                showCustomToast({
                    message: 'Đã thêm sản phẩm vào giỏ hàng',
                    type: 'success',
                });
            } else {
                showCustomToast({
                    message: result.payload || 'Không thể thêm sản phẩm vào giỏ hàng',
                    type: 'error',
                });
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Link
            href={productUrl}
            onClick={() => {
                if (product.slug) {
                    showLoading();
                }
            }}
            className="group relative flex flex-col h-full rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer"
        >
            <ProductCardImageSwiper
                images={product.images}
                productName={product.name}
                categoryName={categoryName}
            />

            <div className="flex flex-col flex-1 p-3 sm:p-4">
                <h3
                    className="font-heading text-sm sm:text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1 mb-1.5 tracking-tight"
                    title={product.name}
                >
                    {product.name}
                </h3>

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
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`shrink-0  rounded-lg whitespace-nowrap inline-flex items-center justify-center text-primary bg-primary/10 hover:bg-primary hover:text-white active:scale-95 border border-primary/15 transition-all duration-200 cursor-pointer group/btn shadow-2xs disabled:opacity-50 ${showAddToCartText
                            ? 'gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold'
                            : 'p-2 sm:p-2.5'
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
