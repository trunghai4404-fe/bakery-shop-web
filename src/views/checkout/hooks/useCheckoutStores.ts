'use client';

import { StoreApi } from '@/actions/store';
import { StoreDto } from '@/interface/store';
import { getErrorMessage } from '@/lib/helper';
import { useCallback, useEffect, useState } from 'react';

interface UseCheckoutStoresParams {
  lat?: number | null;
  long?: number | null;
}

export function useCheckoutStores({ lat, long }: UseCheckoutStoresParams = {}) {
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [errorStores, setErrorStores] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  const hasCoordinates =
    typeof lat === 'number' &&
    Number.isFinite(lat) &&
    typeof long === 'number' &&
    Number.isFinite(long);

  const requestKey = `${hasCoordinates ? `${lat},${long}` : 'all'}:${reloadNonce}`;
  const [settledKey, setSettledKey] = useState<string | null>(null);

  const refetchStores = useCallback(() => {
    setReloadNonce((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    StoreApi.getActiveStores({
      pageSize: 100,
      ...(hasCoordinates ? { lat: lat!, long: long! } : {}),
    })
      .then((res) => {
        if (!isMounted) return;
        const items = Array.isArray(res.data?.items) ? res.data.items : [];
        setStores(items);
        setErrorStores(null);
      })
      .catch((error) => {
        if (!isMounted) return;
        setErrorStores(getErrorMessage(error, 'Không thể tải danh sách cửa hàng'));
        setStores([]);
      })
      .finally(() => {
        if (isMounted) setSettledKey(requestKey);
      });

    return () => {
      isMounted = false;
    };
  }, [hasCoordinates, lat, long, requestKey]);

  return {
    stores,
    loadingStores: settledKey !== requestKey,
    errorStores,
    refetchStores,
  };
}
