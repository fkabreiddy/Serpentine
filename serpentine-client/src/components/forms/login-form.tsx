import * as React from "react";
import {Button} from "@heroui/button";
import {Input} from "@heroui/input";
import LoginUserRequest from "@/models/requests/user/login-user-request";
import { useLoginUser } from "../../hooks/user-hooks";
export default function LoginForm() {
    const [loginUserRequest, setLoginUserRequest] = React.useState<LoginUserRequest>({
        userName: "",
        password: ""
    });

    const { login, data, loading, isSuccess, message, errors } = useLoginUser();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginUserRequest(prev => ({
          ...prev,
          [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(loginUserRequest);
       
    };

    const passwordIcon : React.ReactNode = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" className={"size-4"}>
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>

    const userIcon : React.ReactNode =<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={"size-5"}>
    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
    </svg>

   
    

    return(
        <>
            <p className={"text-xl my-2 font-semibold"}>Welcome to Serpentine</p>
            <form onSubmit={handleSubmit} className="w-[40%] max-sm:w-full flex flex-col  gap-3  mt-4">
           
                <div className="flex flex-col gap-1">
                    <label className="text-sm  font-semibold ml-1 text-start">Username</label>
                    <Input
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter your user name"
                        name="userName"
                        endContent={userIcon}
                        minLength={3}
                        maxLength={30}
                        radius="md"
                        required={true}
                    
                        description="Not need to put @"
                        />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold ml-1 text-start">Password</label>
                    <Input
                        type="password"
                        onChange={handleChange}
                        placeholder="Enter your password"
                        name="password"
                        endContent={passwordIcon}
                        minLength={8}
                        maxLength={30}
                        radius="md"
                        required={true}

                    
                        description="Password must be at least 8 characters."
                        />
                </div>

                <Button isDisabled={loading || loginUserRequest.password === "" || loginUserRequest.userName === ""} color="primary" type="submit" className="w-full transition-all hover:scale-[105%] mt-4 text-sm font-semibold" variant="solid" size="sm">
                    Login   
                </Button>

                
            </form>


        </>
    )
}
