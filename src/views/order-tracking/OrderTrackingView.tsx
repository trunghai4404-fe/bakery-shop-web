'use client';

import { OrderApi } from '@/actions/order';
import { Input } from '@/components/ui/input';
import { appImages } from '@/constants/appInfo';
import { OrderDto, OrderTrackingDto } from '@/interface/order';
import { getErrorMessage } from '@/lib/helper';
import OrderDetailView from '@/views/account-page/orders/components/OrderDetailView';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createOrderTrackingSchema,
  OrderTrackingFormValues,
} from './schemas/orderTracking.schema';

function mapTrackingToOrderDto(dto: OrderTrackingDto): OrderDto {
  return {
    id: 0,
    orderCode: dto.orderCode,
    fulfillmentType: dto.fulfillmentType,
    customerInfo: {
      name: dto.maskedCustomerName,
      phone: dto.maskedPhoneNumber,
      email: '',
    },
    shippingAddress: dto.maskedAddress
      ? {
        address: dto.maskedAddress,
        provinceId: 0,
        wardId: 0,
      }
      : null,
    shippingMethodCode: dto.shippingMethodCode,
    shippingMethodName: dto.shippingMethodName,
    shippingFee: dto.shippingFee,
    paymentMethodCode: dto.paymentMethodCode,
    paymentMethodName: dto.paymentMethodName,
    paymentStatus: dto.paymentStatus,
    status: dto.status,
    subtotal: dto.subtotal,
    discountAmount: 0,
    totalAmount: dto.totalAmount,
    note: dto.note,
    cancelReason: dto.cancelReason,
    createdAt: dto.createdAt,
    store: dto.store,
    items: dto.items,
  };
}

export default function OrderTrackingView() {
  const t = useTranslations('OrderTracking');
  const searchParams = useSearchParams();

  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trackingResult, setTrackingResult] = useState<OrderTrackingDto | null>(null);

  const schema = useMemo(() => createOrderTrackingSchema((key) => t(key)), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderTrackingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderCode: searchParams.get('orderCode') ?? searchParams.get('code') ?? '',
      phoneNumber: searchParams.get('phoneNumber') ?? searchParams.get('phone') ?? '',
    },
  });

  const onSubmit = async (values: OrderTrackingFormValues) => {
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const res = await OrderApi.trackOrder({
        orderCode: values.orderCode.trim(),
        phoneNumber: values.phoneNumber.trim(),
      });
      if (!res.data) {
        setTrackingResult(null);
        setErrorMessage(t('notFoundFallback'));
        return;
      }
      setTrackingResult(res.data);
    } catch (error) {
      setTrackingResult(null);
      setErrorMessage(getErrorMessage(error, t('notFoundFallback')));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="py-6 sm:py-10 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            {t('title')}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface">
                {t('orderCodeLabel')} <span className="text-error">*</span>
              </label>
              <Input
                {...register('orderCode')}
                placeholder={t('orderCodePlaceholder')}
                className="h-11 bg-surface border-outline-variant/60 font-mono uppercase placeholder:normal-case placeholder:text-on-surface-variant/45 focus-visible:border-primary focus-visible:ring-primary/15"
              />
              {errors.orderCode && (
                <p className="text-xs font-medium text-error">{errors.orderCode.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface">
                {t('phoneLabel')} <span className="text-error">*</span>
              </label>
              <Input
                {...register('phoneNumber')}
                placeholder={t('phonePlaceholder')}
                className="h-11 bg-surface border-outline-variant/60 placeholder:text-on-surface-variant/45 focus-visible:border-primary focus-visible:ring-primary/15"
              />
              {errors.phoneNumber && (
                <p className="text-xs font-medium text-error">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-6 py-3 text-sm font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('searching')}</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>{t('searchButton')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="rounded-xl border border-error/30 bg-error/5 px-4 py-3.5 flex items-center gap-2.5 text-sm text-error">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}
      </div>

      {trackingResult && (
        <OrderDetailView
          key={trackingResult.orderCode}
          orderCode={trackingResult.orderCode}
          initialOrder={mapTrackingToOrderDto(trackingResult)}
          allowCancel={false}
          skipFetch={true}
        />
      )}
    </section>
  );
}
