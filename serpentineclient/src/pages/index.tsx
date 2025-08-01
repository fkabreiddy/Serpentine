import LoginLayout from "@/layouts/login-layout";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/contexts/authentication-context";
import { Spinner } from "@heroui/spinner";
import SerpentineBanner from "@/components/common/serpentine-banner";
import CreateAccountForm from "@/components/users/forms/create-account-form";
import LoginWithCurrentAccount from "@/components/users/forms/login-current-account";
import LoginForm from "@/components/users/forms/login-form";
import { useJwtHelper } from "@/helpers/jwt-helper";

export default function IndexPage() {

  const {user} = useAuthStore();
  const [view, setView] = useState("login");
  const [isMounted, setIsMounted] = useState(false);
  const firstRender = useRef(false);
  const [loginWithCurrent, setLoginWithCurrent] = useState(false);
  const {getToken} = useJwtHelper();
  


  useEffect(()=>{

    if(!firstRender.current)
    {
      firstRender.current = true;
      const token = getToken();
      setIsMounted(true);
      setLoginWithCurrent(token !== null);


    }
    
  }, [])

 

  

  const handleViewChange = () => {
    setView(prev => prev === "login" ? "create_account" : "login");
  };

  if (!isMounted) {return (<div className="h-screen w-screen dark:bg-black   flex items-center justify-center"><Spinner size="sm" color="default" variant="spinner"/></div>)}

  return (
    <LoginLayout>
     <div className="w-full relative h-screen max-sm:h-fit flex max-sm:flex-col items-center justify-center ">
        <div className="w-full z-[0] static  h-full">
          <SerpentineBanner fontSize={1700}/>
        </div>
        <div className="w-screen backdrop-opacity-90 h-screen backdrop-blur-xl absolute z-[1]">
            <div className="grain w-4 h-4 absolute inset-0"></div>

        </div>
      <div className="w-[30%]  z-[2] max-xl:w-[30%] max-md:w-[80%] absolute flex overflow-y-scroll scrollbar-hide items-center justify-center flex-col max-h-screen px-2 py-4">
          {(user && loginWithCurrent) ? <LoginWithCurrentAccount/> :
            <>{view === "login" ? <LoginForm onViewChange={handleViewChange}/> : <><CreateAccountForm  onClose={handleViewChange}/></> }</>
          }
          
        </div>
     </div>
    </LoginLayout>
  );
}
