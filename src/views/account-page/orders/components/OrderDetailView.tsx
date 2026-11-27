'use client';

import { showCustomToast } from '@/components/toast/CustomToast';
import { OrderDto, OrderStatus } from '@/interface/order';
import { DATE_FORMAT, formatCurrency, formatTime, getErrorMessage } from '@/lib/helper';
import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  Check,
  Copy,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  ShoppingBag,
  Store,
  User,
  XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  getPaymentStatusBadgeClass,
  ORDER_API_STATUS_TO_TAB,
} from '../constants/order.constants';
import { orderService } from '../services/order.service';
import OrderStatusTag from './OrderStatusTag';
import OrderTimeline from './OrderTimeline';
import CancelOrderModal from './CancelOrderModal';

interface OrderDetailViewProps {
  orderCode: string;
  initialOrder?: OrderDto | null;
  onBack?: () => void;
  onOrderUpdated?: () => void;
  allowCancel?: boolean;
  skipFetch?: boolean;
}

export default function OrderDetailView({
  orderCode,
  initialOrder,
  onBack,
  onOrderUpdated,
  allowCancel = true,
  skipFetch = false,
}: OrderDetailViewProps) {
  const t = useTranslations('Account.orders');

  const [fetchedOrder, setFetchedOrder] = useState<OrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const requestKey = `${orderCode}:${reloadNonce}`;
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const order = skipFetch ? (initialOrder ?? null) : (fetchedOrder ?? initialOrder ?? null);

  useEffect(() => {
    if (skipFetch) return;
    let isMounted = true;

    orderService
      .getOrderDetail(orderCode)
      .then((detail) => {
        if (!isMounted) return;
        if (detail) {
          setFetchedOrder(detail);
          setError(null);
        } else if (!initialOrder) {
          setError(t('loadFailed'));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (!initialOrder) {
          setError(getErrorMessage(err, t('loadFailed')));
        }
      })
      .finally(() => {
        if (isMounted) setSettledKey(requestKey);
      });

    return () => {
      isMounted = false;
    };
  }, [orderCode, requestKey, initialOrder, skipFetch, t]);

  const isLoading = !skipFetch && settledKey !== requestKey;

  const handleCopyCode = async () => {
    if (!order?.orderCode) return;
    try {
      await navigator.clipboard.writeText(order.orderCode);
      setCopied(true);
      showCustomToast({ message: t('copiedOrderCode'), type: 'success' });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const tab = ORDER_API_STATUS_TO_TAB[status];
    return tab ? t(`status.${tab}`) : status;
  };

  const getPaymentLabel = (status: string) => {
    const known = ['Unpaid', 'Paid', 'Failed', 'Refunded'];
    return known.includes(status) ? t(`paymentStatus.${status}`) : status;
  };

  const formattedDate = formatTime(order?.createdAt, DATE_FORMAT.DATE_TIME);

  return (
    <div className="rounded-xl border border-primary/15 bg-white p-4 shadow-[0_4px_24px_rgba(74,53,51,0.05)] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center text-on-surface transition-colors cursor-pointer"
              title={t('backToList')}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-on-surface">
              {t('detailTitle')}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className=" text-xs text-on-surface">
              #{order?.orderCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              title={t('copyOrderCode')}
              className="inline-flex items-center cursor-pointer"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {isLoading && order && (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      {isLoading && !order ? (
        <div className="flex items-center justify-center gap-2.5 py-14 text-sm text-on-surface-variant">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>{t('loadingDetail')}</span>
        </div>
      ) : error && !order ? (
        <div className="rounded-2xl border border-error/30 bg-error/5 p-6 flex flex-col items-center text-center gap-3">
          <AlertCircle className="h-6 w-6 text-error" />
          <p className="text-sm font-medium text-error">{error}</p>
          <button
            type="button"
            onClick={() => setReloadNonce((prev) => prev + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/60 bg-white px-4 py-2 text-xs font-bold text-on-surface hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('retry')}</span>
          </button>
        </div>
      ) : order ? (
        <div className="space-y-5">
          {order.status === 'Cancelled' && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 flex items-start gap-2.5 text-sm">
              <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-900">{getStatusLabel(order.status)}</p>
                {order.cancelReason && (
                  <p className="text-xs text-red-800">
                    {t('cancelledReasonLabel')}: {order.cancelReason}
                  </p>
                )}
              </div>
            </div>
          )}

          <OrderTimeline
            status={order.status}
            fulfillmentType={order.fulfillmentType}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-outline-variant/80 shadow-xs p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-bold text-on-surface pb-1.5 border-b border-outline-variant/50">
                <User className="h-4 w-4 text-primary" />
                <span>{t('customerInfoTitle')}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">{t('recipientLabel')}</span>
                <span className="font-bold text-on-surface text-right">
                  {order.customerInfo.name}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">{t('phoneLabel')}</span>
                <span className="font-bold text-on-surface text-right">
                  {order.customerInfo.phone}
                </span>
              </div>
              {order.customerInfo.email && (
                <div className="flex justify-between gap-2">
                  <span className="text-on-surface-variant">{t('emailLabel')}</span>
                  <span className="font-bold text-on-surface text-right truncate">
                    {order.customerInfo.email}
                  </span>
                </div>
              )}
              {order.shippingAddress?.address && (
                <div className="flex justify-between gap-2">
                  <span className="shrink-0 text-on-surface-variant">{t('addressLabel')}</span>
                  <span className="font-medium text-on-surface text-right">
                    {order.shippingAddress.address}
                  </span>
                </div>
              )}
              {order.shippingMethodName && (
                <div className="flex justify-between gap-2">
                  <span className="text-on-surface-variant">{t('shippingMethodLabel')}</span>
                  <span className="font-bold text-on-surface text-right">
                    {order.shippingMethodName}
                  </span>
                </div>
              )}
              {order.note && (
                <div className="flex justify-between gap-2">
                  <span className="shrink-0 text-on-surface-variant">{t('noteLabel')}</span>
                  <span className="italic text-on-surface text-right">{order.note}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-outline-variant/80 p-4 space-y-2.5 text-xs sm:text-sm shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-on-surface pb-1.5 border-b border-outline-variant/20">
                  <Banknote className="h-4 w-4 text-primary" />
                  <span>{t('paymentTitle')}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-on-surface-variant">{t('paymentMethodLabel')}</span>
                  <span className="font-bold text-on-surface text-right">
                    {order.paymentMethodName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-on-surface-variant">{t('paymentStatusLabel')}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${getPaymentStatusBadgeClass(
                      order.paymentStatus
                    )}`}
                  >
                    {getPaymentLabel(order.paymentStatus)}
                  </span>
                </div>
              </div>

              {order.store && (
                <div className="rounded-2xl border border-outline-variant/80 p-4 space-y-1.5 text-xs shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-on-surface pb-1.5 border-b border-outline-variant/20">
                    <Store className="h-4 w-4 text-primary" />
                    <span>{t('storeTitle')}</span>
                  </div>
                  <p className="font-bold text-on-surface">{order.store.name}</p>
                  <p className="flex items-start gap-1 text-on-surface-variant">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span>{order.store.address}</span>
                  </p>
                  {order.store.phone && (
                    <p className="flex items-center gap-1 text-on-surface-variant">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                      <span>{order.store.phone}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/80 p-4 space-y-3">
            {/* <div className="flex items-center gap-1.5 text-sm font-bold text-on-surface pb-1.5 border-b border-outline-variant/20">
              <span>{t('itemsTitle')}</span>
            </div> */}

            <ul className="divide-y divide-outline-variant/20">
              {order.items.map((item) => (
                <li key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low">
                    {item.productImageUrl ? (
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-bold text-on-surface">
                      {item.productName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {item.variantName ? `Phân loại: ${item.variantName} ` : ''}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {formatCurrency(item.finalPrice)} x{item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-on-surface">
                    {formatCurrency(item.totalItemPrice)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-outline-variant/25 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('subtotalLabel')}</span>
                <span className="font-bold text-on-surface">
                  {formatCurrency(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>{t('shippingFeeLabel')}</span>
                <span className="font-bold text-on-surface">
                  {order.shippingFee > 0
                    ? formatCurrency(order.shippingFee)
                    : t('freeShipping')}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{t('discountLabel')}</span>
                  <span className="font-bold">
                    -{formatCurrency(order.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-outline-variant/25 pt-2.5">
                <span className="font-bold text-on-surface">{t('totalLabel')}</span>
                <span className="font-heading text-xl font-bold text-primary">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {allowCancel && order.status === 'Pending' && (
            <div className="border-t border-outline-variant/25 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 text-xs sm:text-sm font-bold text-red-700 transition-colors cursor-pointer"
              >
                <XCircle className="h-4 w-4" />
                <span>{t('cancelOrderButton')}</span>
              </button>
            </div>
          )}

          {allowCancel && (
            <CancelOrderModal
              orderCode={order.orderCode}
              open={cancelModalOpen}
              onOpenChange={setCancelModalOpen}
              onCancelled={() => {
                setReloadNonce((prev) => prev + 1);
                onOrderUpdated?.();
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
