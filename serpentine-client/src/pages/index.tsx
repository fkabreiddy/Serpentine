
import CreateUserForm from "@/components/forms/create-user-form";
import LoginForm from "@/components/forms/login-form";
import SerpentineBanner from "@/components/serpentine-banner";
import LoginLayout from "@/layouts/login-layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decode, getToken } from "@/helpers/jwt-helper";
import { useAuthStore } from "@/contexts/authentication-context";
import CreateAccountForm from "@/components/forms/create-account-form";

export default function IndexPage() {

  const navigate = useNavigate();
  const [view, setView] = useState("login");
  useEffect(()=>{

    const decoded = decode();

    if(decoded)
    {
      console.log(decoded);
        const token = getToken();

        if(token)
        {
          
           useAuthStore.getState().login(token);
           navigate("/home");
        }


    }



  }, [])

  const handleViewChange = () => {
    setView(prev => prev === "login" ? "create_account" : "login");
  };

  return (
    <LoginLayout>
     <div className="w-full relative h-screen max-sm:h-fit flex max-sm:flex-col items-center justify-center ">
        <div className="w-full z-[0] static  h-full">
          <SerpentineBanner/>
        </div>
        <div className="w-screen h-screen backdrop-blur-xl absolute z-[1]">
            <div className="grain w-4 h-4 absolute inset-0"></div>

        </div>
      <div className="w-[30%] z-[2] max-md:w-[80%] absolute flex overflow-y-scroll scrollbar-hide items-center justify-center flex-col max-h-screen px-2 py-4">
          {view === "login" ? <LoginForm onViewChange={handleViewChange}/> : <><CreateAccountForm  onClose={handleViewChange}/></> }
        </div>
     </div>
    </LoginLayout>
  );
}
