import CurrentGroupChatroomInfo from "@/components/groups/common/current-group-chatroom-info";
import SendMessageBar from "@/components/groups/common/send-message-bar";
import MessagesContainer from "@/components/messages/common/messages-container";
import { useLayoutStore } from "@/contexts/layout-context";
import { useGetChannelMemberByUserAndChannelId } from "@/hooks/channel-member-hooks";
import { useGetGroupById } from "@/hooks/group-hooks";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircleIcon } from "lucide-react";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import CustomDialog from "@/components/common/custom-dialog";
import { useGetCountUnreadMessages } from "@/hooks/message-hooks";

export default function ChatroomPage(){

    const {layout} = useLayoutStore();
    const {groupId} = useParams();
    const {getGroupById, group, searchingGroup} = useGetGroupById();
    const [hasPermisson, setHasPermisson] = useState<boolean>(false);
    const {currentGroupIdAtChatroomPage, deletedGroupId, setDeletedGroupId, setCurrentGroupIdAtChatroomPage, setResetGroupUnreadMessages, deletedChannelId} = useGlobalDataStore();
    const [showLockedGroupDialog, setShowLockedGroupDialog] = useState(false);
    const [showChannelDeletedDialog, setShowChannelDeletedDialog] = useState(false);
    
    

    const navigate = useNavigate();
    
    const {getChannelMemberByUserAndChannelId, channelMember, loadingChannelMember} = useGetChannelMemberByUserAndChannelId();

  
 

    useEffect(()=>{


        if(deletedGroupId && group && deletedGroupId === group.id)
        {
            setDeletedGroupId(null);
            navigate("/home");
            
        }
    },[deletedGroupId, group])

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
            <ScrollShadow  className="  h-full z-[1] relative shadow-inner">
                
                <div className="doodle-pattern opacity-10 -z-[1]"/>

                {group && channelMember && hasPermisson &&
                   <CurrentGroupChatroomInfo channelMembership={channelMember}  group={group}/>
                }

                {(group && channelMember && hasPermisson) &&
                    <MessagesContainer  lastAccess={group.myAccess} channelMember={channelMember} groupId={group.id}/>
                }

                <SendMessageBar group={group} loading={loadingChannelMember || searchingGroup } hasPermisson={hasPermisson}/>
            </ScrollShadow>

        </>
      
    )
} 

export const MessageBubbleIcon = () =>(
    
    <MessageCircleIcon size={28}/>
);

