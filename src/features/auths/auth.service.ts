import callApi from "@/apis/handleApi";
import { ApiRouters } from "@/constants/api-routes";
import { LoginRequest, Register } from "@/interface/auth";
import { SPORTHUB_REFRESH_TOKEN } from "@/constants/cookies";
import Cookies from "js-cookie";

export const loginApi = async (payload: LoginRequest) => {
  const url = ApiRouters.AUTH + "/login";
  return callApi(url, payload, "post");
};

export const register = async (payload: Register) => {
  const url = ApiRouters.AUTH + "/register";
  return callApi(url, payload, "post");
}

export const getProfile = async () => {
  return callApi(ApiRouters.ME);
}

export const logoutApi = async () => {
  const url = ApiRouters.AUTH + "/logout";
  const refreshToken = Cookies.get(SPORTHUB_REFRESH_TOKEN) ?? "";
  return callApi(url, { refreshToken }, "post");
}