'use client';

import CartWarningsBanner from '@/components/cart/CartWarningsBanner';
import { showCustomToast } from '@/components/toast/CustomToast';
import { ROUTES } from '@/constants/routes-path';
import { Link } from '@/i18n/routing';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
  selectBasket,
  selectCartHasWarnings,
  selectCartItems,
  selectCartLoading,
  selectCartMutating,
  selectCartSubtotal,
  selectCartTotalQuantity,
} from '@/redux/store/slices/cart/cartSlice.reducer';
import {
  clearBasketThunk,
  fetchBasketDetailThunk,
  removeBasketItemThunk,
  updateItemQuantityThunk,
} from '@/redux/store/slices/cart/cart.action';
import { ArrowRight, Loader2, ShoppingBag, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import CartItemRow from './components/CartItemRow';
import CartSummaryCard from './components/CartSummaryCard';

export default function CartView() {
  const t = useTranslations('Cart');
  const dispatch = useAppDispatch();

  const basket = useAppSelector(selectBasket);
  const items = useAppSelector(selectCartItems);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);
  const hasWarnings = useAppSelector(selectCartHasWarnings);
  const loading = useAppSelector(selectCartLoading);
  const mutating = useAppSelector(selectCartMutating);

  const revalidatedBasketIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!basket?.id || revalidatedBasketIdRef.current === basket.id) return;
    revalidatedBasketIdRef.current = basket.id;
    dispatch(fetchBasketDetailThunk(basket.id));
  }, [dispatch, basket?.id]);

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
    if (removeBasketItemThunk.fulfilled.match(result)) {
      showCustomToast({
        message: t('removedSuccess'),
        type: 'success',
      });
    } else {
      showCustomToast({
        message: result.payload || t('removeError'),
        type: 'error',
      });
    }
  };

  const handleClearCart = async () => {
    const result = await dispatch(clearBasketThunk());
    if (clearBasketThunk.fulfilled.match(result)) {
      showCustomToast({
        message: t('clearedSuccess'),
        type: 'success',
      });
    } else {
      showCustomToast({
        message: result.payload || t('clearError'),
        type: 'error',
      });
    }
  };

  const hasBlockingWarning = items.some((item) =>
    (item.warnings ?? []).some((w) => w.code === 'OUT_OF_STOCK' || w.code === 'INACTIVE')
  );

  if (loading && !basket) {
    return (
      <section className="container-page py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-on-surface-variant">{t('loadingCart')}</p>
      </section>
    );
  }

  return (
    <section className="container-page py-8 sm:py-10">
      {items.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest py-16 px-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-pale/70 text-primary">
            <ShoppingBag className="h-10 w-10 stroke-[1.6]" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h2 className="font-heading text-xl font-bold text-on-surface">
              {t('emptyTitle')}
            </h2>
            <p className="text-sm text-on-surface-variant">{t('emptySubtitle')}</p>
          </div>
          <Link
            href={ROUTES.PRODUCT_LIST}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            <span>{t('exploreProducts')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-2 bg-surface-container-lowest p-4 rounded-lg">
            <div className="flex gap-4 justify-between items-center border-b border-outline-variant/25 pb-2">
              <h1 className="font-heading text-xl font-bold text-on-surface">
                {t('pageTitle')}
              </h1>
              <button
                type="button"
                onClick={handleClearCart}
                disabled={mutating || loading}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-error/85 hover:bg-error/10 hover:text-error transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t('clearCart')}</span>
              </button>
            </div>

            <CartWarningsBanner hasWarnings={hasWarnings} items={items} />

            <div className="space-y-3.5">
              {items.map((item) => (
                <CartItemRow
                  key={`${item.productId}-${item.variantId}`}
                  item={item}
                  disabled={mutating || loading}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <CartSummaryCard
              totalQuantity={totalQuantity}
              subtotal={subtotal}
              hasBlockingWarning={hasBlockingWarning}
              disabled={mutating || loading}
            />
          </div>
        </div>
      )}
    </section>
  );
}
