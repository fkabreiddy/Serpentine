import api from "@/config/axios-config";
import ApiResult from "@/models/api-result";
import { showToast } from "./sonner-helper";
import { AxiosError, isAxiosError } from "axios";
import { getToken, decode } from "./jwt-helper";
import { useAuthStore } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import HttpVerbsEnum from '../models/http-verbs-enum';

interface RequestConfig {
  endpoint: string;
  requireToken?: boolean;
  contentType?: string;
}


const DEFAULT_CONTENT_TYPE = "application/json";


const createApiResult = <T>(
  isSuccess: boolean,
  statusCode: number,
  message: string,
  errors: string[] = [],
  data: T | null = null
): ApiResult<T> => ({
  isSuccess,
  statusCode,
  message,
  errors,
  data,
});


const handleTokenCheck = (): string | null => {

  const decoded = decode();
  if (!decoded) {
    useAuthStore.getState().logout();
    showToast({
      title: "Session Expired",
      description: "Your session has expired, login again",
    });
    return null;
  }
  return getToken();
};

const handleApiError = <T>(error: unknown): ApiResult<T> => {
  if (!isAxiosError(error)) {
    showToast({ title: "Oops", description: "Something went wrong, try again later" });
    return createApiResult(false, 0, "");
  }

  const { response } = error as AxiosError<ApiResult<T>>;

  if (!response?.data) {
    showToast({ title: "Oops", description: "Something went wrong, try again later" });
    return createApiResult(false, 0, "");
  }

  const result = response.data;

  if (result.statusCode === 500) {
    showToast({ title: "Oops", description: result.message });
    return result;
  }

  return result;
};

export function useFetch<T>() {
  const getAuthHeaders = (token: string | null, contentType: string) => ({
    "Content-Type": contentType,
    Authorization: token ? `Bearer ${token}` : "",
  });

  const handleRequest = async (
    { endpoint, requireToken = true, contentType = DEFAULT_CONTENT_TYPE }: RequestConfig,
    method: HttpVerbsEnum,
    data?: any
  ): Promise<ApiResult<T>> => {
    try {
     
      if (requireToken) {
        const token = handleTokenCheck();
        if (!token) {
          return createApiResult(false, 401, "Session Expired", ["Session Expired"]);
        }
      }

      const config = {
        headers: getAuthHeaders(requireToken ? getToken() : null, contentType),
      };

      let response;
      switch (method) {
        case HttpVerbsEnum.Post:
          response = await api.post<ApiResult<T>>(endpoint, data, config);
          break;
        case HttpVerbsEnum.Get:
            const queryString = new URLSearchParams(data).toString() 
            response = await api.get<ApiResult<T>>(`${endpoint}${queryString}`, config);
          
          break;
        case HttpVerbsEnum.Put:
          response = await api.put<ApiResult<T>>(endpoint, data, config);
          break;
        case HttpVerbsEnum.Delete:
          response = await api.delete<ApiResult<T>>(endpoint, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

      if (response.data.statusCode === 401) {
        return createApiResult(false, 401, "Oops", ["Your session has expired, please login again"]);
      }

      return response.data;
    } catch (error) {
      return handleApiError<T>(error);
    }
  };

  return {
    post: (config: RequestConfig, body: unknown) => handleRequest(config, HttpVerbsEnum.Post, body),
    get: (config: RequestConfig, data: any) => handleRequest(config, HttpVerbsEnum.Get, data),
  };
}
