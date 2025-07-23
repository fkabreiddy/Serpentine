import React from "react";
import { Image } from "@heroui/image";
import Avatar from "boring-avatars";
import { Button } from "@heroui/button";
import { useAuthStore } from "@/contexts/authentication-context";
import { getToken } from "@/helpers/jwt-helper";
import { useNavigate } from "react-router-dom";
import Divider from "@/components/common/divider";
interface LoginWithCurrentAccountProps {
  username: string;
  profilePicture: string | null;
  name: string;
  onDismiss: () => void;
}
export default function LoginWithCurrentAccount({
  username,
  profilePicture,
  onDismiss,
  name,
}: LoginWithCurrentAccountProps): JSX.Element {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const onContinue = () => {
    setUser(() => {}, onSuccess);
  };

  const onSuccess = () => {
    navigate("/home");
  };

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

      {profilePicture ? (
        <Image
          isBlurred
          src={profilePicture}
          width={80}
          height={80}
          className="shrink-0 min-w-[80px] min-h-[80px] rounded-full"
        />
      ) : (
        <Avatar variant="beam" size={80} name={username ?? "adam"} />
      )}
      <div className="flex flex-col items-center gap-1 justify-center">
        <label className="font-semibold text-sm">{name}</label>
        <label className="font-semibold text-xs opacity-50">{username}</label>
      </div>

      <Button
        onPress={onContinue}
        size="sm"
        radius="md"
        className={`w-fit backdrop-blur-xl bg-default-100/80 max-h-9 border border-default-100/20 transition-all text-xs font-semibold`}
      >
        <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
        Continue
      </Button>
      <Divider text="OR" />
      <a
        onClick={onDismiss}
        className={`w-fit opacity-80 cursor-pointer underline text-xs font-semibold`}
      >
        Log in with another account
      </a>
    </div>
  );
}
