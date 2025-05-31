import { useTheme } from "@heroui/use-theme";
import { useEffect } from "react";


export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { theme, setTheme } = useTheme("dark");
    
      useEffect(() => {
        setTheme("dark");
      }, []);
      
    return (
      <div className="relative flex flex-col  h-screen">
       
       
        {children}
      
        
      </div>
    );
  }
  