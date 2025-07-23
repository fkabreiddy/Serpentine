import { create } from "zustand";
import { decode, setToken, removeToken } from "@/helpers/jwt-helper";
import { JwtPayload } from "@/models/responses/jwt-response";
import { showToast } from "@/helpers/sonner-helper";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface AuthState {
  username: string | null;
  userId: string | null;
  user: JwtPayload | null;
  userPofilePicture: string | null;
  isAuthenticated: boolean;
  login: (
    token: string,
    onFailure?: () => void,
    onSuccess?: () => void
  ) => void;
  logout: () => void;
  setUser: (onFailure?: () => any, onSuccess?: () => any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  userId: null,
  user: null,
  userPofilePicture: null,
  isAuthenticated: decode() !== null,
  login: (
    token: string,
    onSuccess: () => any = () => {},
    onFailure: () => any = () => {}
  ) => {
    setToken(token);
    const payload: JwtPayload | null = decode();
    let username: string | null = null;
    let userId: string | null = null;
    let pfp: string | null = null;

    if (payload) {
      username = payload.nickname;
      userId = payload.sub;
      pfp = payload.picture;
    }

    if (!payload) {
      removeToken();
      showToast({ title: "Oops!", description: "Your session has expired" });
      onFailure.call(this);
    }

    set({
      userPofilePicture: pfp,
      username: username,
      userId: userId,
      user: payload,
      isAuthenticated: payload !== null,
    });

    onSuccess.call(this);
  },
  setUser: (
    onFailure: () => any = () => {},
    onSuccess: () => any = () => {}
  ) => {
    const payload: JwtPayload | null = decode();
    let username: string | null = null;
    let userId: string | null = null;
    let pfp: string | null = null;

    if (payload) {
      username = payload.nickname;
      userId = payload.sub;
      pfp = payload.picture;
    }

    if (!payload) {
      removeToken();
      onFailure.call(this);
      return;
    }

    set({
      userPofilePicture: pfp,
      username: username,
      user: payload,
      userId: userId,
      isAuthenticated: payload !== null,
    });

    onSuccess.call(this);
  },

  logout: () => {
    removeToken();
    set({
      username: null,
      userId: null,
      userPofilePicture: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
