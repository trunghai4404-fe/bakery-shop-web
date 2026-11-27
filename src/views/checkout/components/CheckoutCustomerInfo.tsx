'use client';

import { Input } from '@/components/ui/input';
import { SavedAddress } from '@/interface/address';
import { FulfillmentType } from '@/interface/basket';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { CheckoutFormValues } from '../schemas/checkout.schema';
import CheckoutAddressSelector from './CheckoutAddressSelector';

interface CheckoutCustomerInfoProps {
  fulfillmentType: FulfillmentType;
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
  savedAddresses: SavedAddress[];
  selectedSavedAddressId: string | null;
  provinceId: number;
  wardId: number;
  address: string;
  onSelectSavedAddress: (addr: SavedAddress | null) => void;
  onProvinceChange: (provinceId: number) => void;
  onWardChange: (wardId: number) => void;
  onAddressChange: (address: string) => void;
}

export default function CheckoutCustomerInfo({
  fulfillmentType,
  register,
  errors,
  savedAddresses,
  selectedSavedAddressId,
  provinceId,
  wardId,
  address,
  onSelectSavedAddress,
  onProvinceChange,
  onWardChange,
  onAddressChange,
}: CheckoutCustomerInfoProps) {
  const t = useTranslations('Checkout');

  return (
    <div className="relative z-20 rounded-lg border border-outline-variant/35 bg-surface-container-lowest p-4 shadow-2xs">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <h2 className="font-heading text-lg font-bold text-on-surface">
            {t('customerInfoTitle')}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface">
                {t('customerNameLabel')} <span className="text-error">*</span>
              </label>
              <Input
                {...register('customerName')}
                placeholder={t('customerNamePlaceholder')}
                className="h-10 bg-surface border-outline-variant/60 focus-visible:border-primary focus-visible:ring-primary/15"
              />
              {errors.customerName && (
                <p className="text-xs font-medium text-error">{errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-on-surface">
                {t('customerPhoneLabel')} <span className="text-error">*</span>
              </label>
              <Input
                {...register('customerPhone')}
                placeholder={t('customerPhonePlaceholder')}
                className="h-10 bg-surface border-outline-variant/60 focus-visible:border-primary focus-visible:ring-primary/15"
              />
              {errors.customerPhone && (
                <p className="text-xs font-medium text-error">{errors.customerPhone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface">
              {t('customerEmailLabel')}
            </label>
            <Input
              type="email"
              {...register('customerEmail')}
              placeholder={t('customerEmailPlaceholder')}
              className="h-10 bg-surface border-outline-variant/60 focus-visible:border-primary focus-visible:ring-primary/15"
            />
            {errors.customerEmail && (
              <p className="text-xs font-medium text-error">{errors.customerEmail.message}</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {fulfillmentType === 'Delivery' && (
          <motion.div
            key="checkout-delivery-address"
            initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
            animate={{
              height: 'auto',
              opacity: 1,
              transitionEnd: { overflow: 'visible' },
            }}
            exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pt-4">
              <CheckoutAddressSelector
                savedAddresses={savedAddresses}
                selectedSavedAddressId={selectedSavedAddressId}
                provinceId={provinceId}
                wardId={wardId}
                address={address}
                errors={errors}
                onSelectSavedAddress={onSelectSavedAddress}
                onProvinceChange={onProvinceChange}
                onWardChange={onWardChange}
                onAddressChange={onAddressChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
