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

