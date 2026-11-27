import callApi, { ApiResponse } from '@/apis/handleApi';
import { ApiRouters } from '@/constants/api-routes';
import { StoreListParams, StoreListResponse } from '@/interface/store';

export const StoreApi = {
  getActiveStores: async (
    params?: StoreListParams
  ): Promise<ApiResponse<StoreListResponse>> => {
    const url = `${ApiRouters.STORES}/active`;
    return callApi<StoreListResponse>(url, params);
  },
};
