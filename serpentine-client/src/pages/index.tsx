import LoginForm from "@/components/forms/login-form";
import SerpentineBanner from "@/components/serpentine-banner";
import LoginLayout from "@/layouts/login-layout";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/contexts/authentication-context";
import CreateAccountForm from "@/components/forms/create-account-form";
import { Spinner } from "@heroui/spinner";
import LoginWithCurrentAccount from "@/components/forms/login-current-account";

export default function IndexPage() {

  const {user, setUser} = useAuthStore();
  const [view, setView] = useState("login");
  const [isMounted, setIsMounted] = useState(false);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState<boolean>(false);
  
  


  useEffect(()=>{


    setUser(() => {}, ()=>{});   
    setIsMounted(true);

  }, [])

  useEffect(()=>{

    if(user)
    {
      setIsAlreadyLoggedIn(true);
    }

  }, [user])

  const handleDismiss = () =>{
    useAuthStore.getState().logout();
    setIsAlreadyLoggedIn(false);
  }

  const handleViewChange = () => {
    setView(prev => prev === "login" ? "create_account" : "login");
  };

  if (!isMounted) {return (<div className="h-screen w-screen dark:bg-black   flex items-center justify-center"><Spinner size="sm" color="default" variant="spinner"/></div>)}

  return (
    <LoginLayout>
     <div className="w-full relative h-screen max-sm:h-fit flex max-sm:flex-col items-center justify-center ">
        <div className="w-full z-[0] static  h-full">
          <SerpentineBanner/>
        </div>
        <div className="w-screen backdrop-opacity-90 h-screen backdrop-blur-xl absolute z-[1]">
            <div className="grain w-4 h-4 absolute inset-0"></div>

        </div>
      <div className="w-[30%]  z-[2] max-xl:w-[30%] max-md:w-[80%] absolute flex overflow-y-scroll scrollbar-hide items-center justify-center flex-col max-h-screen px-2 py-4">
        {user && isAlreadyLoggedIn ? <LoginWithCurrentAccount onDismiss={handleDismiss} username={user?.nickname ?? ""} name={user?.name ?? ""} profilePicture={user?.picture ?? ""} /> :       
            <>
              {view === "login" ? <LoginForm onViewChange={handleViewChange}/> : <><CreateAccountForm  onClose={handleViewChange}/></> }
            </>   
        }
        </div>
     </div>
    </LoginLayout>
  );
}
