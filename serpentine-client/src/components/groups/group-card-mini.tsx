import React from "react";
import { Image } from "@heroui/image";
import { motion } from "motion/react";
interface GroupCardMiniProps{

    cover? : string | null, 
    index: number
}

const GroupCardMini:React.FC<GroupCardMiniProps> = ({cover = null, index}) =>{

    return(
        <motion.div
            key={index + "m-gr-mini"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0}}
            transition={{delay: index / 3}}
            className="flex flex-col gap-1 relative"
        >
             <div className="rounded-full bg-default-50 w-5 h-5 flex items-center hover:bg-blue-600 z-[0]  hover:text-white cursor-pointer transition-all justify-center">
                {cover === "" || cover === null ? <HashIcon/> : <Image isBlurred  className="h-5 w-5 rounded-full z-[0]" src={cover}/>}
            </div>
        </motion.div>
       
    
    )
}

const HashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.7" stroke="currentColor" className="size-3 ">
    <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
    </svg>

)

export default GroupCardMini;