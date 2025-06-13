import ApiResult from "@/models/api-result";
import { playSound } from "react-sounds";
import { showToast } from "./sonner-helper";

export const handleApiErrors = (data: ApiResult<any>) => {
    const playError = () => playSound("notification/error")

    playError();
    data.errors?.forEach(error => {
        showToast({
            title: "Validation Error",
            description: error,
        });
    });
    
};

export const handleApiSuccess = (data: ApiResult<any>) =>{
    const playSuccess = () => playSound("notification/success")

    playSuccess();
  
    showToast({
        title: data.message,
        description: data.message,
    });
  
}


