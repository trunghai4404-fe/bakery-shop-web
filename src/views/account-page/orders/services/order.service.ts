import { OrderStatusTab } from '../constants/order.constants';

export interface OrderFilterParams {
  status?: OrderStatusTab;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export const orderService = {
  // Phase 2: Wire to GET /api/v1/orders and GET /api/v1/orders/summary
  getOrdersPlaceholder: async () => {
    return {
      items: [],
      totalCount: 0,
    };
  },
};

