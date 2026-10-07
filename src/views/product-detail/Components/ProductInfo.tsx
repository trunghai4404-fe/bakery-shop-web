'use client';

import React, { useState } from 'react';
import { ProductInterface, ProductVariantInterface, AccessoryProductInterface } from '@/interface/catalog';
import { formatCurrency } from '@/lib/helper';
import { Link } from '@/i18n/routing';
import { ShoppingCart, Zap, CheckCircle2, ShieldCheck, Truck, Clock, Gift, Check } from 'lucide-react';
import QuantityInput from '@/components/ui/quantity-input';
import Image from 'next/image';
import { showCustomToast } from '@/components/toast/CustomToast';

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
    const [selectedAccessoryVariants, setSelectedAccessoryVariants] = useState<Record<number, number[]>>({});
    const [accessoryQuantities, setAccessoryQuantities] = useState<Record<number, number>>({});

    const currentPrice = selectedVariant?.price || 0;
    const currentStock = selectedVariant ? selectedVariant.stockQuantity : 0;
    const isOutOfStock = currentStock <= 0;

    const totalPrice = React.useMemo(() => {
        let total = currentPrice * quantity;

        if (product.accessories && product.accessories.length > 0) {
            for (const acc of product.accessories) {
                if (acc.isIncluded) continue;

                const hasVariants = acc.variants && acc.variants.length > 0;
                const selectedVariantIds = selectedAccessoryVariants[acc.accessoryProductId] || [];

                if (hasVariants) {
                    if (selectedVariantIds.length > 0) {
                        const accQty = accessoryQuantities[acc.accessoryProductId] ?? (acc.defaultQuantity || 1);
                        const selectedObjs = acc.variants.filter((v) => selectedVariantIds.includes(v.id));

                        for (const vObj of selectedObjs) {
                            const itemPrice = (vObj.price && vObj.price > 0) ? vObj.price : acc.price;
                            total += itemPrice * accQty;
                        }
                    }
                } else {
                    const accQty = accessoryQuantities[acc.accessoryProductId] ?? (acc.defaultQuantity || 1);
                    total += acc.price * accQty;
                }
            }
        }

        return total;
    }, [currentPrice, quantity, product.accessories, selectedAccessoryVariants, accessoryQuantities]);

    const toggleAccessoryVariant = (acc: AccessoryProductInterface, variantId: number) => {
        const accId = acc.accessoryProductId;
        const isMultiSelect = acc.isMultiSelect ?? false;
        const maxSelectCount = acc.maxSelectCount ?? null;

        setSelectedAccessoryVariants((prev) => {
            const currentList = prev[accId] || [];
            const isSelected = currentList.includes(variantId);

            if (isMultiSelect) {
                if (isSelected) {
                    return {
                        ...prev,
                        [accId]: currentList.filter((id) => id !== variantId),
                    };
                } else {
                    if (maxSelectCount != null && maxSelectCount > 0 && currentList.length >= maxSelectCount) {
                        showCustomToast({
                            message: `Chọn tối đa ${maxSelectCount} loại cho ${acc.name}`,
                            type: 'error',
                        });
                        return prev;
                    }
                    return {
                        ...prev,
                        [accId]: [...currentList, variantId],
                    };
                }
            } else {
                if (isSelected) {
                    return {
                        ...prev,
                        [accId]: [],
                    };
                } else {
                    return {
                        ...prev,
                        [accId]: [variantId],
                    };
                }
            }
        });

        setAccessoryQuantities((prev) => {
            if (!prev[accId]) {
                return {
                    ...prev,
                    [accId]: 1,
                };
            }
            return prev;
        });
    };

    const handleAccessoryQuantityChange = (accId: number, val: number) => {
        setAccessoryQuantities((prev) => ({
            ...prev,
            [accId]: val,
        }));
    };

    const validateRequiredAccessories = () => {
        if (!product.accessories || product.accessories.length === 0) return true;

        for (const acc of product.accessories) {
            const hasVariants = acc.variants && acc.variants.length > 0;
            const selectedList = selectedAccessoryVariants[acc.accessoryProductId] || [];

            if (acc.isRequired && hasVariants && selectedList.length === 0) {
                showCustomToast({
                    message: `Vui lòng chọn loại cho ${acc.name}`,
                    type: 'error',
                });
                return false;
            }
        }

        return true;
    };

    const handleAddToCart = () => {
        if (!validateRequiredAccessories()) return;

        console.log('Thêm vào giỏ:', {
            productId: product.id,
            productName: product.name,
            variant: selectedVariant,
            quantity,
            selectedAccessoryVariants,
            accessoryQuantities,
        });
    };

    const handleBuyNow = () => {
        if (!validateRequiredAccessories()) return;

        console.log('Mua ngay:', {
            productId: product.id,
            productName: product.name,
            variant: selectedVariant,
            quantity,
            selectedAccessoryVariants,
            accessoryQuantities,
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="space-y-2">
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
                <div className="flex flex-col items-baseline gap-1">
                    <h1 className="font-heading text-base md:text-2xl font-bold text-on-surface tracking-tight leading-tight">
                        {product.name}
                    </h1>
                    <span className="text-xl font-bold text-primary font-heading tracking-tight">
                        {formatCurrency(currentPrice)}
                    </span>
                </div>
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

            {product.accessories && product.accessories.length > 0 && (
                <div className="flex flex-col gap-3.5 p-4 rounded-xl bg-linear-to-br from-primary/[0.07] via-surface-container-low to-surface-container border border-primary/30 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary pb-2 border-b border-primary/15">
                        <Gift className="w-4.5 h-4.5 stroke-2" />
                        <span>Sản phẩm tặng kèm & Phụ kiện:</span>
                    </div>

                    <div className="flex flex-col gap-3 divide-y divide-outline-variant/20">
                        {product.accessories.map((acc) => {
                            const selectedVariants = selectedAccessoryVariants[acc.accessoryProductId] || [];
                            const accQty = accessoryQuantities[acc.accessoryProductId] ?? (acc.defaultQuantity || 1);

                            const hasVariants = acc.variants && acc.variants.length > 0;
                            const hasSelectedVariant = selectedVariants.length > 0;
                            const selectedVariantObjs = hasVariants
                                ? acc.variants.filter((v) => selectedVariants.includes(v.id))
                                : [];

                            const accMaxStock = selectedVariantObjs.length > 0
                                ? Math.min(...selectedVariantObjs.map((v) => v.stockQuantity))
                                : undefined;

                            const isQuantityDisabled = !acc.isIncluded && hasVariants && !hasSelectedVariant;

                            const accUnitPrice = (() => {
                                if (selectedVariantObjs.length > 0) {
                                    const sum = selectedVariantObjs.reduce((accSum, v) => accSum + (v.price && v.price > 0 ? v.price : acc.price), 0);
                                    return formatCurrency(sum);
                                }
                                if (hasVariants) {
                                    const prices = acc.variants.map((v) => (v.price && v.price > 0 ? v.price : acc.price));
                                    const minP = Math.min(...prices);
                                    const maxP = Math.max(...prices);
                                    if (minP !== maxP) {
                                        return `${formatCurrency(minP)} - ${formatCurrency(maxP)}`;
                                    }
                                    return formatCurrency(minP);
                                }
                                return formatCurrency(acc.price);
                            })();

                            return (
                                <div key={acc.accessoryProductId} className="flex flex-col gap-2.5 pt-3 first:pt-0">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {acc.primaryImageUrl ? (
                                                <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-outline-variant/30 bg-surface shrink-0">
                                                    <Image
                                                        src={acc.primaryImageUrl}
                                                        alt={acc.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center w-11 h-11 rounded-lg border border-outline-variant/30 bg-surface-container shrink-0 text-primary">
                                                    <Gift className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-xs sm:text-sm font-bold text-on-surface">
                                                        {acc.name}
                                                    </span>
                                                    {acc.isRequired ? (
                                                        <span className="text-xs font-bold text-error">* (Bắt buộc)</span>
                                                    ) : (
                                                        <span className="text-xs font-normal text-on-surface-variant/60">(Tùy chọn)</span>
                                                    )}
                                                </div>
                                                {acc.isIncluded ? (
                                                    <span className="w-fit px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">
                                                        Tặng kèm
                                                    </span>
                                                ) : (
                                                    <div className="text-xs font-bold text-on-surface-variant/80">
                                                        Đơn giá: <span className='text-primary'>{accUnitPrice}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {!acc.isIncluded && (
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-on-surface-variant/80 hidden sm:inline">
                                                            Số lượng:
                                                        </span>
                                                        <QuantityInput
                                                            value={accQty}
                                                            onChange={(val) => handleAccessoryQuantityChange(acc.accessoryProductId, val)}
                                                            min={1}
                                                            maxStock={accMaxStock}
                                                            disabled={isQuantityDisabled}
                                                            size="sm"
                                                        />
                                                    </div>
                                                    {isQuantityDisabled && (
                                                        <span className="text-[10px] text-on-surface-variant/70 italic">
                                                            Vui lòng chọn loại
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {acc.variants && acc.variants.length > 0 && (
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] font-semibold text-on-surface-variant/80">
                                                    Loại sản phẩm {acc.isMultiSelect ? '(Chọn nhiều)' : '(Chọn 1)'}:
                                                </span>
                                                {acc.isMultiSelect && acc.maxSelectCount != null && acc.maxSelectCount > 0 && (
                                                    <span className="text-[10px] text-on-surface-variant/70 font-medium">
                                                        Tối đa: {acc.maxSelectCount}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {acc.variants.map((variant) => {
                                                    const isSelected = selectedVariants.includes(variant.id);
                                                    const isVariantOutOfStock = variant.stockQuantity <= 0;

                                                    return (
                                                        <button
                                                            key={variant.id}
                                                            type="button"
                                                            disabled={!variant.isActive || isVariantOutOfStock}
                                                            onClick={() => toggleAccessoryVariant(acc, variant.id)}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${isSelected
                                                                ? 'bg-primary/10 border-primary text-primary font-bold shadow-2xs'
                                                                : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:border-primary/40 hover:bg-surface-container-low'
                                                                } ${(!variant.isActive || isVariantOutOfStock) ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                        >
                                                            {acc.isMultiSelect ? (
                                                                <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-outline-variant bg-surface'
                                                                    }`}>
                                                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-3" />}
                                                                </div>
                                                            ) : (
                                                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-outline-variant bg-surface'
                                                                    }`}>
                                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                                </div>
                                                            )}
                                                            <span>{variant.name}</span>
                                                            {isVariantOutOfStock && (
                                                                <span className="text-[10px] text-error font-normal">(Hết hàng)</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/20 border border-outline-variant/30 shadow-2xs">
                <div className="flex flex-col gap-0.5">
                    <span className="text-base font-bold text-on-surface-variant">
                        Tạm tính:
                    </span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-primary font-heading tracking-tight">
                    {formatCurrency(totalPrice)}
                </span>
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
