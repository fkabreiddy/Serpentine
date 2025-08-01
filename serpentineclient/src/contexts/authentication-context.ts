import { create } from "zustand";
import { JwtPayload } from "@/models/responses/jwt-response";
import { showToast } from "@/helpers/sonner-helper";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UserResponse } from "@/models/responses/user-response";

export interface UserIdentity{

  fullName: string,
  username: string,
  profilePictureUrl?: string | null,
  age: number,
  createdAt: Date,
  id: string,
  dayOfBirth: Date

}


interface AuthState {
  
  user: UserIdentity | null
  isAuthenticated:boolean
  setAuthenticationState: (user: UserIdentity | null)=> void
 
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuthenticationState: (user: UserIdentity | null) =>{



    set((state)=>({

      ...state,
      user: user,
      isAuthenticated: user !== null

    }))
  }
  
}));
