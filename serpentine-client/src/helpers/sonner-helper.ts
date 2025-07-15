import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";

interface ToastConfig {
  title: string;
  description: string;
}

export const showToast = ({ title, description }: ToastConfig): void => {
  addToast({
    title,
    description,
    
    hideIcon: true,
    classNames:{
      base: cn([
          
        "backdrop-blur-xl !bg-transparent"
      ])
    }
    
    
  });
};
