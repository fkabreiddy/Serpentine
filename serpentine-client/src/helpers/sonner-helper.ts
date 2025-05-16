import { addToast } from "@heroui/toast";

interface ToastConfig {
  title: string;
  description: string;
}

export const showToast = ({ title, description }: ToastConfig): void => {
  addToast({
    title,
    description,
    hideIcon: true,
    
  });
};
