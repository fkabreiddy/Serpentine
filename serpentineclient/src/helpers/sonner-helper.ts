import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";

interface ToastConfig {
  title?: string;
  description: string;
  color?: "danger" | "default" | "foreground" | "primary" | "secondary" | "success" 
  
}

export const showToast = ({ title = "", description, color = "foreground" }: ToastConfig): void => {
  addToast({
    title,
    description,
    variant: "solid",
    color:color ,   
    hideIcon: true,
    radius: "lg",
    closeIcon: true,
    classNames:{
      base: cn([
          
        `shadow-md !text-[10px] border-0`
      ])
    }
    
    
  });
};
