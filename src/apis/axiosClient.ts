import { BAKERY_ACCESS_TOKEN, BAKERY_REFRESH_TOKEN } from "@/constants/cookies";
import axios from "axios";
import Cookies from "js-cookie";
import queryString from "query-string";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config: any) => {
  const access_token = Cookies.get(BAKERY_ACCESS_TOKEN);
  config.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (res) => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;

    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const storedRefreshToken = Cookies.get(BAKERY_REFRESH_TOKEN);

      if (!storedRefreshToken) {
        processQueue(response.data, null);
        Cookies.remove(BAKERY_ACCESS_TOKEN);
        isRefreshing = false;
        return Promise.reject(response.data);
      }

      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const tokenData = refreshResponse.data?.data;

        const newAccessToken: string = tokenData?.accessToken;
        const newRefreshToken: string | undefined = tokenData?.refreshToken;
        const accessExpireDays = tokenData?.accessTokenExpireAt
          ? tokenData.accessTokenExpireAt / 86400
          : 1 / 48;
        const refreshExpireDays = tokenData?.refreshTokenExpireAt
          ? (new Date(tokenData.refreshTokenExpireAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          : 7;

        Cookies.set(BAKERY_ACCESS_TOKEN, newAccessToken, { path: "/", sameSite: "Lax", expires: accessExpireDays });
        if (newRefreshToken) {
          Cookies.set(BAKERY_REFRESH_TOKEN, newRefreshToken, { path: "/", sameSite: "Lax", expires: refreshExpireDays });
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        Cookies.remove(BAKERY_ACCESS_TOKEN);
        Cookies.remove(BAKERY_REFRESH_TOKEN);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(response ? response.data : "No response");
  }
);

export default axiosClient;