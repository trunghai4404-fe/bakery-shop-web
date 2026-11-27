import callApi, { ApiResponse } from '@/apis/handleApi';
import { ApiRouters } from '@/constants/api-routes';
import {
  BasketDto,
  CheckoutResultDto,
  CreateBasketRequest,
  PaymentMethodDto,
  ShippingMethodDto,
  UpdateBasketRequest,
} from '@/interface/basket';

export const BasketApi = {
  initOrGetBasket: async (
    payload: CreateBasketRequest = {}
  ): Promise<ApiResponse<BasketDto>> => {
    const url = ApiRouters.BASKET;
    return callApi<BasketDto>(url, payload, 'post');
  },

  getBasketById: async (basketId: string): Promise<ApiResponse<BasketDto>> => {
    const url = `${ApiRouters.BASKET}/${basketId}`;
    return callApi<BasketDto>(url);
  },

  updateBasket: async (
    basketId: string,
    payload: UpdateBasketRequest
  ): Promise<ApiResponse<BasketDto>> => {
    const url = `${ApiRouters.BASKET}/${basketId}`;
    return callApi<BasketDto>(url, payload, 'put');
  },

  clearBasket: async (basketId: string): Promise<ApiResponse<null>> => {
    const url = `${ApiRouters.BASKET}/${basketId}`;
    return callApi<null>(url, undefined, 'delete');
  },

  checkoutBasket: async (
    basketId: string
  ): Promise<ApiResponse<CheckoutResultDto>> => {
    const url = `${ApiRouters.BASKET}/${basketId}/checkout`;
    return callApi<CheckoutResultDto>(url, undefined, 'post');
  },

  getPaymentMethods: async (
    onlyActive = true
  ): Promise<ApiResponse<PaymentMethodDto[]>> => {
    const url = ApiRouters.PAYMENT_METHODS;
    return callApi<PaymentMethodDto[]>(url, {
      onlyActive,
    });
  },

  getShippingMethods: async (
    onlyActive = true
  ): Promise<ApiResponse<ShippingMethodDto[]>> => {
    const url = ApiRouters.SHIPPING_METHODS;
    return callApi<ShippingMethodDto[]>(url, {
      onlyActive,
    });
  },
};

