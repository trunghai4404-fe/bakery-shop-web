'use client';

import { showCustomToast } from '@/components/toast/CustomToast';
import { ROUTES } from '@/constants/routes-path';
import { Link, useRouter } from '@/i18n/routing';
import { SavedAddress } from '@/interface/address';
import { User } from '@/interface/auth';
import { BasketDto, PaymentMethodDto, ShippingMethodDto } from '@/interface/basket';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
  selectBasket,
  selectCartLoading,
  selectCartMutating,
  selectCheckingOut,
  selectLastCheckoutResult,
  selectOptionsLoading,
  selectPaymentMethods,
  selectShippingMethods,
} from '@/redux/store/slices/cart/cartSlice.reducer';
import {
  checkoutBasketThunk,
  fetchBasketDetailThunk,
  fetchCheckoutOptionsThunk,
  updateCheckoutInfoThunk,
} from '@/redux/store/slices/cart/cart.action';
import { addressService } from '@/views/account-page/addresses/services/address.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLoading } from '@/context/LoadingContext';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import CheckoutCustomerInfo from './components/CheckoutCustomerInfo';
import CheckoutFulfillmentTabs from './components/CheckoutFulfillmentTabs';
import CheckoutPaymentSection from './components/CheckoutPaymentSection';
import CheckoutStoreSelector from './components/CheckoutStoreSelector';
import CheckoutSummary from './components/CheckoutSummary';
import { persistCheckoutResult } from './constants/checkout.constants';
import { useCheckoutStores } from './hooks/useCheckoutStores';
import { CheckoutFormValues, createCheckoutSchema } from './schemas/checkout.schema';

const emptySubscribe = () => () => { };

interface CheckoutFormContentProps {
  basket: BasketDto;
  user: User | null;
  savedAddresses: SavedAddress[];
  paymentMethods: PaymentMethodDto[];
  shippingMethods: ShippingMethodDto[];
  optionsLoading: boolean;
  isSubmitting: boolean;
}

