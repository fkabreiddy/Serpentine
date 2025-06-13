import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";
import { useSound } from 'react-sounds';

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
