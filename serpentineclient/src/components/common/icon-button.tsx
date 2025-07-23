import { Tooltip } from "@heroui/tooltip";
import React from "react";

type IconButtonProps = {
  children: React.ReactNode;
  tooltipText: string;
  placement?: "top" | "bottom" | "left" | "right";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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
        <button
          onClick={(e) => {
            if (onClick) onClick(e);
          }}
          {...rest}
          className={`!max-w-fit p-1 backdrop-blur-xl border-default-50 rounded-lg dark:bg-default-100/50 bg-default-200/50 !text-neutral-600 dark:!text-neutral-50 cursor-pointer max-h-9 border border-default-100/20 transition-all text-sm font-semibold`}
        >
          <div className="grain w-4 h-4 absolute inset-0 opacity-50 rounded-lg" />
          {children}
        </button>
      </Tooltip>
    </>
  );
}
