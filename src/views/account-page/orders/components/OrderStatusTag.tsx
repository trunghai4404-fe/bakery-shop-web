'use client';

import { OrderStatus } from '@/interface/order';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import {
  getOrderStatusBadgeClass,
  ORDER_API_STATUS_TO_TAB,
} from '../constants/order.constants';

interface OrderStatusTagProps {
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusTag({
  status,
  className,
}: OrderStatusTagProps) {
  const t = useTranslations('Account.orders');
  const statusTab = ORDER_API_STATUS_TO_TAB[status];
  const statusLabel = statusTab ? t(`status.${statusTab}`) : status;

  return (
    <span
      className={cn(
        'rounded-sm border px-2 py-0.5 text-xs font-bold',
        getOrderStatusBadgeClass(status),
        className
      )}
    >
      {statusLabel}
    </span>
  );
}
