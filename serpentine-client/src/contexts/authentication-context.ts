import { create } from 'zustand';
import { decode, setToken, removeToken } from '@/helpers/jwt-helper';
import { JwtPayload } from '@/models/responses/jwt-response';

interface AuthState {
  username: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  userId: null,
  isAuthenticated: decode() !== null,
  login: (token: string) => {
    setToken(token);
    const payload : JwtPayload | null = decode();
    let username: string | null = null;
    let userId: number | null = null;

    if(payload)
    {
        username = payload.nickname;
        userId = parseInt(payload.sub)
    }

    if(!payload)
    {
        removeToken();
    }
   

    set({
      
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