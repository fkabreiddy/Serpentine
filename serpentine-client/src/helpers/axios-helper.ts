import api from "@/config/axios-config";
import ApiResult from "@/models/api-result";
import { useEffect, useState } from "react";
import {addToast} from "@heroui/toast";
import { AxiosError, isAxiosError } from "axios";

const showToast = (title: string, description: string) => {

    addToast({
      title: title,
      description: description,
      hideIcon: true,
    });
}



export function useFetch<T>()  {
  
    
   
    const post = async (endpoint: string, body: any, token: string = "", contentType: string = "application/json") : Promise<ApiResult<T>> => {
      

      try {
        const response = await api.post<ApiResult<T>>(endpoint, body, {
          headers: {
           
            "Content-Type": contentType,
        
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
  
        if(response.data.statusCode === 401) {
          showToast("Error", "You are not authorized to perform this action.");
        }

       return response.data;
       
      } 
      catch (error ) 
      { 

        
        if (isAxiosError(error)) {

          if(error.response?.data === null || error.response?.data === undefined)
          {
            return {
              statusCode: 500,
              message: "An unknown error has ocurred",
              errors: [],
              data: null,
            }

          }
          const result = error.response?.data as ApiResult<T>;

          return result;
         
        }
        else
        {
          return {
            statusCode: 500,
            message: "Error connecting to the server",
            errors: [],
            data: null,
          }
        }
       
       

      } 
    };

    const get = async (endpoint: string, parameterObject: any, token: string = "", contentType: string = "application/json") : Promise<ApiResult<T>> => {
      
      const query = new URLSearchParams(parameterObject).toString();

      try {
        const response = await api.get<ApiResult<T>>(endpoint + query, {
          headers: {
           
            "Content-Type": contentType,
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
  
        if(response.data.statusCode === 401) {
          showToast("Error", "You are not authorized to perform this action.");
        }

       return response.data;
       
      } 
      catch (error ) 
      { 

        
        if (isAxiosError(error)) {

          if(error.response?.data === null || error.response?.data === undefined)
          {
            return {
              statusCode: 500,
              message: "An unknown error has ocurred",
              errors: [],
              data: null,
            }

          }
          const result = error.response?.data as ApiResult<T>;

          return result;
         
        }
        else
        {
          return {
            statusCode: 500,
            message: "Error connecting to the server",
            errors: [],
            data: null,
          }
        }
       
       

      } 
    };

    return { post, get};
  
  
}

