import {
  BasketDto,
  BasketItemRequest,
  CheckoutResultDto,
  CustomerInfoDto,
  FulfillmentType,
  PaymentMethodDto,
  ShippingInfoDto,
  ShippingMethodDto,
} from '@/interface/basket';
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../stores';
import {
  addItemsToBasketThunk,
  checkoutBasketThunk,
  clearBasketThunk,
  fetchBasketDetailThunk,
  fetchCheckoutOptionsThunk,
  initBasketThunk,
  removeBasketItemThunk,
  updateCheckoutInfoThunk,
  updateItemQuantityThunk,
} from './cart.action';

export interface CartState {
  basket: BasketDto | null;
  paymentMethods: PaymentMethodDto[];
  shippingMethods: ShippingMethodDto[];
  lastCheckoutResult: CheckoutResultDto | null;
  isDrawerOpen: boolean;
  loading: boolean;
  mutating: boolean;
  checkingOut: boolean;
  optionsLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface CartThunkConfig {
  state: {
    cart: CartState;
  };
  rejectValue: string;
}

export interface AddToBasketPayload {
  items: BasketItemRequest[];
  storeId?: number | null;
  openDrawer?: boolean;
}

export interface UpdateItemQuantityPayload {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface RemoveBasketItemPayload {
  productId: number;
  variantId: number;
}

export interface UpdateCheckoutInfoPayload {
  storeId?: number | null;
  fulfillmentType: FulfillmentType | string;
  customerInfo?: CustomerInfoDto | null;
  shippingInfo?: ShippingInfoDto | null;
  paymentMethod?: string | null;
  shippingMethod?: string | null;
  note?: string | null;
}

export interface CheckoutOptionsPayload {
  paymentMethods: PaymentMethodDto[];
  shippingMethods: ShippingMethodDto[];
}

export const initialCartState: CartState = {
  basket: null,
  paymentMethods: [],
  shippingMethods: [],
  lastCheckoutResult: null,
  isDrawerOpen: false,
  loading: false,
  mutating: false,
  checkingOut: false,
  optionsLoading: false,
  error: null,
  initialized: false,
};

const mutationPendingMatcher = isAnyOf(
  addItemsToBasketThunk.pending,
  updateItemQuantityThunk.pending,
  removeBasketItemThunk.pending,
  updateCheckoutInfoThunk.pending
);

const mutationFulfilledMatcher = isAnyOf(
  updateItemQuantityThunk.fulfilled,
  removeBasketItemThunk.fulfilled,
  updateCheckoutInfoThunk.fulfilled
);

const mutationRejectedMatcher = isAnyOf(
  addItemsToBasketThunk.rejected,
  updateItemQuantityThunk.rejected,
  removeBasketItemThunk.rejected,
  updateCheckoutInfoThunk.rejected
);

const readPendingMatcher = isAnyOf(
  initBasketThunk.pending,
  fetchBasketDetailThunk.pending,
  clearBasketThunk.pending
);

const readRejectedMatcher = isAnyOf(
  initBasketThunk.rejected,
  fetchBasketDetailThunk.rejected,
  clearBasketThunk.rejected
);

function setBasketFulfilled(state: CartState, basket: BasketDto) {
  state.basket = basket;
  state.loading = false;
  state.mutating = false;
  state.error = null;
  state.initialized = true;
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    setCartDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    clearCartError: (state) => {
      state.error = null;
    },
    setLastCheckoutResult: (state, action: PayloadAction<CheckoutResultDto | null>) => {
      state.lastCheckoutResult = action.payload;
    },
    resetCartState: () => initialCartState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initBasketThunk.fulfilled, (state, action) => {
        setBasketFulfilled(state, action.payload);
      })
      .addCase(fetchBasketDetailThunk.fulfilled, (state, action) => {
        setBasketFulfilled(state, action.payload);
      })
      .addCase(addItemsToBasketThunk.fulfilled, (state, action) => {
        setBasketFulfilled(state, action.payload);
        if (action.meta.arg.openDrawer ?? true) {
          state.isDrawerOpen = true;
        }
      })
      .addCase(clearBasketThunk.fulfilled, (state) => {
        state.basket = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCheckoutOptionsThunk.pending, (state) => {
        state.optionsLoading = true;
      })
      .addCase(fetchCheckoutOptionsThunk.fulfilled, (state, action) => {
        state.paymentMethods = action.payload.paymentMethods;
        state.shippingMethods = action.payload.shippingMethods;
        state.optionsLoading = false;
      })
      .addCase(fetchCheckoutOptionsThunk.rejected, (state, action) => {
        state.optionsLoading = false;
        state.error = action.payload ?? 'Không thể tải phương thức thanh toán và vận chuyển';
      })
      .addCase(checkoutBasketThunk.pending, (state) => {
        state.checkingOut = true;
        state.error = null;
      })
      .addCase(checkoutBasketThunk.fulfilled, (state, action) => {
        state.checkingOut = false;
        state.lastCheckoutResult = action.payload;
        state.basket = null;
        state.isDrawerOpen = false;
        state.error = null;
      })
      .addCase(checkoutBasketThunk.rejected, (state, action) => {
        state.checkingOut = false;
        state.error = action.payload ?? 'Đặt hàng không thành công';
      })
      .addMatcher(readPendingMatcher, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(readRejectedMatcher, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload ?? 'Đã có lỗi xảy ra với giỏ hàng';
      })
      .addMatcher(mutationPendingMatcher, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addMatcher(mutationFulfilledMatcher, (state, action) => {
        setBasketFulfilled(state, action.payload);
      })
      .addMatcher(mutationRejectedMatcher, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? 'Không thể cập nhật giỏ hàng';
      });
  },
});

const { actions, reducer } = cartSlice;

export const {
  openCartDrawer,
  closeCartDrawer,
  setCartDrawerOpen,
  clearCartError,
  setLastCheckoutResult,
  resetCartState,
} = actions;

// Selectors
export const selectCartState = (state: RootState) => state.cart;
export const selectBasket = (state: RootState) => state.cart.basket;
export const selectCartItems = (state: RootState) => state.cart.basket?.items ?? [];
export const selectCartTotalQuantity = (state: RootState) =>
  (state.cart.basket?.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state: RootState) => state.cart.basket?.subtotal ?? 0;
export const selectCartHasWarnings = (state: RootState) =>
  Boolean(state.cart.basket?.hasWarnings);
export const selectIsCartDrawerOpen = (state: RootState) => state.cart.isDrawerOpen;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartMutating = (state: RootState) => state.cart.mutating;
export const selectCheckingOut = (state: RootState) => state.cart.checkingOut;
export const selectPaymentMethods = (state: RootState) => state.cart.paymentMethods;
export const selectShippingMethods = (state: RootState) => state.cart.shippingMethods;
export const selectOptionsLoading = (state: RootState) => state.cart.optionsLoading;
export const selectLastCheckoutResult = (state: RootState) => state.cart.lastCheckoutResult;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartInitialized = (state: RootState) => state.cart.initialized;

export default reducer;

