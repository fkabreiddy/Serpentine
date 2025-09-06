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
import { useNavigate, useParams } from "react-router-dom";
import {useActiveChannelsHubStore} from "@/contexts/active-channels-hub-context.ts";
import { MessageCircleIcon } from "lucide-react";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import CustomDialog from "@/components/common/custom-dialog";
import { Button } from "@heroui/react";
import { useGetCountUnreadMessages } from "@/hooks/message-hooks";
import { MessageResponse } from "@/models/responses/message-response";

export default function ChatroomPage(){

    const {layout} = useLayoutStore();
    const {groupId} = useParams();
    const {unreadMessagesCount, getCountUnreadMessages, setUnreadMessagesCount} = useGetCountUnreadMessages();
    const {getGroupById, group, searchingGroup} = useGetGroupById();
    const [hasPermisson, setHasPermisson] = useState<boolean>(false);
    const {currentGroupIdAtChatroomPage, setCurrentGroupIdAtChatroomPage, setResetGroupUnreadMessages, deletedChannelId} = useGlobalDataStore();
    const [showLockedGroupDialog, setShowLockedGroupDialog] = useState(false);
    const [showChannelDeletedDialog, setShowChannelDeletedDialog] = useState(false);
    

    const navigate = useNavigate();
    
    const {getChannelMemberByUserAndChannelId, channelMember, loadingChannelMember} = useGetChannelMemberByUserAndChannelId();

    async function fecthGetUnreadMessagesCount(groupId: string){
        await getCountUnreadMessages({groupId: groupId});
    }
    useEffect(()=>{

        if(deletedChannelId && group?.channelId === deletedChannelId)
        {
            navigate("/home");
        }

    },[deletedChannelId])
  
    useEffect(()=>{

    
        if(groupId)
        {
            setCurrentGroupIdAtChatroomPage(groupId);
            setResetGroupUnreadMessages(groupId);
        }

        return()=>{

            setCurrentGroupIdAtChatroomPage(null);
        }

      
    },[groupId])
    
    useEffect(()=>{

        if(group && hasPermisson)
        {
            fecthGetUnreadMessagesCount(group.id);
        }
    },[group, hasPermisson])
    
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

        if(channelMember && group)
        {
            if(!channelMember) return;
            if(!group) return;
            if(!group.public && (!channelMember.isAdmin && !channelMember.isOwner))
            {
                setShowLockedGroupDialog(true);
                setHasPermisson(false);
                return;
            } 

            setHasPermisson(true);
            
        }
    },[channelMember, group])


    useEffect(()=>{

        if(group)
        {
            fetchPermisson(group.channelId);
        }
    },[group])
    
    
    return(
        <>

                <CustomDialog onDismiss={()=>{ navigate("/home");}} onAccept={()=>{ navigate("/home");}} open={showLockedGroupDialog} showDismiss={false} acceptText="Understood" onOpenChanged={(value)=> {setShowLockedGroupDialog(value); navigate("/home")}} title="Group is private">
                        This group is private you cannot acceed if you are not an admin or the owner of the group
                </CustomDialog>

                <CustomDialog onDismiss={()=>{ navigate("/home");}} onAccept={()=>{ navigate("/home");}} open={showChannelDeletedDialog} showDismiss={false} acceptText="Understood" onOpenChanged={(value)=> {setShowChannelDeletedDialog(value); navigate("/home")}} title="Channel deleted">
                        This channel has been deleted
                </CustomDialog>
            <ScrollShadow  className="  h-full z-[1] relative shadow-inner  shadow-white dark:shadow-black">
                
                <div className="doodle-pattern opacity-10 -z-[1]"/>

                {group && 
                   <CurrentGroupChatroomInfo  group={group}/>
                }

                {(group && channelMember) &&
                    <MessagesContainer  unreadMessagesChanged={setUnreadMessagesCount} lastAccess={group.myAccess} channelMember={channelMember} groupId={group.id}/>
                }

                <SendMessageBar  unreadMessagesCount={unreadMessagesCount} group={group} loading={loadingChannelMember || searchingGroup } hasPermisson={hasPermisson}/>
            </ScrollShadow>

        </>
      
    )
} 

export const MessageBubbleIcon = () =>(
    
    <MessageCircleIcon size={28}/>
);

