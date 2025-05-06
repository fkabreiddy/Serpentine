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



export function usePost<T>()  {
  
    
   
    const post = async (url: string, body: any, token: string = "") : Promise<ApiResult<T>> => {
      

      try {
        const response = await api.post<ApiResult<T>>(url, body, {
          headers: {
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
          const result = error.response?.data as ApiResult<T>;

          return result;
         
        }
        else
        {
          return {
            statusCode: 500,
            message: "Error de conexión con el servidor.",
            errors: [],
            data: null,
          }
        }
       
       

      } 
    };

    return { post};
  
  
  }