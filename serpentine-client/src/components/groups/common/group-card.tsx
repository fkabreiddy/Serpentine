import React from "react";
import { Image } from "@heroui/image";
import { useLayoutStore } from "@/contexts/layout-context";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useNavigate } from "react-router-dom";
import {GroupResponse} from "@/models/responses/group-response.ts";

interface GroupCardProps{
 group: GroupResponse
 
}

const GroupCard : React.FC<GroupCardProps> = ({group}) =>{

    const navigate = useNavigate();
    return(

        <div  className="relative mb-5 last:mb-0" onClick={()=>{navigate("/group/123")}}>
            <div className="absolute left-0 top-3 w-4 h-[10px] border-b-2 border-l-2  dark:border-neutral-800 border-neutral-200 rounded-bl-2xl" />
           
          <div className="flex transition-all   flex-col items-end w-full">

            <div style={{width:"calc(100% - 24px)"}} className=" flex items-center justify-between gap-1">
                <div className="w-full gap-3 flex items-center   ">
                   
                    <div className="flex text-ellipsis overflow-hidden   w-full flex-col gap-0">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold opacity-80 hover:text-blue-600  dark:hover:text-blue-500  cursor-pointer hover:underline">{group.name}</span>
                        </div>
                        {
                            group.lastMessage ?
                            <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                <strong>{group.lastMessage.sender !== null && group.lastMessage.sender.username} </strong> 
                                {group.lastMessage && group.lastMessage.content}
                            </span> : 
                            <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                No messages available.
                            </span>

                        }
                    </div>
                </div>

                {group.unreadMessages > 0 && <div className="w-1 h-1 bg-blue-800 rounded-full mr-4 "/>}
            </div>
           

        </div>
        </div>
        
       
    )
}


const HashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" className="size-3 ">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
    </svg>

)


export default GroupCard;