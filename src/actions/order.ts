import callApi, { ApiResponse } from '@/apis/handleApi';
import { ApiRouters } from '@/constants/api-routes';
import {
  CancelOrderRequest,
  OrderDto,
  OrderListParams,
  OrderListResponse,
  OrderSummaryDto,
  OrderTrackingDto,
  OrderTrackingRequest,
} from '@/interface/order';

export const OrderApi = {
  getOrders: async (
    params?: OrderListParams
  ): Promise<ApiResponse<OrderListResponse>> => {
    const url = ApiRouters.ORDERS;
    return callApi<OrderListResponse>(url, params);
  },

  getOrderSummary: async (params?: {
    keyword?: string;
  }): Promise<ApiResponse<OrderSummaryDto>> => {
    const url = `${ApiRouters.ORDERS}/summary`;
    return callApi<OrderSummaryDto>(url, params);
  },

  getOrderByCode: async (orderCode: string): Promise<ApiResponse<OrderDto>> => {
    const url = `${ApiRouters.ORDERS}/${orderCode}`;
    return callApi<OrderDto>(url);
  },

  cancelOrder: async (
    orderCode: string,
    payload: CancelOrderRequest
  ): Promise<ApiResponse<null>> => {
    const url = `${ApiRouters.ORDERS}/${orderCode}/cancel`;
    return callApi<null>(url, payload, 'patch');
  },

  trackOrder: async (
    payload: OrderTrackingRequest
  ): Promise<ApiResponse<OrderTrackingDto>> => {
    const url = `${ApiRouters.ORDERS}/tracking`;
    return callApi<OrderTrackingDto>(url, payload, 'post');
  },
};
