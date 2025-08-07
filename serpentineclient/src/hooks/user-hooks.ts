import { useEffect, useState } from 'react';
import { useFetch } from "@/helpers/axios-helper";
import {LoginUserRequest} from '@/models/requests/user/login-user-request';
import ApiResult from '@/models/api-result';
import { JWTResponse } from '@/models/responses/jwt-response';
import { UserResponse } from '@/models/responses/user-response';
import { GetByUsernameRequest } from '@/models/requests/user/get-by-username';
import { useNavigate } from 'react-router-dom';
import { handleApiErrors, handleApiSuccess } from '@/helpers/api-results-handler-helper';
import { useJwtHelper } from '@/helpers/jwt-helper';
const USERS_ENDPOINT = "users";





export function useLoginUser() {
    const {setToken} = useJwtHelper();
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<JWTResponse> | null>(null);
    const navigate = useNavigate();
    const { post } = useFetch<JWTResponse>();

    useEffect(() => {

        if(!result)
        {
            setIsLoggingIn(false);
            return;

        }

        if (result.data && result.statusCode === 200) {

            let token = result.data.token;
            
            setToken(token);
            handleApiSuccess(result);
            setIsLoggingIn(false);
            navigate("/explore");

        } else {
            handleApiErrors(result);
        }

        setIsLoggingIn(false);
        setResult(null);


    }, [result]);

    const loginUser = async (user: LoginUserRequest) => {
        setResult(null);
        setIsLoggingIn(true);
        const response = await post({endpoint: USERS_ENDPOINT + "/authenticate"}, user);
        setResult(response);
    };

    return { loginUser, isLoggingIn, result };
}

export function useCreateUser() {
  
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<UserResponse> | null>(null);
    const { post } = useFetch<UserResponse>();

    useEffect(() => {

        if(!result)
        {
            setIsCreatingUser(false);
            return;

        }

        if (result.data && result.isSuccess) {
            handleApiSuccess(result);
        }
        else{
            handleApiErrors(result);
        }
        setIsCreatingUser(false);
        setResult(null);


    }, [result]);

    const createUser = async (user: FormData) => {
        setResult(null);
        setIsCreatingUser(true);
        const response = await post({endpoint:USERS_ENDPOINT, contentType:"multipart/form-data"}, user);
        setResult(response);
    };

    return { createUser, result, isCreatingUser };
}

export function useGetByUsername() {
   
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<UserResponse> | null>(null);
    const [isGettingByUsername, setIsGettingByUsername] = useState<boolean>(false);
    const { get } = useFetch<UserResponse>();

    useEffect(() => {

        if (!result)
        {
            setIsGettingByUsername(false);
            return;

        }

        if (result.data && result.isSuccess) {
            handleApiErrors({data: null, message: "Another user with this username is already in use", resultTitle: "Conflict",  statusCode: 409, isSuccess: false, errors: ["This username is already in use"]});
            
        } else if (result.statusCode === 404) {
            setIsAvailable(true);
            handleApiSuccess({data: null, message: "Your username is available", resultTitle: "Got it", statusCode: 200, isSuccess: true, errors: []})
        }
        else
        {
            handleApiErrors(result);

        }

        setIsGettingByUsername(false);
        setResult(null);


    }, [result]);

    const getByUsername = async (data: GetByUsernameRequest) => {

        setResult(null);
        setIsGettingByUsername(true);
        setIsAvailable(false);
        const response = await get({endpoint: USERS_ENDPOINT + "/by-username"}, data );
        setResult(response);

       
      
    };

    return { getByUsername, result,  isAvailable,  setIsAvailable, isGettingByUsername };
}

export function useCloseSession() {
    const [loading, setLoading] = useState<boolean>(false);
    const {removeToken} = useJwtHelper();
    
    const closeSession = () =>{
        setLoading(true);
        removeToken();
        setLoading(false);
        
    }


    return { closeSession, loading };
}
