import React from "react";
import { Image } from "@heroui/image";
import { useLayoutStore } from "@/contexts/layout-context";

interface GroupCardProps{
 cover? : string | null, 
}

const GroupCard : React.FC<GroupCardProps> = ({cover = null}) =>{

    return(

        <li className="flex transition-all hover:bg-default-50/20 border-t border-neutral-900/20 flex-col items-end w-full">

            <div className="w-full flex items-center justify-between gap-1">
                 <div className="  w-full gap-3 flex items-center   ">
                   
                    <div className="flex text-ellipsis overflow-hidden   w-full flex-col gap-0">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold opacity-80 hover:text-blue-500 hover:underline">Group name</span>
                        </div>
                        <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">fka.breiddy: hola</span>
                    </div>
                </div>

                <div className="w-1 h-1 bg-blue-800 rounded-full mr-4 "/>
            </div>
           

        </li>
       
    )
}


const HashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" className="size-3 ">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
    </svg>

)


export default GroupCard;