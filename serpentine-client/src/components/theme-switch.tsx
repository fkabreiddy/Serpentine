import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@heroui/use-theme";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme("dark");

  useEffect(() => {
    setIsMounted(true);
    const mode = localStorage.getItem("heroui-theme");
    setTheme(mode ?? "dark");
  }, []);

  if (!isMounted) return <div className="w-6 h-6" />;

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const isDark = theme === "dark";

  return (
    <div className="cursor-pointer" onClick={toggleTheme}>
      <LightbulbIcon/>
    </div>
  );
};


const LightbulbIcon = () =>(

    
    <div className="p-[6px] bg-yellow-500/80 hover:scale-[102%] rounded-full cursor-pointer hover:bg-yellow-500 transition-background !text-white  flex items-center justify-center">
         <motion.div
            key="setting-icon"
            whileHover={{ rotate: 30 }}
            animate={{ rotate: 0 }}
            exit={{ rotate: -30}}
            className="flex flex-col gap-1 relative"
        >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>


        </motion.div>
       
       
    </div>
        

)