import { Tooltip } from "@heroui/tooltip";
import React from "react";

type IconButtonProps = {
  children: React.ReactNode;
  tooltipText: string;
  placement?: "top" | "bottom" | "left" | "right";
} & React.ButtonHTMLAttributes<HTMLDivElement>;

export default function IconButton({
  children,
  onClick,
  placement = "bottom",
  tooltipText: tootltipText,
  ...rest
}: IconButtonProps) {
  return (
    <>
      <Tooltip content={tootltipText} size="sm" placement={placement}>
        <div
          onClick={(e) => {
            if (onClick) onClick(e);
          }}
      
          className={`!max-w-fit p-1   backdrop-blur-xl  rounded-lg dark:bg-neutral-900/50 bg-neutral-200/50 !text-neutral-600 dark:!text-neutral-300 cursor-pointer max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
          
        >
          <div className="grain w-4 h-4 absolute inset-0 opacity-50 rounded-lg" />
          {children}
        </div>
      </Tooltip>
    </>
  );
}
