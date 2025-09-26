import api from "@/config/axios-config";
import ApiResult from "@/models/api-result";
import { showToast } from "./sonner-helper";
import { AxiosError, isAxiosError } from "axios";
import { useAuthStore } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import HttpVerbsEnum from '../models/http-verbs-enum';
import { useJwtHelper } from "./jwt-helper";
import { playSound } from "react-sounds";
interface RequestConfig {
  endpoint: string;
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
  errors,
  data,
});



const handleApiError = <T>(error: unknown): ApiResult<T> => {

  if (!isAxiosError(error)) {
    showToast({ title: "Oops", description: "Something went wrong, try again later" });
    return createApiResult(false, 500,"Server Error", "Something went wrong, try again later", ["Something went wrong with Serpentine"] );
  }

  const { response } = error as AxiosError<ApiResult<T>>;
  
  if (!response?.data) {
    showToast({ title: "Oops", description: "Something went wrong, try again later"});
    return createApiResult(false, 500,"Server Error", "Something went wrong, try again later", ["Something went wrong with Serpentine"] );
  }

  

  return response.data;
};

export function useFetch<T>() {
 
  const {removeToken, getToken} = useJwtHelper();
 

  const handleRequest = async (
    { endpoint,  contentType = DEFAULT_CONTENT_TYPE }: RequestConfig,
    method: HttpVerbsEnum,
    data?: any
  ): Promise<ApiResult<T>> => {
    try {
     
      
      const config = {headers:  {'Content-Type': contentType, Accept: contentType, Authorization: `Bearer ${getToken() ?? ""}`}}
      

      let response;
      const queryString = new URLSearchParams(data).toString();

      switch (method) {
        case HttpVerbsEnum.Post:
        response = await api.post<ApiResult<T>>(endpoint, data, config);
          break;
        case HttpVerbsEnum.Get:
            response = await api.get<ApiResult<T>>(`${endpoint}?${queryString}`, config);
          
          break;
        case HttpVerbsEnum.Put:
          response = await api.put<ApiResult<T>>(endpoint, data, config);
          break;
        case HttpVerbsEnum.Delete:
            response = await api.delete<ApiResult<T>>(`${endpoint}?${queryString}`, config);
            break;
        case HttpVerbsEnum.Patch:
          response = await api.patch<ApiResult<T>>(endpoint, data, config);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }


      if (response.status === 401) {
        
        removeToken();
        return createApiResult(false, 401, response.data.message, "Session Expired", ["Your session has expired, please login again"]);

      }
      
      

      return response.data;
    } catch (error) {
      return handleApiError<T>(error);
    }
  };

  return {
    post: (config: RequestConfig, body: unknown) => handleRequest(config, HttpVerbsEnum.Post, body),
    put: (config: RequestConfig, body: unknown) => handleRequest(config, HttpVerbsEnum.Put, body),
    get: (config: RequestConfig, data: any) => handleRequest(config, HttpVerbsEnum.Get, data),
    delete: (config: RequestConfig, data: any) => handleRequest(config, HttpVerbsEnum.Delete, data),
    patch: (config: RequestConfig, body: unknown) => handleRequest(config, HttpVerbsEnum.Patch, body),


  };
}
