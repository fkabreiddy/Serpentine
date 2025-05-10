import { useEffect, useState } from 'react';
import {useFetch} from "@/helpers/axios-helper";
import LoginUserRequest from '@/models/requests/user/login-user-request';
import { setToken, getToken } from '@/helpers/jwt-helper';
import { addToast } from '@heroui/toast';
import ApiResult from '@/models/api-result';
import { UserResponse } from '@/models/responses/user-response';
import { GetByUsernameRequest } from '@/models/requests/user/get-by-username';

export function useLoginUser() {
    const dataInitialState: ApiResult<JWTResponse> = {
        statusCode: 0,
        message: "",
        errors: [],
        data: null
    };

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResult<JWTResponse>>(dataInitialState);
    const { post } = useFetch<JWTResponse>();

    useEffect(() => {

        if (data.statusCode === 0) return; 

        if (data.data !== null && data.statusCode === 200) {
            setToken(data?.data.token || "");
            addToast({ title: "Login Success", description: "You have successfully logged in" });
        }
        else if (data.statusCode === 401) {
            addToast({ title: "Login Failed", description: "Invalid username or password" });
        }
        else if (data.statusCode === 400 || data.statusCode === 422) {
            data.errors?.forEach((error) => {
                addToast({
                    title: "Validation Error",
                    description: error,
                });
            });
        }
        else {
            addToast({ title: "An error has occurred", description: data.message });
        }

        setLoading(false);
    }, [data]); 
    const login = async (user: LoginUserRequest) => {
        setLoading(true);
        setData(dataInitialState);

        const response = await post("user/authenticate", user);
        setData(response); 
    };

    return { login, loading, data };
}

export function useCreateUser() {

    const dataInitialState : ApiResult<UserResponse> ={
        statusCode : 0,
        message : "",
        errors : [],
        data : null
    }
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResult<UserResponse>>(dataInitialState)

    const { post } = useFetch<UserResponse>();
    
    useEffect(()=>{

        if (data.statusCode === 0) return; 
        
        if(data.data !== null && data.statusCode === 200) {
            addToast({title: "Creation Successful", description: "Your account was created successfully"});
        }
        else if(data.statusCode === 409) {
            addToast({title: "Creation Failed", description: data.message});
        }
        else if(data.statusCode === 400 || data.statusCode === 422) {

            data.errors?.map((error) => {
                addToast({
                    title: "Validation Error",
                    description: error,
                    
                });
            });

        } 
        else{
            addToast({title: "An error has ocurred", description: data.message});
        }
        setLoading(false);

        

    }, [data])
    
    const createUser = async (user : FormData) => {
        setLoading(true);
        setData(dataInitialState);
        const response = await post("user/create", user, "", "multipart/form-data");
        setData(response);
        
    
    };
    
   
    
    return { createUser, loading, data };
}

export function useGetByUsername() {

    const dataInitialState : ApiResult<UserResponse> ={
        statusCode : 0,
        message : "",
        errors : [],
        data : null
    }
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ApiResult<UserResponse>>(dataInitialState)

    const { get } = useFetch<UserResponse>();
    
    useEffect(()=>{

        if (data.statusCode === 0) return; 
        
        if(data.data !== null && data.statusCode === 200) {
            addToast({title: "Oops!", description: "This username is already taken"});
        }
        else if(data.statusCode === 404)
        {
            
        }
        else if(data.statusCode === 400 || data.statusCode === 422) {

            data.errors?.map((error) => {
                addToast({
                    title: "Validation Error",
                    description: error,
                    
                });
            });

        } 
        else{
            console.log(data.statusCode);
            addToast({title: "An error has ocurred", description: data.message});
        }
        setLoading(false);

        

    }, [data])
    
    const getByUsername = async (data : GetByUsernameRequest) => {
        setLoading(true);
        setData(dataInitialState);
        const response = await get("user/by-username?", data, "", "multipart/form-data");
        setData(response);
        
    
    };
    
   
    
    return { getByUsername, loading, data };
}