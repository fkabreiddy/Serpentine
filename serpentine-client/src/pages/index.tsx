
import LoginForm from "@/components/forms/login-form";
import SerpentineBanner from "@/components/serpentine-banner";
import { ThemeSwitch } from "@/components/theme-switch";
import LoginLayout from "@/layouts/login-layout";


export default function IndexPage() {
  return (
    <LoginLayout>
     <div className="w-screen h-screen max-sm:h-[50vh] flex max-sm:flex-col items-center justify-center ">
        <div className="w-full  relative h-full">
          <SerpentineBanner/>
        </div>
        <div className="w-full flex items-center justify-center flex-col h-full px-6 py-6">
          <ThemeSwitch/>
          <LoginForm/>
        </div>
     </div>
    </LoginLayout>
  );
}
