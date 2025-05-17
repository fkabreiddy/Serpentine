import React from "react";
import { Image } from "@heroui/image";

interface GroupCardProps{
 cover? : string | null, 
}

const GroupCard : React.FC<GroupCardProps> = ({cover = null}) =>{
    return(
        <div className="flex flex-col items-end w-full">

            <li className=" p-3 w-full gap-3 flex items-center  ">
                <div className="rounded-full shrink-0 bg-default-50 w-6 h-6 flex items-center hover:bg-blue-600 z-[0]  hover:text-white cursor-pointer transition-all justify-center">
                                {cover === "" || cover === null ? <HashIcon/> : <Image   className="h-6 w-6 rounded-full z-[0]" src={cover}/>}
                </div>
                <div className="flex text-ellipsis overflow-hidden   w-full flex-col gap-0">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold opacity-80 hover:text-blue-600 hover:underline">Group name</span>
                    </div>
                    <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">fka.breiddy: hola</span>
                </div>
            </li>

        </div>
       
    )
}


const HashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" className="size-3 ">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
    </svg>

)


export default GroupCard;