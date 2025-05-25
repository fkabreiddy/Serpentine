import * as React from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import * as motion from "motion/react-client";
import { ThemeSwitch } from "../theme-switch";
import LoginUserRequest from "@/models/requests/user/login-user-request";
import { useLoginUser } from "../../hooks/user-hooks";
import { Input } from "@heroui/input";

interface LoginFormProps {
    onViewChange: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onViewChange }) => {
    const [loginUserRequest, setLoginUserRequest] = React.useState<LoginUserRequest>({
        userName: "",
        password: "",
    });

    const { login, loading } = useLoginUser();
    const isInvalid = loading || !loginUserRequest.password || !loginUserRequest.userName;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginUserRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(loginUserRequest);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col relative items-center gap-6 justify-center"
        >
            <ThemeSwitch />
            <p className="text-2xl my-2 font-semibold">Welcome to Serpentine</p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-4">
                <Input
                    label="Username"
                    type="text"
                    name="userName"
                    placeholder="Enter your user name"
                    endContent={<UserIcon />}
                    minLength={3}
                    maxLength={30}
                    labelPlacement="outside"
                    autoComplete="username"
                    description="Not need to put @"
                    onChange={handleChange}
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    minLength={8}
                    maxLength={30}
                    labelPlacement="outside"
                    autoComplete="current-password"
                    endContent={<PasswordIcon/>}
                    description="Password must be at least 8 characters."
                    onChange={handleChange}
                />

                {loading ? (
                    <Spinner color="default" size="sm" classNames={{ label: "text-foreground mt-4" }} variant="spinner" />
                ) : (
                    <Button
                        isDisabled={isInvalid}
                        type="submit"
                        className={`w-full backdrop-blur-xl bg-default-100/80 ${
                            isInvalid ? "opacity-50" : ""
                        } max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
                    >
                        <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
                        Log in
                    </Button>
                )}
            </form>

            <Divider />
            <p onClick={onViewChange} className="text-sm font-normal text-center underline cursor-pointer">
                Create an account
            </p>
        </motion.div>
    );
};



const Divider = () => (
    <div className="w-[60%] max-sm:w-[80%] max-xs:w-[90%] items-center mt-7 flex gap-3">
        <hr className="w-full border rounded-full opacity-30" />
        <p className="text-xs text-nowrap opacity-30">OR</p>
        <hr className="w-full border rounded-full opacity-30" />
    </div>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 opacity-50">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
    </svg>
);

const PasswordIcon  = ()  => (
   
   
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="size-4 opacity-50">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
      

   
   
);

export default LoginForm;
