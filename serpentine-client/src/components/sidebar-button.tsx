import { useLayoutStore } from '@/contexts/layout-context';
import React, { ReactNode } from 'react'

type SideBarButtonProps = {

    children: ReactNode
    text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function SideBarButton({ text, children, ...rest}:SideBarButtonProps){
    const {layout} = useLayoutStore();
    return(
        <>
            <button
             {...rest}
                className={`$ cursor-pointer group items-center ${layout.sideBarExpanded ? "w-full" : "w-fit"}  flex gap-2 hover:opacity-100 opacity-70 dark:opacity-90 rounded-lg  hover:dark:bg-default-100/30  hover:bg-neutral-100 dark:!text-white text-black  p-2 transition-colors text-sm font-semibold`}
            >
                {children}

                {layout.sideBarExpanded && 
                    <label className='font-normal group-hover:text-blue-600 text-[13px] opacity-100'>{text}</label>
                }
            </button>
        </>
    )
}