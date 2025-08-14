import { motion } from "motion/react";
import MessageBubble from "./message-bubble";
import { ScrollShadow } from "@heroui/react";

export default function MessagesContainer()
{

    return(
        <motion.div className="flex justify-center pt-[60px]  pb-[140px] w-full  h-full ">
               
               <ScrollShadow className="w-[70%]  max-md:w-[90%] overflow-scroll  ">
                <MessageBubble/>
                <MessageBubble/>
                <MessageBubble/>

                <MessageBubble withImage={true}/>

               </ScrollShadow>
        </motion.div>
    )
}