
import CreateUserForm from "@/components/forms/create-user-form";
import LoginForm from "@/components/forms/login-form";
import SerpentineBanner from "@/components/serpentine-banner";
import LoginLayout from "@/layouts/login-layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decode, getToken } from "@/helpers/jwt-helper";
import { useAuthStore } from "@/contexts/authentication-context";

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
     <div className="w-full  h-screen max-sm:h-fit flex max-sm:flex-col items-center justify-center ">
        <div className="w-[60%] max-sm:h-[50vh] max-md:w-full   relative h-full">
          <SerpentineBanner/>
        </div>
        <div className="w-[40%]  max-md:w-full  flex overflow-auto scrollbar-hide  items-center   justify-center flex-col h-fit  max-h-full max-sm:max-h-fit px-2 py-6">
          <div className="grain w-4 h-4 absolute inset-0"></div>
          {view === "login" ? <LoginForm onViewChange={handleViewChange}/> : <><CreateUserForm  onViewChanged={handleViewChange}/></> }
        </div>
     </div>
    </LoginLayout>
  );
}
