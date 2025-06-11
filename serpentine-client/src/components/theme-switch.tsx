import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@heroui/use-theme";
import { Lightbulb, MoonIcon, SunIcon } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import IconButton from "./icon-button";
export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme("light");

  useEffect(() => {
    setIsMounted(true);
    const mode = localStorage.getItem("heroui-theme");
    setTheme(mode ?? "light");
  }, []);

  if (!isMounted) return <div className="w-6 h-6" />;

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const isDark = theme === "light";

  return (
    <div className="cursor-pointer" onClick={toggleTheme}>
      <LightbulbIcon theme={theme}/>
    </div>
  );
};

interface LightBulbIconProps {
  theme: string
}

const LightbulbIcon = ({theme } : LightBulbIconProps) =>(

    
   <IconButton tootltipText={theme + " mode"}>
              <motion.div
                  key="setting-icon"
                  whileHover={{ rotate: 30 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -30}}
                  className="flex flex-col gap-1 relative"
              >
                {theme === "dark" ? <SunIcon className="size-5"/> : <MoonIcon className="size-5"/>}

              </motion.div>
          
          
       </IconButton>
        

)