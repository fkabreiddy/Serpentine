import { useAuthStore, UserIdentity } from "@/contexts/authentication-context";
import { JwtPayload } from "@/models/responses/jwt-response";
import { UserResponse } from "@/models/responses/user-response";
import { jwtDecode } from "jwt-decode";
const TOKEN_KEY = "serpentine-token" as const;

export const useJwtHelper = ()=>{

  const {setAuthenticationState} = useAuthStore();

  const getToken = () : string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    authenticationStateHasChanged();
    return token;
  }


   const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    authenticationStateHasChanged();
  }

   const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    authenticationStateHasChanged();
  }

  const isTokenExpired = (exp: number): boolean => {
    return exp < Date.now() / 1000;
  }

  const  authenticationStateHasChanged = (): UserIdentity | null => {


    try {
      
      const token   = localStorage.getItem(TOKEN_KEY);


      if (!token)
      {
        setAuthenticationState(null);
        return null;
      } 

      const decoded = jwtDecode<JwtPayload>(token);

      if (!decoded || !decoded.exp){

        setAuthenticationState(null);
        return null;
      }

      if (isTokenExpired(decoded.exp)){

        setAuthenticationState(null);
        return null
      };

      const user: UserIdentity = {
        username: decoded.nickname,
        fullName: decoded.name,
        age: decoded.age,
        dayOfBirth: new Date(decoded.birthdate),
        createdAt: new Date(decoded.createdAt),
        profilePictureUrl: decoded.picture,
        id: decoded.sub,
      };

      setAuthenticationState(user);
      return user;
    } catch (error) {
      return null;
    }
  }

  return{

    getToken,
    setToken,
    removeToken
  }
}