function CheckoutFormContent({
  basket,
  user,
  savedAddresses,
  paymentMethods,
  shippingMethods,
  optionsLoading,
  isSubmitting,
}: CheckoutFormContentProps) {
  const t = useTranslations('Checkout');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const defaultSavedAddress = useMemo(
    () => savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0] ?? null,
    [savedAddresses]
  );

  const codPaymentMethods = useMemo(() => {
    const filtered = paymentMethods.filter(
      (m) => m.code.toUpperCase() === 'COD' && m.isEnabled
    );
    if (filtered.length > 0) return filtered;
    return [
      {
        code: 'COD',
        name: t('codMethodTitle'),
        description: '',
        isEnabled: true,
      },
    ];
  }, [paymentMethods, t]);

  const activeShippingMethods = useMemo(
    () => shippingMethods.filter((m) => m.isEnabled),
    [shippingMethods]
  );

  const initialFulfillmentType: 'Pickup' | 'Delivery' =
    basket.fulfillmentType === 'Delivery'
      ? 'Delivery'
      : basket.fulfillmentType === 'Pickup' && !defaultSavedAddress
        ? 'Pickup'
        : defaultSavedAddress
          ? 'Delivery'
          : 'Pickup';

  const initialShippingMethod =
    basket.shippingMethod || activeShippingMethods[0]?.code || '';

  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(
    !basket.shippingInfo?.address && defaultSavedAddress ? defaultSavedAddress.id : null
  );

  const schema = useMemo(() => createCheckoutSchema((key) => t(key)), [t]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fulfillmentType: initialFulfillmentType,
      storeId: basket.storeId && basket.storeId > 0 ? basket.storeId : 0,
      customerName:
        basket.customerInfo?.name ||
        defaultSavedAddress?.recipientName ||
        user?.fullName ||
        '',
      customerPhone:
        basket.customerInfo?.phone ||
        defaultSavedAddress?.phoneNumber ||
        user?.phoneNumber ||
        '',
      customerEmail: basket.customerInfo?.email || user?.email || '',
      shippingMethod: initialShippingMethod,
      paymentMethod: codPaymentMethods[0]?.code || 'COD',
      provinceId: basket.shippingInfo?.provinceId || defaultSavedAddress?.provinceId || 0,
      wardId: basket.shippingInfo?.wardId || defaultSavedAddress?.wardId || 0,
      address: basket.shippingInfo?.address || defaultSavedAddress?.address || '',
      latitude: basket.shippingInfo?.latitude ?? defaultSavedAddress?.latitude ?? null,
      longitude: basket.shippingInfo?.longitude ?? defaultSavedAddress?.longitude ?? null,
      note: basket.note || '',
    },
  });

  const fulfillmentType = useWatch({ control, name: 'fulfillmentType' });
  const selectedStoreId = useWatch({ control, name: 'storeId' });
  const selectedShippingMethodCode = useWatch({ control, name: 'shippingMethod' });
  const provinceId = useWatch({ control, name: 'provinceId' });
  const wardId = useWatch({ control, name: 'wardId' });
  const address = useWatch({ control, name: 'address' });
  const latitude = useWatch({ control, name: 'latitude' });
  const longitude = useWatch({ control, name: 'longitude' });

  const { stores, loadingStores, errorStores, refetchStores } = useCheckoutStores({
    lat: fulfillmentType === 'Delivery' ? latitude : null,
    long: fulfillmentType === 'Delivery' ? longitude : null,
  });

  useEffect(() => {
    if (stores.length === 0) return;

    if (selectedStoreId > 0 && stores.some((s) => s.id === selectedStoreId)) {
      return;
    }

    if (basket.storeId && stores.some((s) => s.id === basket.storeId)) {
      setValue('storeId', basket.storeId, { shouldValidate: true });
      return;
    }

    setValue('storeId', stores[0].id, { shouldValidate: true });
  }, [stores, basket.storeId, selectedStoreId, setValue]);

  const resolvedShippingMethod = useMemo(() => {
    if (fulfillmentType !== 'Delivery') return undefined;
    return (
      activeShippingMethods.find((m) => m.code === selectedShippingMethodCode) ??
      activeShippingMethods[0]
    );
  }, [activeShippingMethods, fulfillmentType, selectedShippingMethodCode]);

  const hasBlockingWarning = basket.items.some((item) =>
    (item.warnings ?? []).some((w) => w.code === 'OUT_OF_STOCK' || w.code === 'INACTIVE')
  );

  const handleSelectSavedAddress = (addr: SavedAddress | null) => {
    if (!addr) {
      setSelectedSavedAddressId(null);
      setValue('provinceId', 0);
      setValue('wardId', 0);
      setValue('address', '');
      setValue('latitude', null);
      setValue('longitude', null);
      return;
    }

    setSelectedSavedAddressId(addr.id);
    setValue('customerName', addr.recipientName, { shouldValidate: true });
    setValue('customerPhone', addr.phoneNumber, { shouldValidate: true });
    setValue('provinceId', addr.provinceId, { shouldValidate: true });
    setValue('wardId', addr.wardId, { shouldValidate: true });
    setValue('address', addr.address, { shouldValidate: true });
    setValue('latitude', addr.latitude ?? null);
    setValue('longitude', addr.longitude ?? null);
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    const isDelivery = values.fulfillmentType === 'Delivery';
    const shippingCode = isDelivery
      ? values.shippingMethod || activeShippingMethods[0]?.code || null
      : null;

    showLoading('Đang xử lý đơn hàng...');

    const updateResult = await dispatch(
      updateCheckoutInfoThunk({
        storeId: values.storeId,
        fulfillmentType: values.fulfillmentType,
        customerInfo: {
          name: values.customerName.trim(),
          phone: values.customerPhone.trim(),
          email: values.customerEmail.trim(),
        },
        shippingInfo: isDelivery
          ? {
            address: values.address.trim(),
            provinceId: values.provinceId,
            wardId: values.wardId,
            latitude: values.latitude ?? null,
            longitude: values.longitude ?? null,
          }
          : null,
        paymentMethod: 'COD',
        shippingMethod: shippingCode,
        note: values.note?.trim() || null,
      })
    );

    if (updateCheckoutInfoThunk.rejected.match(updateResult)) {
      hideLoading();
      showCustomToast({
        message: updateResult.payload || t('updateFailed'),
        type: 'error',
      });
      return;
    }

    const updatedBasket = updateResult.payload;
    const updatedHasBlocking = updatedBasket.items.some((item) =>
      (item.warnings ?? []).some((w) => w.code === 'OUT_OF_STOCK' || w.code === 'INACTIVE')
    );

    if (updatedHasBlocking) {
      hideLoading();
      showCustomToast({
        message: t('blockingWarningError'),
        type: 'error',
      });
      return;
    }

    showLoading('Đang hoàn tất đặt hàng...');
    const checkoutResult = await dispatch(checkoutBasketThunk(updatedBasket.id));
    if (checkoutBasketThunk.fulfilled.match(checkoutResult)) {
      persistCheckoutResult(checkoutResult.payload);
      showLoading('Đặt hàng thành công, đang chuyển trang...');
      showCustomToast({
        message: t('orderPlacedSuccess'),
        type: 'success',
      });
      router.replace(ROUTES.CHECKOUT_SUCCESS);
    } else {
      hideLoading();
      showCustomToast({
        message: checkoutResult.payload || t('checkoutFailed'),
        type: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <CheckoutFulfillmentTabs
            value={fulfillmentType}
            onChange={(val) => setValue('fulfillmentType', val)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <CheckoutCustomerInfo
            fulfillmentType={fulfillmentType}
            register={register}
            errors={errors}
            savedAddresses={savedAddresses}
            selectedSavedAddressId={selectedSavedAddressId}
            provinceId={provinceId}
            wardId={wardId}
            address={address}
            onSelectSavedAddress={handleSelectSavedAddress}
            onProvinceChange={(id) => {
              setSelectedSavedAddressId(null);
              setValue('provinceId', id, { shouldValidate: true });
              setValue('wardId', 0, { shouldValidate: true });
            }}
            onWardChange={(id) => {
              setSelectedSavedAddressId(null);
              setValue('wardId', id, { shouldValidate: true });
            }}
            onAddressChange={(val) => {
              setSelectedSavedAddressId(null);
              setValue('address', val, { shouldValidate: true });
            }}
          />

          <CheckoutStoreSelector
            fulfillmentType={fulfillmentType}
            stores={stores}
            loadingStores={loadingStores}
            errorStores={errorStores}
            selectedStoreId={selectedStoreId}
            onSelectStore={(id) => setValue('storeId', id, { shouldValidate: true })}
            onRetry={refetchStores}
            error={errors.storeId?.message}
          />

          <CheckoutPaymentSection
            fulfillmentType={fulfillmentType}
            paymentMethods={codPaymentMethods}
            shippingMethods={activeShippingMethods}
            selectedShippingMethodCode={resolvedShippingMethod?.code ?? ''}
            optionsLoading={optionsLoading}
            onShippingMethodChange={(code) => setValue('shippingMethod', code)}
            register={register}
            errors={errors}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <CheckoutSummary
            items={basket.items}
            subtotal={basket.subtotal}
            shippingFee={resolvedShippingMethod?.fee ?? 0}
            fulfillmentType={fulfillmentType}
            hasWarnings={basket.hasWarnings}
            hasBlockingWarning={hasBlockingWarning}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}

export default function CheckoutView() {
  const t = useTranslations('Checkout');
  const dispatch = useAppDispatch();

  const basket = useAppSelector(selectBasket);
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector(selectCartLoading);
  const mutating = useAppSelector(selectCartMutating);
  const checkingOut = useAppSelector(selectCheckingOut);
  const optionsLoading = useAppSelector(selectOptionsLoading);
  const paymentMethods = useAppSelector(selectPaymentMethods);
  const shippingMethods = useAppSelector(selectShippingMethods);
  const lastCheckoutResult = useAppSelector(selectLastCheckoutResult);
  const { isLoading } = useLoading();

  const isClientMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const optionsLoadedRef = useRef(false);
  const revalidatedBasketRef = useRef<string | null>(null);

  useEffect(() => {
    if (!optionsLoadedRef.current) {
      optionsLoadedRef.current = true;
      dispatch(fetchCheckoutOptionsThunk());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!basket?.id || revalidatedBasketRef.current === basket.id) return;
    revalidatedBasketRef.current = basket.id;
    dispatch(fetchBasketDetailThunk(basket.id));
  }, [dispatch, basket?.id]);

  const userId = user?.id ?? null;

  const savedAddresses = useMemo(() => {
    if (!isClientMounted || !userId) return [];
    return addressService.getAll(userId);
  }, [isClientMounted, userId]);

  if ((loading && !basket) || !isClientMounted) {
    return (
      <section className="container-page py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-on-surface-variant">{t('loadingCheckout')}</p>
      </section>
    );
  }

  if (lastCheckoutResult || (isLoading && (!basket || basket.items.length === 0))) {
    return (
      <section className="min-h-[50vh] py-16 flex items-center justify-center">
      </section>
    );
  }

  return (
    <section className="py-4">
      {!basket || basket.items.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest py-16 px-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-pale/70 text-primary">
            <ShoppingBag className="h-10 w-10 stroke-[1.6]" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h2 className="font-heading text-xl font-bold text-on-surface">
              {t('emptyBasketTitle')}
            </h2>
            <p className="text-sm text-on-surface-variant">{t('emptyBasketDesc')}</p>
          </div>
          <Link
            href={ROUTES.PRODUCT_LIST}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors"
          >
            <span>{t('shopNowButton')}</span>
          </Link>
        </div>
      ) : (
        <CheckoutFormContent
          key={`${basket.id}-${user?.id ?? 'guest'}`}
          basket={basket}
          user={user}
          savedAddresses={savedAddresses}
          paymentMethods={paymentMethods}
          shippingMethods={shippingMethods}
          optionsLoading={optionsLoading}
          isSubmitting={checkingOut || mutating}
        />
      )}
    </section>
  );
}
