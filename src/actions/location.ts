import callApi, { ApiResponse } from "@/apis/handleApi";
import { ApiRouters } from "@/constants/api-routes";
import { District, Province, Ward } from "@/interface/location";

export const LocationApi = {
  getProvinces: async (): Promise<ApiResponse<Province[]>> => {
    return callApi<Province[]>(`${ApiRouters.LOCATIONS}/provinces`);
  },
  getDistricts: async (provinceId?: number): Promise<ApiResponse<District[]>> => {
    const params = provinceId ? { provinceId } : undefined;
    return callApi<District[]>(`${ApiRouters.LOCATIONS}/districts`, params);
  },
  getWards: async (params?: { provinceId?: number; districtId?: number }): Promise<ApiResponse<Ward[]>> => {
    return callApi<Ward[]>(`${ApiRouters.LOCATIONS}/wards`, params);
  },
};

