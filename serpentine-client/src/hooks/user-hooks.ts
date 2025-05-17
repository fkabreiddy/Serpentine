import { useEffect, useState } from 'react';
import { useFetch } from "@/helpers/axios-helper";
import LoginUserRequest from '@/models/requests/user/login-user-request';
import { addToast } from '@heroui/toast';
import ApiResult from '@/models/api-result';
import { JWTResponse } from '@/models/responses/jwt-response';
import { UserResponse } from '@/models/responses/user-response';
import { GetByUsernameRequest } from '@/models/requests/user/get-by-username';
import { useAuthStore } from '@/contexts/authentication-context';
import { useNavigate } from 'react-router-dom';

interface UseApiState<T> {
    loading: boolean;
    data: ApiResult<T>;
}

const initialApiState = <T>(): ApiResult<T> => ({
    statusCode: 0,
    message: "",
    isSuccess: false,
    errors: [],
    data: null
});

const handleApiErrors = (data: ApiResult<any>) => {
    if (data.statusCode === 400 || data.statusCode === 422) {
        data.errors?.forEach(error => {
            addToast({
                title: "Validation Error",
                description: error,
            });
        });
    }
};

export function useLoginUser() {
    const [{ loading, data }, setState] = useState<UseApiState<JWTResponse>>({
        loading: false,
        data: initialApiState()
    });
    const navigate = useNavigate();
    const { post } = useFetch<JWTResponse>();

    useEffect(() => {
        if (!data.statusCode || data.statusCode === 401) return;

        if (data.data && data.statusCode === 200) {

            let token = data.data.token;
            useAuthStore.getState().login(token);
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
    const [{ loading, data }, setState] = useState<UseApiState<UserResponse>>({
        loading: false,
        data: initialApiState()
    });
    const { post } = useFetch<UserResponse>();

    useEffect(() => {
        if (!data.statusCode || data.statusCode === 401) return;

        if (data.data && data.statusCode === 200) {
            addToast({ title: "Creation Successful", description: "Your account was created successfully" });
        } else if (data.statusCode === 409) {
            addToast({ title: "Creation Failed", description: data.message });
        } else {
            handleApiErrors(data);
        }

        setState(prev => ({ ...prev, loading: false }));
    }, [data]);

    const createUser = async (user: FormData) => {
        setState({ loading: true, data: initialApiState() });
        const response = await post({endpoint:"user/create", requireToken: false, contentType:"multipart/form-data"}, user);
        setState({ loading: false, data: response });
    };

    return { createUser, loading, data };
}

export function useGetByUsername() {
    const [{ loading, data }, setState] = useState<UseApiState<UserResponse>>({
        loading: false,
        data: initialApiState()
    });
    const { get } = useFetch<UserResponse>();

    useEffect(() => {
        if (!data.statusCode || data.statusCode === 401) return;

        if (data.data && data.statusCode === 200) {
            addToast({ title: "Oops!", description: "This username is already taken" });
        } else if (data.statusCode !== 404) {
            handleApiErrors(data);
            if (data.statusCode !== 400 && data.statusCode !== 422) {
                addToast({ title: "An error has occurred", description: data.message });
            }
        }

        setState(prev => ({ ...prev, loading: false }));
    }, [data]);

    const getByUsername = async (data: GetByUsernameRequest) => {
        setState({ loading: true, data: initialApiState() });
        const response = await get({endpoint: "user/by-username?", requireToken: false,}, data );
        setState({ loading: false, data: response });
    };

    return { getByUsername, loading, data };
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
