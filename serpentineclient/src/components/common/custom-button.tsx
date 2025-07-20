import { Button, ButtonProps } from "@heroui/button";

type CustomButtonProps = {
} & React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps ;

export default function CustomButton({children, ...props}: CustomButtonProps) {
    return (
       <Button
       
        className={` ${props.className} w-full backdrop-blur-xl bg-default-100/80  max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
        >
            <div className="grain w-4 h-4 absolute inset-0 opacity-50" />
            {children}
        </Button>
    );
}