import { addToast } from "@heroui/toast";
import { cn } from "@heroui/theme";
import {MessageBubbleIcon} from "@/pages/chatroom-page.tsx";
import {ReactNode} from "react";

interface ToastConfig {
  title?: string;
  description: string;
  color?: "danger" | "default" | "foreground" | "primary" | "secondary" | "success" 
  
}

export const showToast = ({ title = "", description, color = "foreground" }: ToastConfig): void => {
  addToast({
    title,
    description,
    shouldShowTimeoutProgress: true,
    variant: "solid",
    size: "lg",
 
    color:color ,   
    radius: "lg",
    closeIcon: true,
    classNames:{
      base: cn([
          
        `shadow-md z-[-2] !text-[10px] border-0`
      ])
    }
    
    
  });
};

export const showMessageNotification = ({ title = "", description, color = "foreground" }: ToastConfig): void => {
  

  addToast({
    title,
    description,
    shouldShowTimeoutProgress: true,
    variant: "solid",
    icon: MessageBubbleIcon,
    size: "lg",
    color:color ,
    radius: "lg",
    closeIcon: true,
    classNames:{
      base: cn([

        `shadow-md z-[-2] !text-[10px] border-0`
      ])
    }


  });
};


