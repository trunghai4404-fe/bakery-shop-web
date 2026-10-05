import callApi from "@/apis/handleApi";
import { ApiRouters } from "@/constants/api-routes";
import { BAKERY_REFRESH_TOKEN } from "@/constants/cookies";
import { LoginRequest, RegisterRequest } from "@/interface/auth";
import Cookies from "js-cookie";

export const authenticationApi = {
    login: async (data: LoginRequest) => {
        const url = `${ApiRouters.AUTH}/login`;
        return callApi(url, data, "post");
    },
    register: async (payload: RegisterRequest) => {
        const url = `${ApiRouters.AUTH}/register`;
        return callApi(url, payload, "post");
    },
    getProfile: async () => {
        return callApi(ApiRouters.ME);
    },
    logoutApi: async () => {
        const url = `${ApiRouters.AUTH}/logout`;
        const refreshToken = Cookies.get(BAKERY_REFRESH_TOKEN) ?? "";
        return callApi(url, { refreshToken }, "post");
    },
    refreshToken: async (refreshToken: string) => {
        const url = `${ApiRouters.AUTH}/refresh-token`;
        return callApi(url, { refreshToken }, "post");
    }
}