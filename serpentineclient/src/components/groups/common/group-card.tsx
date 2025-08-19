import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupResponse } from "@/models/responses/group-response.ts";
import { motion } from "motion/react";
import { LockIcon } from "lucide-react";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import CustomDialog from "@/components/common/custom-dialog";
import {Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

interface GroupCardProps {
  group: GroupResponse;
  index?: number;
  channelMember: ChannelMemberResponse | null
}

const GroupCard: React.FC<GroupCardProps> = ({ group, index, channelMember }) => {
  const navigate = useNavigate();
  const [showLockedGroupDialog, setShowLockedGroupDialog] = useState(false);

  function navigateToGroup(){


    if(!channelMember) return;
    if(!group.public && (!channelMember.isAdmin && !channelMember.isOwner))
    {
      setShowLockedGroupDialog(true);
      return;
    } 
    navigate(`/group/${group.id}`);
  }
  return (
    <>
    <CustomDialog onAccept={()=>{setShowLockedGroupDialog(false);}} open={showLockedGroupDialog} showDismiss={false} acceptText="Understood" onOpenChanged={setShowLockedGroupDialog} title="Group is private">
      <p className="text-[13px]">
        This group is private you cannot acceed if you are not an admin or the owner of the group
      </p>
    </CustomDialog>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index ? index * 0.1 : 0 }}
      className="relative mb-5 last:mb-0"
      onClick={() => {
        navigateToGroup();
      }}
    >
      <div className="absolute left-0 top-3 w-4 h-[10px] border-b-2 border-l-2  dark:border-neutral-800 border-neutral-200 rounded-bl-2xl" />

      <div className="flex transition-all   flex-col items-end w-full">
        <div
          style={{ width: "calc(100% - 24px)" }}
          className=" flex items-center justify-between gap-1"
        >
          <div className="w-full gap-2 flex items-center   ">
             

            <div className="flex text-ellipsis overflow-hidden   w-full flex-col gap-0">
              <div className="flex items-center gap-3 ">
                <span className="text-xs font-semibold opacity-80 hover:text-blue-600  dark:hover:text-blue-500  cursor-pointer hover:underline">
                  {group.name}
                </span>
              </div>
              {group.lastMessage ?
              
                <>
                    {!group.public && (!channelMember?.isAdmin || !channelMember.isOwner) ? 
                       <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                        No messages available.
                      </span> :
                      <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                        <strong>
                          {
                            group.lastMessage.senderUsername}{" "}
                        </strong>
                        {group.lastMessage && group.lastMessage.content}
                      </span>
                    
                    }
                
                
                </> 
                
               : 

                
                <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  No messages available.
                </span>
              }
            </div>
          </div>
  
          <div className={"flex items-center gap-2"}>
            {(!group.public && (!channelMember?.isOwner && !channelMember?.isAdmin) || (group.requiresOverage && !channelMember?.isOverage) )
                &&
                <Popover showArrow={true} placement={"bottom"}>
                  <PopoverTrigger>
                    <LockIcon className={"text-red-500 cursor-pointer"} size={14}/>
                  </PopoverTrigger>
                  <PopoverContent className={"max-w-[250px]"}>
                    <ul>
                      {!group.public &&
                          <li><p className={"text-[12px]"}>- This group is only for admins and the owner of the channel</p></li>
                      }
                      {group.requiresOverage &&
                          <li><p className={"text-[12px]"}>- This group is only for +18 members</p></li>
                      }
                    </ul>
                  </PopoverContent>
                </Popover>}
            {group.unreadMessages > 0 && (
                <div className="w-1 h-1 bg-blue-800 rounded-full mr-4 " />
            )}
          </div>
         
        </div>
      </div>
    </motion.div>
    </>
    
  );
};





export default GroupCard;
