import CurrentGroupChatroomInfo from "@/components/groups/common/current-group-chatroom-info";
import SendMessageBar from "@/components/groups/common/send-message-bar";
import { useLayoutStore } from "@/contexts/layout-context";
import { ScrollShadow } from "@heroui/scroll-shadow";
import React from "react";
import { useParams } from "react-router-dom";

export default function ChatroomPage(){

    const {layout} = useLayoutStore();
    const {id} = useParams();
    return(
        <>
            <ScrollShadow  className="  h-full z-[1] relative shadow-inner  shadow-white dark:shadow-black">
                <div className="doodle-pattern opacity-10 -z-[1]"/>
                <CurrentGroupChatroomInfo/>
                <SendMessageBar/>
            </ScrollShadow>

        </>
      
    )
} 