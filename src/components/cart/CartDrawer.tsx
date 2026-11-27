'use client';

import {
  closeCartDrawer,
  selectBasket,
  selectCartHasWarnings,
  selectCartItems,
  selectCartLoading,
  selectCartMutating,
  selectCartSubtotal,
  selectCartTotalQuantity,
  selectIsCartDrawerOpen,
} from '@/redux/store/slices/cart/cartSlice.reducer';
import {
  removeBasketItemThunk,
  updateItemQuantityThunk,
} from '@/redux/store/slices/cart/cart.action';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/constants/routes-path';
import { formatCurrency } from '@/lib/helper';
import QuantityInput from '@/components/ui/quantity-input';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { showCustomToast } from '@/components/toast/CustomToast';
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import CartWarningsBanner from './CartWarningsBanner';

export default function CartDrawer() {
  const t = useTranslations('Cart');
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectIsCartDrawerOpen);
  const basket = useAppSelector(selectBasket);
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);
  const hasWarnings = useAppSelector(selectCartHasWarnings);
  const loading = useAppSelector(selectCartLoading);
  const mutating = useAppSelector(selectCartMutating);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(closeCartDrawer());
    }
  };

  const handleQuantityChange = async (
    productId: number,
    variantId: number,
    nextQuantity: number
  ) => {
    const result = await dispatch(
      updateItemQuantityThunk({ productId, variantId, quantity: nextQuantity })
    );
    if (updateItemQuantityThunk.rejected.match(result)) {
      showCustomToast({
        message: result.payload || t('updateError'),
        type: 'error',
      });
    }
  };

  const handleRemoveItem = async (productId: number, variantId: number) => {
    const result = await dispatch(removeBasketItemThunk({ productId, variantId }));
    if (removeBasketItemThunk.rejected.match(result)) {
      showCustomToast({
        message: result.payload || t('removeError'),
        type: 'error',
      });
    }
  };

  const hasBlockingWarning = items.some((item) =>
    (item.warnings ?? []).some((w) => w.code === 'OUT_OF_STOCK' || w.code === 'INACTIVE')
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-surface p-0 gap-0 border-l border-outline-variant/40 flex flex-col"
      >
        <SheetHeader className="border-b border-outline-variant/30 p-4 pr-12 bg-surface-container-low/50">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-on-surface">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>{t('drawerTitle')}</span>
            {totalQuantity > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {totalQuantity}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && !basket ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-pale/60 text-primary">
                <ShoppingBag className="h-8 w-8 stroke-[1.6]" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-on-surface">{t('emptyTitle')}</p>
                <p className="text-sm text-on-surface-variant max-w-xs">{t('emptySubtitle')}</p>
              </div>
              <Link
                href={ROUTES.PRODUCT_LIST}
                onClick={() => dispatch(closeCartDrawer())}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                <span>{t('exploreProducts')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              <CartWarningsBanner hasWarnings={hasWarnings} items={items} />

              <ul className="divide-y divide-outline-variant/25">
                {items.map((item) => {
                  const hasDiscount =
                    item.discountPrice > 0 && item.discountPrice < item.price;
                  const unitPrice = hasDiscount ? item.discountPrice : item.price;

                  return (
                    <li
                      key={`${item.productId}-${item.variantId}`}
                      className="py-3.5 first:pt-0 last:pb-0 flex gap-3"
                    >
                      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            fill
                            sizes="72px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 min-w-0 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-on-surface">
                              {item.productName}
                            </p>
                            {item.variantName && (
                              <p className="truncate text-xs text-on-surface-variant">
                                {item.variantName}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                            disabled={mutating}
                            aria-label={t('removeItem')}
                            className="rounded-md p-1 text-on-surface-variant/70 hover:bg-error/10 hover:text-error transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {item.warnings && item.warnings.length > 0 && (
                          <p className="text-xs font-medium text-amber-700">
                            {item.warnings[0].message}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <QuantityInput
                            size="sm"
                            min={1}
                            value={item.quantity}
                            disabled={mutating}
                            onChange={(val) =>
                              handleQuantityChange(item.productId, item.variantId, val)
                            }
                          />

                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">
                              {formatCurrency(item.finalPrice)}
                            </p>
                            {hasDiscount && (
                              <p className="text-[11px] text-on-surface-variant line-through">
                                {formatCurrency(unitPrice * item.quantity < item.price * item.quantity ? item.price * item.quantity : item.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-outline-variant/30 bg-surface-container-low/50 p-4 gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-on-surface-variant">{t('subtotal')}</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href={ROUTES.CART}
                onClick={() => dispatch(closeCartDrawer())}
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                {t('viewCart')}
              </Link>
              <Link
                href={hasBlockingWarning ? ROUTES.CART : ROUTES.CHECKOUT}
                onClick={() => dispatch(closeCartDrawer())}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${hasBlockingWarning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-primary hover:bg-primary/90'
                  }`}
              >
                <span>{hasBlockingWarning ? t('reviewCart') : t('checkout')}</span>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
