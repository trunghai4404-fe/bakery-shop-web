'use client';

import { showCustomToast } from '@/components/toast/CustomToast';
import { ROUTES } from '@/constants/routes-path';
import { Link } from '@/i18n/routing';
import { formatCurrency } from '@/lib/helper';
import { useAppSelector } from '@/redux/store/hooks';
import { selectLastCheckoutResult } from '@/redux/store/slices/cart/cartSlice.reducer';
import {
  ArrowRight,
  Check,
  ClipboardList,
  Copy,
  ShoppingBag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useEffect, useSyncExternalStore } from 'react';
import { readPersistedCheckoutResult } from './constants/checkout.constants';
import { useLoading } from '@/context/LoadingContext';
import Image from 'next/image';
import { appImages } from '@/constants/appInfo';

const emptySubscribe = () => () => { };

export default function CheckoutSuccessView() {
  const t = useTranslations('CheckoutSuccess');
  const reduxResult = useAppSelector(selectLastCheckoutResult);
  const user = useAppSelector((state) => state.auth.user);
  const [copied, setCopied] = useState(false);
  const { hideLoading } = useLoading();

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  const isClientMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const result = useMemo(() => {
    if (reduxResult) return reduxResult;
    if (!isClientMounted) return null;
    return readPersistedCheckoutResult();
  }, [reduxResult, isClientMounted]);

  const handleCopyOrderCode = async () => {
    if (!result?.orderCode) return;
    try {
      await navigator.clipboard.writeText(result.orderCode);
      setCopied(true);
      showCustomToast({
        message: t('copiedOrderCode'),
        type: 'success',
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showCustomToast({
        message: t('copyFailed'),
        type: 'error',
      });
    }
  };

  if (!isClientMounted && !reduxResult) {
    return null;
  }

  if (!result) {
    return (
      <section className="container-page py-14">
        <div className="mx-auto max-w-lg rounded-2xl border border-outline-variant/35 bg-surface-container-lowest p-8 text-center space-y-4">
          <div className="mx-auto flex h-30 w-30 items-center justify-center">
            <Image
              src={appImages.BakeryLogo}
              alt="bakery"
              width={120}
              height={120}
            />
          </div>
          <h1 className="font-heading text-xl font-bold text-on-surface">
            {t('noOrderTitle')}
          </h1>
          <p className="text-sm text-on-surface-variant">{t('noOrderDesc')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.PRODUCT_LIST}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              <span>{t('continueShopping')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ROUTES.CART}
              className="inline-flex items-center rounded-xl border border-outline-variant/50 px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
            >
              {t('backToCart')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const paymentBadgeText =
    result.paymentStatus === 'Paid'
      ? t('statusPaid')
      : result.paymentStatus === 'Unpaid'
        ? t('statusUnpaidCod')
        : result.paymentStatus;

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-2xl rounded-3xl border border-outline-variant/35 bg-surface-container-lowest p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-30 w-30 items-center justify-center">
            <Image
              src={appImages.BakeryLogo}
              alt="bakery"
              width={120}
              height={120}
            />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low/50 p-5 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/25 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t('orderCodeLabel')}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-on-surface">
                {result.orderCode}
              </span>
              <button
                type="button"
                onClick={handleCopyOrderCode}
                title={t('copyOrderCode')}
                className="inline-flex items-center text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">{t('totalAmountLabel')}</span>
            <span className="font-heading text-xl font-bold text-primary">
              {formatCurrency(result.totalAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">{t('paymentStatusLabel')}</span>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${result.paymentStatus === 'Paid'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-900'
                }`}
            >
              {paymentBadgeText}
            </span>
          </div>

          {result.store && (
            <div className="flex items-start justify-between gap-4 border-t border-outline-variant/25 pt-3 text-sm">
              <span className="shrink-0 text-on-surface-variant">{t('storeLabel')}</span>
              <div className="text-right">
                <p className="font-semibold text-on-surface">{result.store.name}</p>
                <p className="text-xs text-on-surface-variant">{result.store.address}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={ROUTES.PRODUCT_LIST}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-5 py-3 text-sm font-bold text-white transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{t('continueShopping')}</span>
          </Link>
          <Link
            href={
              user
                ? `${ROUTES.ACCOUNT_ORDERS}&orderCode=${encodeURIComponent(result.orderCode)}`
                : `${ROUTES.ORDER_TRACKING}?orderCode=${encodeURIComponent(result.orderCode)}`
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/60 bg-surface hover:bg-surface-container-low px-5 py-3 text-sm font-semibold text-on-surface transition-colors"
          >
            <ClipboardList className="h-4 w-4 text-primary" />
            <span>{t('viewOrders')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
