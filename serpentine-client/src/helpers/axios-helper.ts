import api from "@/config/axios-config";
import ApiResult from "@/models/api-result";
import { useEffect, useState } from "react";
import {addToast} from "@heroui/toast";

const showToast = (title: string, description: string) => {

    addToast({
        title: title,
        description: description,
        hideIcon: true,
      });
}



export function usePost<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);
  
    const post = async (url: string, body: any, token: string = "") => {
      setLoading(true);
      setErrors([]);
      setMessage(null);
      setIsSuccess(false);
  
      try {
        const response = await api.post<ApiResult<T>>(url, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
  
        if (response.data.statusCode !== 200) {
          setMessage(response.data.message);
          setErrors(response.data.errors);
          showToast("Error", response.status + " " + response.data.message);
        } else {
          setData(response.data.data);
          setIsSuccess(true);
        }
      } catch (err) {
        showToast("Error", "Error de conexión con el servidor.");

      } finally {
        setLoading(false);
      }
    };
  
    return { post, data, loading, isSuccess, message, errors };
  }