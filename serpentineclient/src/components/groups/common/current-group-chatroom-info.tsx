import IconButton from "@/components/common/icon-button";
import { ArrowLeftIcon, MoreVertical, X } from "lucide-react";
import React, { ReactNode } from "react"
import { useNavigate } from "react-router-dom";

export default function CurrentGroupChatroomInfo(){
const navigate = useNavigate();
    return(

        <>
            <div className="  w-full  pb-4 py-2 px-3  absolute left-0 top-0 flex flex-col items-center">
            
                <div className="w-[70%]  flex justify-between items-center  p-3 max-md:w-[90%]   ">
                    <div className="flex gap-3 items-center">
                        <IconButton tooltipText="Close" onClick={() => navigate("/home")}>
                            <X className="size-[18px]"/>
                        </IconButton>
                        <div className="dark:bg-neutral-900 bg-neutral-200 py-2 px-2 rounded-md">
                            <p className="text-xs"><strong>#maegor-fans / </strong>House of the dragon</p>
                        </div>

                    </div>
                  
                    <IconButton tooltipText="About">
                        <MoreVertical className="size-[18px]"/>
                    </IconButton>
                </div>
            </div>
        </>
    )
}

interface ContextButtonProps{

    children: ReactNode;
}

const ContextButton = ({children}:ContextButtonProps) =>(

    <button className="rounded-full dark:bg-neutral-950/20 bg-neutral-50/20  p-2 flex items-center justify-center backdrop-blur-xl  backdrop-opacity-70 shadow-inner dark:shadow-neutral-900/70 shadow-neutral-100/70 dark:border-neutral-900/70 border-neutral-100/70 ">
        {children}
     </button>
)