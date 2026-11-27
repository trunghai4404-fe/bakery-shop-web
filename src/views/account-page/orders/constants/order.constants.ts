import { OrderStatus, PaymentStatus } from '@/interface/order';

export const ORDER_STATUS_TABS = [
  'all',
  'pending',
  'confirmed',
  'preparing',
  'readyForPickup',
  'shipping',
  'completed',
  'cancelled',
] as const;

export type OrderStatusTab = (typeof ORDER_STATUS_TABS)[number];

export const ORDER_TAB_TO_API_STATUS: Record<
  Exclude<OrderStatusTab, 'all'>,
  OrderStatus
> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  readyForPickup: 'ReadyForPickup',
  shipping: 'Shipping',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const ORDER_API_STATUS_TO_TAB: Record<string, OrderStatusTab> = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  Preparing: 'preparing',
  ReadyForPickup: 'readyForPickup',
  Shipping: 'shipping',
  Completed: 'completed',
  Cancelled: 'cancelled',
};

export const DELIVERY_ORDER_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Shipping',
  'Completed',
];

export const PICKUP_ORDER_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'ReadyForPickup',
  'Completed',
];

export function getOrderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Shipping':
    case 'ReadyForPickup':
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'Preparing':
    case 'Confirmed':
      return 'bg-amber-100 text-amber-900 border-amber-200';
    default:
      return 'bg-rose-pale/60 text-primary border-primary/20';
  }
}

export function getPaymentStatusBadgeClass(status: PaymentStatus): string {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    case 'Refunded':
      return 'bg-slate-100 text-slate-800';
    default:
      return 'bg-amber-100 text-amber-900';
  }
}
