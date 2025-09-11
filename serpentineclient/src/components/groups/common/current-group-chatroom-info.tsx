import { useActiveChannelsHubActions } from "@/client-hubs/active-channels-hub";
import ChannelCover from "@/components/channels/common/channel-cover";
import IconButton from "@/components/common/icon-button";
import UserAvatar from "@/components/users/common/user-avatar";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { GroupResponse } from "@/models/responses/group-response";
import { RightPanelView } from "@/models/right-panel-view";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Spinner, Tooltip } from "@heroui/react";
import { channel } from "diagnostics_channel";
import { ArrowLeft, ArrowLeftIcon, CopyIcon, Edit3Icon, InfoIcon, LockIcon, MessageCircleWarningIcon, MoreVertical, PlusCircle, TrashIcon, X } from "lucide-react";
import { motion } from "motion/react";
import { join } from "path";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CurrentGroupChatroomInfoProps {

}

export default function CurrentGroupChatroomInfo({
  group,
  channelMembership
}: {  
  group: GroupResponse;
  channelMembership: ChannelMemberResponse
}) {

  const [activeUsers, setActiveUsers] = useState();
  const {activeUsersCount, getChannelActiveMembersCount} = useActiveChannelsHubActions();

  async function fetchGetChannelActiveMembersCount(channelId: string)
  {
    await getChannelActiveMembersCount(channelId)

  }
  useEffect(()=>{
    if(group)
    {
      fetchGetChannelActiveMembersCount(group.channelId);
    }
  }, [group])
  
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="  w-full p-4 px-3  bg-neutral-100 dark:bg-neutral-950 z-[33] justify-between   absolute left-0 top-0 flex flex-col "
      >
        <div className="flex w-full justify-between items-center gap-3">
          <div className="w-[full] flex gap-2 items-center  ">
              <IconButton tooltipText="Close" onClick={() => navigate("/home")}>
                <ArrowLeftIcon className="size-[16px]" />
              </IconButton>
                <p className="text-[13px] max-md:max-w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                  #{group.channelName}
                </p>
                <strong className="text-[13px] max-w-[70%] whitespace-nowrap overflow-hidden text-ellipsis">
                  / {group.name}
                </strong>
                {!group.public && (
                  <Tooltip
                    placement="bottom"
                    content={"This group is just for admins and the owner"}
                    showArrow={true}
                    size="sm"
                  >
                    <LockIcon className="cursor-pointer" size={16} />
                  </Tooltip>
                )}
              
          </div>

           <OptionsDropdown group={group} membership={channelMembership}/>
        </div>
        <div className="flex items-center gap-2  ml-[35px]">
          <div className="size-2 rounded-full bg-green-600"/>
         <p className="text-green-700 text-xs "> {activeUsersCount} Active members</p>

        </div>
      
      </motion.div>
    </>
  );
}


const OptionsDropdown: React.FC<{ group: GroupResponse, membership: ChannelMemberResponse }> = ({
  group,
  membership
}) => {

  const {layout, setLayout} = useLayoutStore();
  const {groupToUpdate, setGroupToUpdate} = useGlobalDataStore();

 

  useEffect(()=>{

    if(groupToUpdate)
    {
      setLayout({currentRightPanelView: RightPanelView.UpdateGroupFormView})
    }

  },[groupToUpdate])


  
  return (
    <>

      
      
      <Dropdown  placement="bottom-end" showArrow={true} className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  ">
      <DropdownTrigger>
        <button>
          <IconButton tooltipText="Manage">
            <MoreVertical size={16} />
          </IconButton>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        disabledKeys={["divider", "divider2", "channelInf"]}
        aria-label="Group Actions"
        variant="flat"
      >
        <DropdownSection showDivider={true} title={"About this group"}>
          <DropdownItem
          textValue="info"
              key="channelInf"
              startContent={<InfoIcon size={16} />}
              className="h-14 gap-2"
          >
            <p className="font-semibold text-xs">#{group.name}</p>
            <p className="font-normal text-xs opacity-60">{group.id}</p>
          </DropdownItem>
        </DropdownSection>
       
       <DropdownSection showDivider={true} title={"Actions"}>
         <>
           {(membership.isAdmin ||
               membership.isOwner) && (
               <>
                 <DropdownItem textValue="edit" onClick={()=>{setGroupToUpdate(group);}} key="edit" endContent={<Edit3Icon size={16} />}>
                   <p className="font-normal text-[13px]">Edit this Group</p>
                 </DropdownItem>
               </>
           )}
         </>

        
         <DropdownItem key="about_group" textValue="About"  endContent={<CopyIcon size={16} />}>
           <p className="font-normal text-[13px]">Copy Id</p>
         </DropdownItem>
       </DropdownSection>
        
        <DropdownSection title={"Danger zone"}>
       
          {membership  &&
          
            <>

              {membership.isOwner &&
                <DropdownItem
                  color="danger"
                  key="delete"
                  endContent={
                    false ? (
                      <Spinner variant="spinner" size="sm" />
                    ) : (
                      <TrashIcon size={16} />
                    )
                  }
                >
                  <p className="font-normal text-[13px]">Delete this channel</p>
                </DropdownItem> 
                

                
              } 


            </> 
           
          

           
           
           
           
          }
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
    </>
  
  );
};