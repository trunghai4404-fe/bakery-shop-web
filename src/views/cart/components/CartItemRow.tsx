'use client';

import QuantityInput from '@/components/ui/quantity-input';
import { BasketItemDto } from '@/interface/basket';
import { formatCurrency } from '@/lib/helper';
import { AlertCircle, ShoppingBag, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface CartItemRowProps {
  item: BasketItemDto;
  disabled?: boolean;
  onQuantityChange: (productId: number, variantId: number, quantity: number) => void;
  onRemove: (productId: number, variantId: number) => void;
}

export default function CartItemRow({
  item,
  disabled = false,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const t = useTranslations('Cart');
  const hasDiscount = item.discountPrice > 0 && item.discountPrice < item.price;
  const effectiveUnitPrice = hasDiscount ? item.discountPrice : item.price;
  const hasBlockingWarning = (item.warnings ?? []).some(
    (w) => w.code === 'OUT_OF_STOCK' || w.code === 'INACTIVE'
  );

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 transition-colors ${hasBlockingWarning
        ? 'bg-amber-50/40'
        : 'bg-surface-container-lowest'
        }`}
    >
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-low">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
              <ShoppingBag className="h-7 w-7" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-heading text-base font-bold text-on-surface line-clamp-2">
                {item.productName}
              </h3>
              {item.variantName && (
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                  {t('variantLabel')}: <span className="font-medium">{item.variantName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-primary">
              {formatCurrency(effectiveUnitPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs text-on-surface-variant line-through">
                  {formatCurrency(item.price)}
                </span>
                {item.discountPercent > 0 && (
                  <span className="rounded-full bg-rose-pale px-2 py-0.5 text-[11px] font-bold text-primary">
                    -{item.discountPercent}%
                  </span>
                )}
              </>
            )}
          </div>

          {item.warnings && item.warnings.length > 0 && (
            <div className="space-y-1 pt-1">
              {item.warnings.map((warning, idx) => (
                <div
                  key={`${warning.code}-${idx}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100/80 px-2.5 py-1 text-xs font-medium text-amber-900"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                  <span>{warning.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 border-outline-variant/20 pt-3 sm:pt-0 shrink-0">
        <div className="text-left sm:text-right">
          <p className="text-xs text-on-surface-variant">{t('lineTotal')}</p>
          <p className="font-heading text-base sm:text-lg font-bold text-primary">
            {formatCurrency(item.finalPrice)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <QuantityInput
            size="sm"
            min={1}
            value={item.quantity}
            disabled={disabled}
            onChange={(val) => onQuantityChange(item.productId, item.variantId, val)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.productId, item.variantId)}
            disabled={disabled}
            title={t('removeItem')}
            aria-label={t('removeItem')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant/40 text-on-surface-variant hover:border-error/40 hover:bg-error/10 hover:text-error transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
