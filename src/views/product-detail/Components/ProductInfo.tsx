'use client';

import React, { useState } from 'react';
import { ProductInterface, ProductVariantInterface } from '@/interface/catalog';
import { formatCurrency } from '@/lib/helper';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Zap, CheckCircle2, ShieldCheck, Truck, Clock } from 'lucide-react';
import QuantityInput from '@/components/ui/quantity-input';

interface ProductInfoProps {
    product: ProductInterface;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const activeVariants = product.variants?.filter((v) => v.isActive) || [];
    const defaultVariant = activeVariants[0] || product.variants?.[0];

    const [selectedVariant, setSelectedVariant] = useState<ProductVariantInterface | null>(
        defaultVariant || null
    );
    const [quantity, setQuantity] = useState<number>(1);

    const currentPrice = selectedVariant?.price || 0;
    const currentStock = selectedVariant ? selectedVariant.stockQuantity : 0;
    const isOutOfStock = currentStock <= 0;

    const handleAddToCart = () => {
        console.log('Thêm vào giỏ:', {
            productId: product.id,
            productName: product.name,
            variant: selectedVariant,
            quantity,
        });
    };

    const handleBuyNow = () => {
        console.log('Mua ngay:', {
            productId: product.id,
            productName: product.name,
            variant: selectedVariant,
            quantity,
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="space-y-2.5">
                {product.categories && product.categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {product.categories.map((cat) => (
                            <Link
                                key={cat.categoryId}
                                href={`/product-list?category=${cat.slug}`}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}

                <h1 className="font-heading text-base md:text-2xl font-bold text-on-surface tracking-tight leading-tight">
                    {product.name}
                </h1>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-2xs flex items-baseline gap-3">
                <span className="text-xl sm:text-4xl font-bold text-primary font-heading tracking-tight">
                    {formatCurrency(currentPrice)}
                </span>
            </div>

            {product.variants && product.variants.length > 0 && (
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">
                        Lựa chọn phân loại:
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {product.variants.map((v) => {
                            const isSelected = selectedVariant?.id === v.id;

                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedVariant(v);
                                        setQuantity(1);
                                    }}
                                    disabled={!v.isActive}
                                    className={`relative p-2 rounded-lg border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 ${isSelected
                                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-2xs ring-1 ring-primary/30'
                                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface hover:border-primary/40 hover:bg-surface-container-low'
                                        } ${!v.isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs sm:text-sm font-bold truncate">{v.name}</span>
                                    </div>

                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80">
                    Số lượng:
                </label>
                <div className="flex items-center gap-3">
                    <QuantityInput
                        value={quantity}
                        onChange={setQuantity}
                        maxStock={currentStock}
                        disabled={isOutOfStock}
                    />

                    {isOutOfStock ? (
                        <span className="text-xs text-error font-semibold">
                            Hết hàng
                        </span>
                    ) : (
                        <span className="text-xs text-on-surface-variant/70 font-medium">
                            Còn lại {currentStock} sản phẩm
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-bold text-sm sm:text-base active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                    <span>Thêm vào giỏ hàng</span>
                </button>

                <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary/85 hover:bg-primary text-white shadow-xs font-bold text-sm sm:text-base active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                    <span>Mua ngay</span>
                </button>
            </div>
        </div>
    );
}
