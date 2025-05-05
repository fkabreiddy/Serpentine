import { useEffect, useState } from 'react';
import {usePost} from "@/helpers/axios-helper";
import LoginUserRequest from '@/models/requests/user/login-user-request';
import { setToken, getToken } from '@/helpers/jwt-helper';
import { addToast } from '@heroui/toast';

export function useLoginUser() {


    const { post, data, loading, isSuccess, message, errors } = usePost<JWTResponse>();
    

    
    const login = async (user : LoginUserRequest) => {
        await post("user/authenticate", user);

        if(isSuccess) {
            setToken(data?.token || "");
            addToast({title: "Login Success", description: "You have successfully logged in"});
        }
    };
    
   
    
    return { login, data, loading, message, errors, isSuccess };
}