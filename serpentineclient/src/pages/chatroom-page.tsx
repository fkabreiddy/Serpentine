import DotsPatter from "@/components/common/dots-pattern";
import WarmBeigeBg from "@/components/common/warm-beige-bg";
import CurrentGroupChatroomInfo from "@/components/groups/common/current-group-chatroom-info";
import SendMessageBar from "@/components/groups/common/send-message-bar";
import MessagesContainer from "@/components/messages/common/messages-container";
import { useLayoutStore } from "@/contexts/layout-context";
import { useGetChannelMemberByUserAndChannelId } from "@/hooks/channel-member-hooks";
import { useGetGroupById } from "@/hooks/group-hooks";
import { ScrollShadow } from "@heroui/scroll-shadow";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useActiveChannelsHubStore} from "@/contexts/active-channels-hub-context.ts";
import { MessageCircleIcon } from "lucide-react";

export default function ChatroomPage(){

    const {layout} = useLayoutStore();
    const {groupId} = useParams();
    const {getGroupById, group, searchingGroup} = useGetGroupById();
    const [hasPermisson, setHasPermisson] = useState<boolean>(false);
    
    const {getChannelMemberByUserAndChannelId, channelMember, loadingChannelMember} = useGetChannelMemberByUserAndChannelId();

  
    
    const fetchGroup = async(id: string)=>{

        await getGroupById({groupId: id});

    }
    const fetchPermisson = async (channelId: string) =>{

        await getChannelMemberByUserAndChannelId({channelId: channelId });
    }
    
    useEffect(()=>{

        if(groupId)
        {
            fetchGroup(groupId);
            

        }
    },[groupId])


    useEffect(()=>{

        if(channelMember)
        {
            
            if(group?.public)
            {
                setHasPermisson(true)
            }
            else{

                if(!channelMember.isAdmin || !channelMember.isOwner)
                    setHasPermisson(false);
                    
                setHasPermisson(channelMember.isOwner || channelMember.isAdmin);
            }
        }
    },[channelMember])


    useEffect(()=>{

        if(group)
        {
            fetchPermisson(group.channelId);
        }
    },[group])
    
    
    return(
        <>
            <ScrollShadow  className="  h-full z-[1] relative shadow-inner  shadow-white dark:shadow-black">
                <div className="doodle-pattern opacity-10 -z-[1]"/>
                {group && 
                   <CurrentGroupChatroomInfo group={group}/>
                }

                {group && 
                    <MessagesContainer groupId={group.id}/>
                }

                <SendMessageBar group={group} loading={loadingChannelMember || searchingGroup } hasPermisson={hasPermisson}/>
            </ScrollShadow>

        </>
      
    )
} 

export const MessageBubbleIcon = () =>(
    
    <MessageCircleIcon size={16}/>
);