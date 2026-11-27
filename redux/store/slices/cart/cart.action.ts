import { BasketApi } from '@/actions/basket';
import {
  BasketDto,
  BasketItemDto,
  BasketItemRequest,
  CheckoutResultDto,
  UpdateBasketRequest,
} from '@/interface/basket';
import { getErrorMessage } from '@/lib/helper';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  AddToBasketPayload,
  CartThunkConfig,
  CheckoutOptionsPayload,
  RemoveBasketItemPayload,
  UpdateCheckoutInfoPayload,
  UpdateItemQuantityPayload,
} from './cartSlice.reducer';

function mapItemsToRequests(items: BasketItemDto[]): BasketItemRequest[] {
  return items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
  }));
}

function buildUpdatePayload(
  basket: BasketDto,
  items: BasketItemRequest[],
  overrides?: Partial<UpdateCheckoutInfoPayload>
): UpdateBasketRequest {
  const fulfillmentType = overrides?.fulfillmentType ?? basket.fulfillmentType ?? 'Pickup';
  const isDelivery = fulfillmentType === 'Delivery';
  const resolvedStoreId =
    overrides?.storeId !== undefined ? overrides.storeId : basket.storeId ?? null;

  return {
    ...(resolvedStoreId && resolvedStoreId > 0 ? { storeId: resolvedStoreId } : {}),
    fulfillmentType,
    customerInfo:
      overrides?.customerInfo !== undefined ? overrides.customerInfo : basket.customerInfo,
    shippingInfo: isDelivery
      ? overrides?.shippingInfo !== undefined
        ? overrides.shippingInfo
        : basket.shippingInfo ?? null
      : null,
    paymentMethod:
      overrides?.paymentMethod !== undefined
        ? overrides.paymentMethod
        : basket.paymentMethod || 'COD',
    shippingMethod: isDelivery
      ? overrides?.shippingMethod !== undefined
        ? overrides.shippingMethod
        : basket.shippingMethod ?? null
      : null,
    items,
    note: overrides?.note !== undefined ? overrides.note : basket.note ?? null,
  };
}

async function resolveCurrentBasket(basket: BasketDto | null): Promise<BasketDto> {
  if (basket?.id) {
    return basket;
  }
  const response = await BasketApi.initOrGetBasket({});
  if (!response.data) {
    throw new Error('Empty basket response');
  }
  return response.data;
}

function unwrapData<T>(data: T | undefined, errorMessage: string): T {
  if (data === undefined || data === null) {
    throw new Error(errorMessage);
  }
  return data;
}

export const initBasketThunk = createAsyncThunk<BasketDto, void, CartThunkConfig>(
  'cart/initBasket',
  async (_, { rejectWithValue }) => {
    try {
      const response = await BasketApi.initOrGetBasket({});
      return unwrapData(response.data, 'Không thể tải giỏ hàng');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Không thể tải giỏ hàng'));
    }
  }
);

export const fetchBasketDetailThunk = createAsyncThunk<
  BasketDto,
  string | undefined,
  CartThunkConfig
>('cart/fetchBasketDetail', async (basketId, { getState, rejectWithValue }) => {
  try {
    const resolvedId = basketId ?? getState().cart.basket?.id;
    if (!resolvedId) {
      const initRes = await BasketApi.initOrGetBasket({});
      return unwrapData(initRes.data, 'Không thể tải giỏ hàng');
    }
    const response = await BasketApi.getBasketById(resolvedId);
    return unwrapData(response.data, 'Không thể làm mới giỏ hàng');
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Không thể làm mới giỏ hàng'));
  }
});

export const addItemsToBasketThunk = createAsyncThunk<
  BasketDto,
  AddToBasketPayload,
  CartThunkConfig
>('cart/addItemsToBasket', async ({ items, storeId }, { rejectWithValue }) => {
  try {
    const response = await BasketApi.initOrGetBasket({
      items,
      ...(storeId && storeId > 0 ? { storeId } : {}),
    });
    return unwrapData(response.data, 'Không thể thêm sản phẩm vào giỏ hàng');
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Không thể thêm sản phẩm vào giỏ hàng'));
  }
});

export const updateItemQuantityThunk = createAsyncThunk<
  BasketDto,
  UpdateItemQuantityPayload,
  CartThunkConfig
