import { create } from 'zustand';
import { decode, setToken, removeToken } from '@/helpers/jwt-helper';
import { JwtPayload } from '@/models/responses/jwt-response';
import { UserResponse } from '@/models/responses/user-response';
import { picture } from 'motion/react-client';
import { showToast } from '@/helpers/sonner-helper';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  username: string | null;
  userId: number | null;
  userPofilePicture:string | null
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: ()=>void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  userId: null,
  userPofilePicture: null,
  isAuthenticated: decode() !== null,
  login: (token: string) => {
    setToken(token);
    const navigate = useNavigate();
    const payload : JwtPayload | null = decode();
    let username: string | null = null;
    let userId: number | null = null;
    let pfp : string | null = null;

    if(payload)
    {
        username = payload.nickname;
        userId = parseInt(payload.sub);
        pfp = payload.picture;
    }

    if(!payload)
    {
        removeToken();
        showToast({title: "Oops!", description:"Your session has expired"})
        navigate("/");

    }
   

    set({
      userPofilePicture: pfp,
      username: username,
      userId: userId,
      isAuthenticated: payload !== null,
    });
  },
  setUser: () =>{
    const payload : JwtPayload | null = decode();
    let username: string | null = null;
    let userId: number | null = null;
    let pfp : string | null = null;

    if(payload)
    {
        username = payload.nickname;
        userId = parseInt(payload.sub);
        pfp = payload.picture;
    }

    console.log(payload);

    if(!payload)
    {
        removeToken();
    }
   

    set({
      userPofilePicture: pfp,
      username: username,
      userId: userId,
      isAuthenticated: payload !== null,
    });
  },

  logout: () => {
    removeToken();
    set({
      username: null,
      userId: null,
      isAuthenticated: false,
    });
  },
}));