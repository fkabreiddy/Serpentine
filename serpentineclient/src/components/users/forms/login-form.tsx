import * as React from "react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import * as motion from "motion/react-client";
import {
  LoginUserRequest,
  loginUserSchema,
} from "@/models/requests/user/login-user-request";
import { Input } from "@heroui/input";
import { useLoginUser } from "@/hooks/user-hooks";
import Divider from "@/components/common/divider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  onViewChange: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onViewChange }) => {
  const {
    register,
    handleSubmit,

    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { loginUser, isLoggingIn } = useLoginUser();

  const submit = async (data: LoginUserRequest) => {
    await loginUser(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col relative items-center gap-6 justify-center"
    >
      <p className="text-2xl my-2 font-bold opacity-60">
        Welcome to Serpentine
      </p>

      <form
        onSubmit={handleSubmit((data) => submit(data))}
        className="w-full flex flex-col gap-3 mt-4"
      >
        <Input
          label="Username"
          type="text"
          value={watch("username")}
          placeholder="Enter your user name"
          endContent={<UserIcon />}
          minLength={3}
          maxLength={30}
          labelPlacement="outside"
          autoComplete="username"
          description="Not need to put @"
          {...register("username")}
          errorMessage={errors.username?.message}
          isInvalid={errors.username?.message !== undefined}
        />

        <Input
          label="Password"
          type="password"
          value={watch("password")}
          placeholder="Enter your password"
          minLength={8}
          maxLength={30}
          labelPlacement="outside"
          autoComplete="current-password"
          endContent={<PasswordIcon />}
          description="Password must be at least 8 characters."
          {...register("password")}
          errorMessage={errors.password?.message}
          isInvalid={errors.password?.message !== undefined}
        />

        <Button
          isDisabled={!isValid || isLoggingIn}
          type="submit"
          isLoading={isLoggingIn}
          className={`w-full backdrop-blur-xl bg-default-100/80 ${
            !isValid ? "opacity-50" : ""
          } max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
        >
          <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
          Log in
        </Button>
      </form>

      <Divider text="OR" />
      <p
        onClick={onViewChange}
        className="text-sm font-normal text-center underline cursor-pointer"
      >
        Create an account
      </p>
    </motion.div>
  );
};

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-5 opacity-50"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
    />
  </svg>
);

const PasswordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.7"
    stroke="currentColor"
    className="size-4 opacity-50"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

export default LoginForm;
