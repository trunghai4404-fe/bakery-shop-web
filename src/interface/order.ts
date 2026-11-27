import { FulfillmentType } from './basket';
import { StoreDto } from './store';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'ReadyForPickup'
  | 'Shipping'
  | 'Completed'
  | 'Cancelled'
  | string;

export type PaymentStatus = 'Unpaid' | 'Paid' | 'Failed' | 'Refunded' | string;

export interface OrderCustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface OrderShippingAddress {
  address: string;
  provinceId: number;
  wardId: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  variantId: number;
  variantName: string;
  productImageUrl?: string | null;
  quantity: number;
  price: number;
  discountPrice: number;
  discountPercent: number;
  finalPrice: number;
  totalItemPrice: number;
}

export interface OrderDto {
  id: number;
  orderCode: string;
  userId?: string | null;
  sessionId?: string | null;
  fulfillmentType: FulfillmentType | string;
  customerInfo: OrderCustomerInfo;
  shippingAddress?: OrderShippingAddress | null;
  shippingMethodCode?: string | null;
  shippingMethodName?: string | null;
  shippingFee: number;
  shippingFeeNote?: string | null;
  paymentMethodCode: string;
  paymentMethodName: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  note?: string | null;
  cancelReason?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  store?: StoreDto | null;
  items: OrderItemDto[];
}

export interface OrderListParams {
  keyword?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentType?: FulfillmentType | string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface OrderListResponse {
  items: OrderDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface OrderSummaryDto {
  all: number;
  pending: number;
  confirmed: number;
  preparing: number;
  readyForPickup: number;
  shipping: number;
  completed: number;
  cancelled: number;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface OrderTrackingRequest {
  orderCode: string;
  phoneNumber: string;
}

export interface OrderTrackingDto {
  orderCode: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethodCode: string;
  paymentMethodName: string;
  shippingMethodCode?: string | null;
  shippingMethodName?: string | null;
  fulfillmentType: FulfillmentType | string;
  maskedCustomerName: string;
  maskedPhoneNumber: string;
  maskedAddress?: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  note?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  store?: StoreDto | null;
  items: OrderItemDto[];
}
