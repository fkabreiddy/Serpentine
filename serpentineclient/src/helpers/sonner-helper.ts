import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";

interface ToastConfig {
  title?: string;
  description: string;
  color?: string
}

export const showToast = ({ title = "", description, color = "neutral" }: ToastConfig): void => {
  addToast({
    title,
    description,
    
    hideIcon: true,
    radius: "lg",
    closeIcon: true,
    classNames:{
      base: cn([
          
        `shadow-md !text-[10px] border-0 bg-${color.trim()}-100 dark:bg-${color.trim()}-900 `
      ])
    }
    
    
  });
};
