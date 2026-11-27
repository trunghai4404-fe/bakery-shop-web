'use client';

import { showCustomToast } from '@/components/toast/CustomToast';
import { OrderDto } from '@/interface/order';
import { DATE_FORMAT, formatCurrency, formatTime } from '@/lib/helper';
import { Check, Clock, Copy, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { getPaymentStatusBadgeClass } from '../constants/order.constants';
import OrderStatusTag from './OrderStatusTag';

interface OrderCardProps {
  order: OrderDto;
  onSelectOrder: (order: OrderDto) => void;
}

export default function OrderCard({ order, onSelectOrder }: OrderCardProps) {
  const t = useTranslations('Account.orders');
  const [copied, setCopied] = useState(false);

  const knownPayment = ['Unpaid', 'Paid', 'Failed', 'Refunded'];
  const paymentLabel = knownPayment.includes(order.paymentStatus)
    ? t(`paymentStatus.${order.paymentStatus}`)
    : order.paymentStatus;

  const formattedDate = formatTime(order.createdAt, DATE_FORMAT.DATE_TIME);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(order.orderCode);
      setCopied(true);
      showCustomToast({ message: t('copiedOrderCode'), type: 'success' });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const previewItems = order.items.slice(0, 2);
  const remainingCount = Math.max(0, order.items.length - previewItems.length);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelectOrder(order)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectOrder(order);
        }
      }}
      className="rounded-xl border border-outline-variant/40  p-4 transition-all hover:border-primary/45 hover:shadow-xs space-y-4 cursor-pointer"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-on-surface">
            {order.orderCode}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            title={t('copyOrderCode')}
            className="inline-flex items-center justify-center text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <OrderStatusTag status={order.status} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${getPaymentStatusBadgeClass(
              order.paymentStatus
            )}`}
          >
            {paymentLabel}
          </span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {previewItems.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
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
              <p className="truncate text-sm font-semibold text-on-surface">
                {item.productName}
              </p>
              <p className="text-xs text-on-surface-variant">
                {item.variantName ? `${item.variantName} • ` : ''}
                x{item.quantity}
              </p>
            </div>

            <span className="shrink-0 text-sm font-semibold text-on-surface">
              {formatCurrency(item.totalItemPrice)}
            </span>
          </li>
        ))}
      </ul>

      {remainingCount > 0 && (
        <p className="text-xs font-medium text-on-surface-variant">
          {t('moreItems', { count: remainingCount })}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/50 pt-3">
        <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <Clock className="h-3.5 w-3.5 text-primary/70 shrink-0" />
          <span>{formattedDate}</span>
        </p>

        <div className="text-right ml-auto">
          <span className="text-xs text-on-surface-variant mr-1.5">
            {t('totalLabel')}:
          </span>
          <span className="font-heading text-base sm:text-lg font-bold text-primary">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
