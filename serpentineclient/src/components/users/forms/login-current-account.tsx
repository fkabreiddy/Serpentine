import React from "react";
import { Image } from "@heroui/image";
import Avatar from "boring-avatars";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import Divider from "@/components/common/divider";
import UserAvatar from "../common/user-avatar";
import { JwtHelper } from "@/helpers/jwt-helper";

export default function LoginWithCurrentAccount() {
  const navigate = useNavigate();
  const {user} = useAuthStore();
      const {removeToken} = JwtHelper();
  

  const dismiss = () =>{
    removeToken();
  }

  const accept = () => {
    navigate("/home");
  };

  if(!user) return <></>;

  return (
    <div className="w-full flex items-center justify-center flex-col gap-5">
      <div>
        <h2 className=" text-center text-3xl  font-semibold">
          You are already logged in!{" "}
        </h2>
        <h5 className="text-sm text-center mt-1 opacity-80">
          Do you wanna continue with this account?
        </h5>
      </div>

      <UserAvatar size={80} isBlurred={true} src={user?.profilePictureUrl ?? null} userNameFallback={user?.username} />
      <div className="flex flex-col items-center gap-1 justify-center">
        <label className="font-semibold text-sm">{user.username}</label>
        <label className="font-semibold text-xs opacity-50">{user.fullName}</label>
      </div>

      <Button
        onPress={accept}
        size="sm"
        radius="md"
        className={`w-fit backdrop-blur-xl bg-default-100/80 max-h-9 border border-default-100/20 transition-all text-xs font-semibold`}
      >
        <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
        Continue
      </Button>
      <Divider text="OR" />
      <a
        onClick={dismiss}
        className={`w-fit opacity-80 cursor-pointer underline text-xs font-semibold`}
      >
        Log in with another account
      </a>
    </div>
  );
}
