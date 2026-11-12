import { useQuery } from '@tanstack/react-query';
import { ADDRESS_QUERY_STALE_TIME } from '../constants/address.constants';
import { locationService } from '../services/address.service';

export function useLocationOptions(
  provinceId: number | null,
  districtId: number | null
) {
  const provincesQuery = useQuery({
    queryKey: ['locations', 'provinces'],
    queryFn: locationService.getProvinces,
    staleTime: ADDRESS_QUERY_STALE_TIME,
  });

  const districtsQuery = useQuery({
    queryKey: ['locations', 'districts', provinceId],
    queryFn: () => locationService.getDistricts(provinceId!),
    enabled: Boolean(provinceId),
    staleTime: ADDRESS_QUERY_STALE_TIME,
  });

  const wardsQuery = useQuery({
    queryKey: ['locations', 'wards', districtId],
    queryFn: () => locationService.getWards(districtId!),
    enabled: Boolean(districtId),
    staleTime: ADDRESS_QUERY_STALE_TIME,
  });

  return {
    provinces: provincesQuery.data ?? [],
    loadingProvinces: provincesQuery.isLoading,
    districts: districtsQuery.data ?? [],
    loadingDistricts: districtsQuery.isLoading,
    wards: wardsQuery.data ?? [],
    loadingWards: wardsQuery.isLoading,
  };
}

