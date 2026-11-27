'use client';

import { useEffect, useState } from 'react';
import { LocationApi } from '@/actions/location';
import { Province, Ward } from '@/interface/location';

// Module-level in-memory cache to avoid refetching
let cachedProvinces: Province[] | null = null;
const cachedWardsByProvince = new Map<number, Ward[]>();

export function useCheckoutLocations(provinceId: number | null) {
  const [provinces, setProvinces] = useState<Province[]>(() => cachedProvinces ?? []);
  const [loadingProvinces, setLoadingProvinces] = useState<boolean>(!cachedProvinces);

  const [wards, setWards] = useState<Ward[]>(() => {
    if (provinceId && cachedWardsByProvince.has(provinceId)) {
      return cachedWardsByProvince.get(provinceId)!;
    }
    return [];
  });
  const [loadingWards, setLoadingWards] = useState<boolean>(false);

  // Fetch provinces
  useEffect(() => {
    if (cachedProvinces && cachedProvinces.length > 0) {
      setProvinces(cachedProvinces);
      setLoadingProvinces(false);
      return;
    }

    let isMounted = true;
    setLoadingProvinces(true);

    LocationApi.getProvinces()
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        cachedProvinces = list;
        setProvinces(list);
      })
      .catch((err) => {
        console.error('Failed to fetch provinces:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingProvinces(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch wards when provinceId changes
  useEffect(() => {
    if (!provinceId || provinceId <= 0) {
      setWards([]);
      setLoadingWards(false);
      return;
    }

    if (cachedWardsByProvince.has(provinceId)) {
      setWards(cachedWardsByProvince.get(provinceId)!);
      setLoadingWards(false);
      return;
    }

    let isMounted = true;
    setLoadingWards(true);

    LocationApi.getWards({ provinceId })
      .then((res) => {
        if (!isMounted) return;
        const list = Array.isArray(res.data) ? res.data : [];
        cachedWardsByProvince.set(provinceId, list);
        setWards(list);
      })
      .catch((err) => {
        console.error(`Failed to fetch wards for province ${provinceId}:`, err);
        if (isMounted) setWards([]);
      })
      .finally(() => {
        if (isMounted) setLoadingWards(false);
      });

    return () => {
      isMounted = false;
    };
  }, [provinceId]);

  return {
    provinces,
    loadingProvinces,
    wards,
    loadingWards,
  };
}
