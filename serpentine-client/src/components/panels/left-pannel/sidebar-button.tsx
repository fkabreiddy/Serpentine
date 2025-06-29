import { useLayoutStore } from '@/contexts/layout-context';
import React, { ReactNode } from 'react'
import IconButton from '../../common/icon-button';

type SideBarButtonProps = {

    children: ReactNode
    text: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function SideBarButton({ text, children, ...rest}:SideBarButtonProps){
    const {layout} = useLayoutStore();
    return(
        <>

        {layout.sideBarExpanded ?  <button
             {...rest}
                className={`$ cursor-pointer rounded-lg group items-center ${layout.sideBarExpanded ? "w-full" : "w-fit"} flex-nowrap  flex gap-2 hover:opacity-100 opacity-80 dark:opacity-100 my-2  dark:bg-neutral-950  dark:hover:bg-neutral-900/80 bg-neutral-100 hover:bg-neutral-200 dark:!text-white text-black  p-2 transition-colors text-sm font-semibold`}
            >
                {children}

                {layout.sideBarExpanded &&
                    <label className='font-normal select-none  text-[13px] opacity-100 text-nowrap'>{text}</label>
                }
                
            </button> :
            <IconButton
                {...rest}
                tooltipText={text}
                placement='right'
                
                >

                {children}
            </IconButton>

            }
        
           
           
        </>
    )
}