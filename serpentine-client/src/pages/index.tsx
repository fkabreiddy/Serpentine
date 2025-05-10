
import CreateUserForm from "@/components/forms/create-user-form";
import LoginForm from "@/components/forms/login-form";
import SerpentineBanner from "@/components/serpentine-banner";
import { ThemeSwitch } from "@/components/theme-switch";
import LoginLayout from "@/layouts/login-layout";
import { useState } from "react";

export default function IndexPage() {

  const [view, setView] = useState("login");


  const handleViewChange = () => {
    setView(prev => prev === "login" ? "create_account" : "login");
  };

  return (
    <LoginLayout>
     <div className="w-full  h-screen max-sm:h-fit flex max-sm:flex-col items-center justify-center ">
        <div className="w-full max-sm:h-[50vh]   relative h-full">
          <SerpentineBanner/>
        </div>
        <div className="w-full flex overflow-auto scrollbar-hide  items-center   justify-center flex-col h-fit  max-h-full max-sm:max-h-fit px-6 py-6">
          <ThemeSwitch/>
          <div className="grain w-4 h-4 absolute inset-0"></div>
          {view === "login" ? <LoginForm onViewChange={handleViewChange}/> : <><CreateUserForm  onViewChanged={handleViewChange}/></> }
        </div>
     </div>
    </LoginLayout>
  );
}
