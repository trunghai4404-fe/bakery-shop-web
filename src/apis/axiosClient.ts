import { SPORTHUB_ACCESS_TOKEN, SPORTHUB_REFRESH_TOKEN } from "@/constants/cookies";
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
  const access_token = Cookies.get(SPORTHUB_ACCESS_TOKEN);
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
    // if (response?.status === 401) {
    //   return Promise.reject(response.data);
    // }

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
      try {
        throw response.data;
      } catch (err) {
        processQueue(err, null);
        Cookies.remove(SPORTHUB_ACCESS_TOKEN);
        Cookies.remove(SPORTHUB_REFRESH_TOKEN);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(response ? response.data : "No response");
  }
);

export default axiosClient;