>(
  'cart/updateItemQuantity',
  async ({ productId, variantId, quantity }, { getState, rejectWithValue }) => {
    try {
      const currentBasket = await resolveCurrentBasket(getState().cart.basket);
      const nextItems = mapItemsToRequests(currentBasket.items).reduce<BasketItemRequest[]>(
        (acc, item) => {
          if (item.productId === productId && item.variantId === variantId) {
            if (quantity > 0) {
              acc.push({ ...item, quantity });
            }
            return acc;
          }
          acc.push(item);
          return acc;
        },
        []
      );

      const response = await BasketApi.updateBasket(
        currentBasket.id,
        buildUpdatePayload(currentBasket, nextItems)
      );
      return unwrapData(response.data, 'Không thể cập nhật số lượng');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Không thể cập nhật số lượng'));
    }
  }
);

export const removeBasketItemThunk = createAsyncThunk<
  BasketDto,
  RemoveBasketItemPayload,
  CartThunkConfig
>('cart/removeBasketItem', async ({ productId, variantId }, { getState, rejectWithValue }) => {
  try {
    const currentBasket = await resolveCurrentBasket(getState().cart.basket);
    const nextItems = mapItemsToRequests(currentBasket.items).filter(
      (item) => !(item.productId === productId && item.variantId === variantId)
    );

    const response = await BasketApi.updateBasket(
      currentBasket.id,
      buildUpdatePayload(currentBasket, nextItems)
    );
    return unwrapData(response.data, 'Không thể xóa sản phẩm khỏi giỏ hàng');
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Không thể xóa sản phẩm khỏi giỏ hàng'));
  }
});

export const updateCheckoutInfoThunk = createAsyncThunk<
  BasketDto,
  UpdateCheckoutInfoPayload,
  CartThunkConfig
>('cart/updateCheckoutInfo', async (payload, { getState, rejectWithValue }) => {
  try {
    const currentBasket = await resolveCurrentBasket(getState().cart.basket);
    const nextItems = mapItemsToRequests(currentBasket.items);
    const response = await BasketApi.updateBasket(
      currentBasket.id,
      buildUpdatePayload(currentBasket, nextItems, payload)
    );
    return unwrapData(response.data, 'Không thể cập nhật thông tin giao nhận');
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Không thể cập nhật thông tin giao nhận'));
  }
});

export const clearBasketThunk = createAsyncThunk<null, void, CartThunkConfig>(
  'cart/clearBasket',
  async (_, { getState, rejectWithValue }) => {
    try {
      const basketId = getState().cart.basket?.id;
      if (!basketId) {
        return null;
      }
      await BasketApi.clearBasket(basketId);
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Không thể xóa toàn bộ giỏ hàng'));
    }
  }
);

export const fetchCheckoutOptionsThunk = createAsyncThunk<
  CheckoutOptionsPayload,
  void,
  CartThunkConfig
>('cart/fetchCheckoutOptions', async (_, { rejectWithValue }) => {
  try {
    const [paymentRes, shippingRes] = await Promise.all([
      BasketApi.getPaymentMethods(true),
      BasketApi.getShippingMethods(true),
    ]);
    return {
      paymentMethods: paymentRes.data ?? [],
      shippingMethods: shippingRes.data ?? [],
    };
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, 'Không thể tải phương thức thanh toán và vận chuyển')
    );
  }
});

export const checkoutBasketThunk = createAsyncThunk<
  CheckoutResultDto,
  string | undefined,
  CartThunkConfig
>('cart/checkoutBasket', async (basketId, { getState, rejectWithValue }) => {
  try {
    const resolvedId = basketId ?? getState().cart.basket?.id;
    if (!resolvedId) {
      return rejectWithValue('Không tìm thấy giỏ hàng để đặt đơn');
    }
    const response = await BasketApi.checkoutBasket(resolvedId);
    return unwrapData(response.data, 'Đặt hàng không thành công');
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, 'Đặt hàng không thành công'));
  }
});

// Aliases
export const initBasket = initBasketThunk;
export const fetchBasketDetail = fetchBasketDetailThunk;
export const addItemsToBasket = addItemsToBasketThunk;
export const updateItemQuantity = updateItemQuantityThunk;
export const removeBasketItem = removeBasketItemThunk;
export const updateCheckoutInfo = updateCheckoutInfoThunk;
export const clearBasket = clearBasketThunk;
export const fetchCheckoutOptions = fetchCheckoutOptionsThunk;
export const checkoutBasket = checkoutBasketThunk;

