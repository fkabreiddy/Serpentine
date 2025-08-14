import { motion } from "motion/react";
import MessageBubble from "./message-bubble";
import { ScrollShadow } from "@heroui/react";
import {useActiveChannelsHubStore} from "@/contexts/active-channels-hub-context.ts";
import {useEffect, useRef, useState} from "react";
import {MessageResponse} from "@/models/responses/message-response.ts";
import { HubResult } from "@/models/hub-result";

interface MessagesContainerProps {
    
    groupId: string;
}
export default function MessagesContainer({groupId}:MessagesContainerProps)
{
    
    const [messages, setMessages]= useState<MessageResponse[]>([])

    const {activeChannelsHub} = useActiveChannelsHubStore();
    const firstRender = useRef(false);

    useEffect(() => {

        if (!activeChannelsHub) return;

        const handleMessageRecieved = (result : HubResult<MessageResponse>) =>
        {
            if(!result.data ) return;

            if(result.data.groupId !== groupId) return;
            
            setMessages((prev) => [...prev, result.data as MessageResponse]);
            
            
        }

        activeChannelsHub.on("SendMessage",  handleMessageRecieved );

        return () => {
            activeChannelsHub.off("SendMessage",  handleMessageRecieved );
        };
    }, []);

    return(
        <motion.div className="flex justify-center pt-[60px]  pb-[140px] w-full  h-full ">
               
               <ScrollShadow className="w-[70%]  max-md:w-[90%] overflow-scroll  ">

                   {messages.map((message, _)=>(
                       
                       <MessageBubble message={message} key={message.id.toString()}/>
                   ))}


               </ScrollShadow>
        </motion.div>
    )
}