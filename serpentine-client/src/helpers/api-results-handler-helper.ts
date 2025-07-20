import ApiResult from "@/models/api-result";
import { playSound } from "react-sounds";
import { showToast } from "./sonner-helper";

export const handleApiErrors = (data: ApiResult<any>) => {
    const playError = () => playSound("notification/error")

    playError();
    data.errors?.forEach(error => {
        showToast({
            title: data.resultTitle,
            description: error,
        });
    });
    
};

export const handleApiSuccess = (data: ApiResult<any>) =>{

    showToast({
        title: "Success",
        description: data.message,
    });
  
}


const getErrorName = (statusCode: number) =>{

    switch (statusCode) {
        case 400:
            return "Bad Request";
        case 409:
            return "Conflict";
        case 401:
            return "Unauthorized";
        case 403:
            return "Forbidden";
        case 404:
            return "Not Found";
        case 500:
            return "Internal Server Error";
        case 502:
            return "Bad Gateway";
        case 503:
            return "Service Unavailable";
        default:
            return "Error";
    }
}

