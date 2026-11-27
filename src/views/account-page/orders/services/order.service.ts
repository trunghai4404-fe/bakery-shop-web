import { OrderApi } from '@/actions/order';
import {
  CancelOrderRequest,
  OrderDto,
  OrderListResponse,
  OrderSummaryDto,
} from '@/interface/order';
import { ORDER_TAB_TO_API_STATUS, OrderStatusTab } from '../constants/order.constants';

export interface OrderFilterParams {
  status?: OrderStatusTab;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export const orderService = {
  getOrders: async ({
    status = 'all',
    keyword,
    page = 1,
    pageSize = 10,
  }: OrderFilterParams = {}): Promise<OrderListResponse> => {
    const trimmedKeyword = keyword?.trim();
    const apiStatus = status !== 'all' ? ORDER_TAB_TO_API_STATUS[status] : undefined;
    const res = await OrderApi.getOrders({
      ...(trimmedKeyword ? { keyword: trimmedKeyword } : {}),
      ...(apiStatus ? { status: apiStatus } : {}),
      page,
      pageSize,
    });

    return (
      res.data ?? {
        items: [],
        page,
        pageSize,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  },

  getOrderSummary: async (keyword?: string): Promise<OrderSummaryDto | null> => {
    const trimmedKeyword = keyword?.trim();
    const res = await OrderApi.getOrderSummary(
      trimmedKeyword ? { keyword: trimmedKeyword } : undefined
    );
    return res.data ?? null;
  },

  getOrderDetail: async (orderCode: string): Promise<OrderDto | null> => {
    const res = await OrderApi.getOrderByCode(orderCode);
    return res.data ?? null;
  },

  cancelOrder: async (
    orderCode: string,
    payload: CancelOrderRequest
  ): Promise<void> => {
    await OrderApi.cancelOrder(orderCode, payload);
  },
};
