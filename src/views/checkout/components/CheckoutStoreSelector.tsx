'use client';

import { Input } from '@/components/ui/input';
import { FulfillmentType } from '@/interface/basket';
import { StoreDto } from '@/interface/store';
import { Clock, Loader2, MapPin, Phone, RefreshCw, Search, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface CheckoutStoreSelectorProps {
  fulfillmentType: FulfillmentType;
  stores: StoreDto[];
  loadingStores: boolean;
  errorStores: string | null;
  selectedStoreId: number;
  onSelectStore: (storeId: number) => void;
  onRetry: () => void;
  error?: string;
}

export default function CheckoutStoreSelector({
  fulfillmentType,
  stores,
  loadingStores,
  errorStores,
  selectedStoreId,
  onSelectStore,
  onRetry,
  error,
}: CheckoutStoreSelectorProps) {
  const t = useTranslations('Checkout');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stores;
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
    );
  }, [stores, searchQuery]);

  const title = fulfillmentType === 'Pickup' ? t('pickupStoreTitle') : t('storeTitle');

  return (
    <div className="rounded-lg border border-outline-variant/35 bg-surface-container-lowest p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
        <div className="flex items-center gap-2">
          <Store className="h-4.5 w-4.5 text-primary shrink-0" />
          <h2 className="font-heading text-lg font-bold text-on-surface">
            {title} <span className="text-error">*</span>
          </h2>
        </div>
        {loadingStores && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>

      {stores.length > 3 && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchStorePlaceholder')}
            className="h-9.5 pl-9 bg-surface border-outline-variant/60 focus-visible:border-primary focus-visible:ring-primary/15"
          />
        </div>
      )}

      {loadingStores && stores.length === 0 ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-on-surface-variant">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>{t('loadingStores')}</span>
        </div>
      ) : errorStores ? (
        <div className="rounded-xl border border-error/30 bg-error/5 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium text-error">{errorStores || t('loadStoresFailed')}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/60 bg-surface px-3 py-1.5 text-xs font-semibold text-on-surface hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('retryLoadStores')}</span>
          </button>
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/50 py-6 px-4 text-center text-sm text-on-surface-variant">
          {stores.length === 0 ? t('noStoresFound') : t('noMatchingStores')}
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-label={title}
          className="max-h-72 overflow-y-auto space-y-2.5 pr-1"
        >
          {filteredStores.map((store) => {
            const isSelected = selectedStoreId === store.id;
            return (
              <label
                key={store.id}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-all cursor-pointer ${isSelected
                  ? 'border-primary/50 bg-rose-pale/25'
                  : 'border-outline-variant/45 bg-surface hover:border-primary/35'
                  }`}
              >
                <input
                  type="radio"
                  name="storeId"
                  value={store.id}
                  checked={isSelected}
                  onChange={() => onSelectStore(store.id)}
                  className="sr-only"
                />
                <span
                  className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2 bg-white ${isSelected ? 'border-primary' : 'border-outline-variant'
                    }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                </span>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-bold text-on-surface">{store.name}</p>
                  <p className="flex items-start gap-1.5 text-xs text-on-surface-variant">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                    <span>{store.address}</span>
                  </p>
                  {(store.openingHours || store.phone) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-[11px] text-on-surface-variant">
                      {store.openingHours && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{store.openingHours}</span>
                        </span>
                      )}
                      {store.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{store.phone}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
