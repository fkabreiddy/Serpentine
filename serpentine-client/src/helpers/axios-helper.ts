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
  resultTitle: string = "Oops!",
  message: string = "Something went bad",
  errors: string[] = [],
  data: T | null = null
): ApiResult<T> => ({
  isSuccess,
  statusCode,
  message,
  resultTitle,
  errors,
  data,
});



const handleApiError = <T>(error: unknown): ApiResult<T> => {
  if (!isAxiosError(error)) {
    showToast({ title: "Oops", description: "Something went wrong, try again later" });
    return createApiResult(false, 500, "");
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
        return createApiResult(false, 401, "Oops", "Session Expired", ["Your session has expired, please login again"]);
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
