import { useEffect, useState, useTransition } from 'react';
import { useFetch } from "@/helpers/axios-helper";
import LoginUserRequest from '@/models/requests/user/login-user-request';
import { addToast } from '@heroui/toast';
import ApiResult from '@/models/api-result';
import { JWTResponse } from '@/models/responses/jwt-response';
import { UserResponse } from '@/models/responses/user-response';
import { GetByUsernameRequest } from '@/models/requests/user/get-by-username';
import { useAuthStore } from '@/contexts/authentication-context';
import { useNavigate } from 'react-router-dom';
import { HookState } from '@/models/api-result';


const initialApiState = <T>(): ApiResult<T> => ({
    statusCode: 0,
    message: "",
    isSuccess: false,
    errors: [],
    data: null
});

const handleApiErrors = (data: ApiResult<any>) => {
    data.errors?.forEach(error => {
        addToast({
            title: "Validation Error",
            description: error,
        });
    });
    
};

export function useLoginUser() {
    const [{ loading, data }, setState] = useState<HookState<JWTResponse>>({
        loading: false,
        data: initialApiState()
    });
    const navigate = useNavigate();
    const { post } = useFetch<JWTResponse>();

    useEffect(() => {
        if (!data.statusCode || data.statusCode === 401) return;

        if (data.data && data.statusCode === 200) {

            let token = data.data.token;
            useAuthStore.getState().login(token, navigate);
            addToast({ title: "Login Success", description: "You have successfully logged in" });
            setState(prev => ({ ...prev, loading: false }));
            navigate("/home")


        } else if (data.statusCode === 404) {
            addToast({ title: "Login Failed", description: "Invalid username or password" });
        } else {
            handleApiErrors(data);
        }

        setState(prev => ({ ...prev, loading: false }));
    }, [data]);

    const login = async (user: LoginUserRequest) => {
        setState({ loading: true, data: initialApiState() });
        const response = await post({endpoint: "user/authenticate", requireToken: false}, user);
        setState({ loading: false, data: response });
    };

    return { login, loading, data };
}

export function useCreateUser() {
  
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<UserResponse>>(initialApiState);
    const { post } = useFetch<UserResponse>();

    useEffect(() => {
        if (!result.statusCode || result.statusCode === 401) return;

        if (result.data && result.isSuccess) {
            addToast({ title: "Creation Successful", description: "Your account was created successfully" });
        }
        else{
            handleApiErrors(result);
        }
        setIsCreatingUser(false);

    }, [result]);

    const createUser = async (user: FormData) => {
        setResult(initialApiState());
        setIsCreatingUser(true);
        const response = await post({endpoint:"user/create", requireToken: false, contentType:"multipart/form-data"}, user);
        setResult(response);
    };

    return { createUser,result, isCreatingUser };
}

export function useGetByUsername() {
   
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<UserResponse>>(initialApiState);
    const [isGettingByUsername, setIsGettingByUsername] = useState<boolean>(false);
    const { get } = useFetch<UserResponse>();

    useEffect(() => {

        if (!result.statusCode || result.statusCode === 401) return;

        if (result.data && result.isSuccess) {
            addToast({ title: "Oops!", description: "This username is already taken" });
            
        } else if (result.statusCode === 404) {
            setIsAvailable(true);
        }
        else
        {
            handleApiErrors(result);

        }

        setIsGettingByUsername(false);

    }, [result]);

    const getByUsername = async (data: GetByUsernameRequest) => {

        setResult(initialApiState());
        setIsGettingByUsername(true);
        setIsAvailable(false);
        const response = await get({endpoint: "user/by-username?", requireToken: false,}, data );
        setResult(response);

       
      
    };

    return { getByUsername, result,  isAvailable,  setIsAvailable, isGettingByUsername };
}

export function useCloseSession() {
    const [loading, setLoading] = useState<boolean>(false);
    const {logout} = useAuthStore();
    const navigator = useNavigate();
    
    const closeSession = () =>{
        setLoading(true);
        logout();
        setLoading(false);
        navigator("/");
        
    }


    return { closeSession, loading };
}
