'use client';

import { Input } from '@/components/ui/input';
import SearchableSelect from '@/components/ui/searchable-select';
import { SavedAddress } from '@/interface/address';
import { Check, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useCheckoutLocations } from '../hooks/useCheckoutLocations';
import { CheckoutFormValues } from '../schemas/checkout.schema';

interface CheckoutAddressSelectorProps {
  savedAddresses: SavedAddress[];
  selectedSavedAddressId: string | null;
  provinceId: number;
  wardId: number;
  address: string;
  errors: FieldErrors<CheckoutFormValues>;
  onSelectSavedAddress: (addr: SavedAddress | null) => void;
  onProvinceChange: (provinceId: number) => void;
  onWardChange: (wardId: number) => void;
  onAddressChange: (address: string) => void;
}

export default function CheckoutAddressSelector({
  savedAddresses,
  selectedSavedAddressId,
  provinceId,
  wardId,
  address,
  errors,
  onSelectSavedAddress,
  onProvinceChange,
  onWardChange,
  onAddressChange,
}: CheckoutAddressSelectorProps) {
  const t = useTranslations('Checkout');

  const {
    provinces,
    loadingProvinces,
    wards,
    loadingWards,
  } = useCheckoutLocations(provinceId || null);

  const provinceOptions = useMemo(
    () =>
      provinces.map((p) => ({
        value: String(p.id),
        label: p.fullName || p.name,
        searchText: `${p.name} ${p.codename}`,
      })),
    [provinces]
  );

  const wardOptions = useMemo(
    () =>
      wards.map((w) => ({
        value: String(w.id),
        label: w.fullName || w.name,
        searchText: `${w.name} ${w.codename}`,
      })),
    [wards]
  );

  const activeSavedAddress = savedAddresses.find(
    (addr) => addr.id === selectedSavedAddressId
  );

  return (
    <div className="space-y-4">
      {savedAddresses.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              {t('savedAddressesLabel')}
            </label>
            {selectedSavedAddressId && (
              <button
                type="button"
                onClick={() => onSelectSavedAddress(null)}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                {t('enterCustomAddress')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {savedAddresses.map((addr) => {
              const isSelected = addr.id === selectedSavedAddressId;
              return (
                <button
                  key={addr.id}
                  type="button"
                  onClick={() => onSelectSavedAddress(addr)}
                  className={`text-left rounded-xl border p-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-outline-variant/40 bg-surface-container-low/40 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate text-xs font-bold text-on-surface">
                        {addr.label || addr.recipientName}
                      </span>
                      {addr.isDefault && (
                        <span className="rounded-full bg-rose-pale px-2 py-0.5 text-[10px] font-bold text-primary">
                          {t('defaultBadge')}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                  <p className="mt-1 text-xs font-medium text-on-surface">
                    {addr.recipientName} • {addr.phoneNumber}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                    {addr.address}, {addr.wardName}, {addr.provinceName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-1">
            <span>{t('provinceLabel')}</span>
            <span className="text-error">*</span>
          </label>
          <SearchableSelect
            value={provinceId ? String(provinceId) : ''}
            onValueChange={(val) => onProvinceChange(val ? Number(val) : 0)}
            options={provinceOptions}
            placeholder={t('provincePlaceholder')}
            searchPlaceholder={t('searchLocationPlaceholder')}
            emptyText={t('noLocationResults')}
            fallbackLabel={activeSavedAddress?.provinceName}
            loading={loadingProvinces}
          />
          {errors.provinceId && (
            <p className="text-xs font-medium text-error">{errors.provinceId.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface flex items-center gap-1">
            <span>{t('wardLabel')}</span>
            <span className="text-error">*</span>
          </label>
          <SearchableSelect
            value={wardId ? String(wardId) : ''}
            onValueChange={(val) => onWardChange(val ? Number(val) : 0)}
            options={wardOptions}
            placeholder={t('wardPlaceholder')}
            searchPlaceholder={t('searchLocationPlaceholder')}
            emptyText={t('noLocationResults')}
            fallbackLabel={activeSavedAddress?.wardName}
            disabled={!provinceId}
            loading={loadingWards}
          />
          {errors.wardId && (
            <p className="text-xs font-medium text-error">{errors.wardId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-on-surface">
          {t('streetAddressLabel')} <span className="text-error">*</span>
        </label>
        <Input
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder={t('streetAddressPlaceholder')}
          className="h-10 bg-surface border-outline-variant/60 focus-visible:border-primary focus-visible:ring-primary/15"
        />
        {errors.address && (
          <p className="text-xs font-medium text-error">{errors.address.message}</p>
        )}
      </div>
    </div>
  );
}
