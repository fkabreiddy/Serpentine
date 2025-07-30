import ApiResult from "@/models/api-result";
import { playSound } from "react-sounds";
import { showToast } from "./sonner-helper";

export const handleApiErrors = (data: ApiResult<any>) => {
    const playError = () => playSound("game/void")
    playError();
    data.errors?.forEach(error => {
        showToast({
       
            description: error,
            color: "danger"
        });
    });
    
};

export const handleApiSuccess = (data: ApiResult<any>) =>{

    showToast({
        title: "Success",
        description: data.message,
    });
  
}




