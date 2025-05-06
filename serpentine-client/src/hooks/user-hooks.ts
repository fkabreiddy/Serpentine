import { useEffect, useState } from 'react';
import {usePost} from "@/helpers/axios-helper";
import LoginUserRequest from '@/models/requests/user/login-user-request';
import { setToken, getToken } from '@/helpers/jwt-helper';
import { addToast } from '@heroui/toast';
import ApiResult from '@/models/api-result';

export function useLoginUser() {

    const dataInitialState : ApiResult<JWTResponse> ={
        statusCode : 0,
        message : "",
        errors : [],
        data : null
    }
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResult<JWTResponse>>(dataInitialState)

    const { post } = usePost<JWTResponse>();
    

    
    const login = async (user : LoginUserRequest) => {
        setLoading(true);
        setData(dataInitialState);
        var response = await post("user/authenticate", user);
       
        setData(response);
       

        if(response.data && response.statusCode === 200) {
            setToken(response?.data.token || "");
            addToast({title: "Login Success", description: "You have successfully logged in"});
        }
        else if(response.statusCode === 401) {
            addToast({title: "Login Failed", description: "Invalid username or password"});
        }
        else if(response.statusCode === 400 || response.statusCode === 422) {

            response.errors?.map((error) => {
                addToast({
                    title: "Validation Error",
                    description: error,
                    
                });
            });

        } 
        else{
            addToast({title: "An error has ocurred", description: response.message});
        }

        setLoading(false);
        
    };
    
   
    
    return { login, loading, data };
}