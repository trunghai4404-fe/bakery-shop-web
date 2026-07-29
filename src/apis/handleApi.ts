import axiosClient from './axiosClient';
interface ApiResponse<T = any> {
  meta?: T;
  items?: T;
  success?: T;
  data?: T;
  navigation?: T;
  body?: T;
  child_pages?: T;
  errors?: T;
  message?: T;
}

const callApi = async <T = any>(
  url: string,
  payload?: any,
  method: 'post' | 'put' | 'patch' | 'get' | 'delete' = 'get',
): Promise<ApiResponse<T>> => {
  const config: any = {
    method,
    url,
  };

  if (method === 'get') {
    config.params = payload;
  } else if (method === 'delete') {
    if (payload === undefined) {
      config.params = payload;
    } else {
      config.data = payload;
    }
  }else{
    config.data = payload;
  }

  return await axiosClient(config);
};

export default callApi;