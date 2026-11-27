import { StoreDto } from './store';

export type FulfillmentType = 'Pickup' | 'Delivery';

export interface CustomerInfoDto {
  name: string;
  phone: string;
  email: string;
}

export interface ShippingInfoDto {
  address: string;
  provinceId: number;
  wardId: number;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BasketItemWarningDto {
  code: 'OUT_OF_STOCK' | 'INACTIVE' | 'PRICE_CHANGED' | string;
  message: string;
}

export interface BasketItemDto {
  productId: number;
  productName: string;
  variantId: number;
  variantName: string;
  quantity: number;
  price: number;
  discountPrice: number;
  discountPercent: number;
  finalPrice: number;
  promotion?: Record<string, unknown> | null;
  gifts?: unknown[] | null;
  warnings?: BasketItemWarningDto[] | null;
  imageUrl?: string | null;
}

export interface BasketDto {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  storeId?: number | null;
  fulfillmentType: FulfillmentType | string;
  customerInfo: CustomerInfoDto;
  shippingInfo?: ShippingInfoDto | null;
  paymentMethod: string;
  shippingMethod?: string | null;
  items: BasketItemDto[];
  subtotal: number;
  note?: string | null;
  expiresAt: string;
  hasWarnings: boolean;
}

export interface BasketItemRequest {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CreateBasketRequest {
  storeId?: number | null;
  fulfillmentType?: FulfillmentType | string | null;
  paymentMethod?: string | null;
  shippingMethod?: string | null;
  items?: BasketItemRequest[] | null;
  note?: string | null;
}

export interface UpdateBasketRequest {
  storeId?: number | null;
  fulfillmentType: FulfillmentType | string;
  customerInfo?: CustomerInfoDto | null;
  shippingInfo?: ShippingInfoDto | null;
  paymentMethod?: string | null;
  shippingMethod?: string | null;
  items: BasketItemRequest[];
  note?: string | null;
}

export interface CheckoutResultDto {
  orderCode: string;
  totalAmount: number;
  paymentStatus: 'Unpaid' | 'Paid' | 'Failed' | 'Refunded' | string;
  store?: StoreDto | null;
}

export interface PaymentMethodDto {
  code: string;
  name: string;
  description: string;
  iconUrl?: string | null;
  isEnabled: boolean;
}

export interface ShippingMethodDto {
  code: string;
  name: string;
  fee: number;
  feeDescription?: string | null;
  estimatedDeliveryTime?: string | null;
  isEnabled: boolean;
}

