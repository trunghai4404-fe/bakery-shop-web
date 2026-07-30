import axios from "axios"
import queryString from "query-string";
const baseURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 
 * @param currency 
 * @param lang 
 * @returns 
*/
export const createAxiosServerSide = () => {
  const instance = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Client": "WebApp"
    }
  });

  instance.interceptors.response.use(
    (res) => {
      if (res.data && res.status >= 200 && res.status <= 300) {
        return res.data;
      } else {
        return Promise.reject(res.data);
      }
    },
    (error) => {
      return Promise.reject(error?.response?.data || "No response");
    }
  );
  return instance;
}