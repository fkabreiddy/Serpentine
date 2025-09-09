import ChannelCover from "@/components/channels/common/channel-cover";
import IconButton from "@/components/common/icon-button";
import UserAvatar from "@/components/users/common/user-avatar";
import { GroupResponse } from "@/models/responses/group-response";
import { Tooltip } from "@heroui/react";
import { ArrowLeftIcon, LockIcon, MoreVertical, X } from "lucide-react";
import { motion } from "motion/react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface CurrentGroupChatroomInfoProps {

}

export default function CurrentGroupChatroomInfo({
  group,
}: {  
  group: GroupResponse;
}) {
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="  w-full p-4 px-3  bg-neutral-100 dark:bg-neutral-950 z-[33] justify-between   absolute left-0 top-0 flex items-center"
      >
        <div className="w-[full]  gap-3 flex justify-between items-center  ">
            <IconButton tooltipText="Close" onClick={() => navigate("/home")}>
              <ArrowLeftIcon className="size-[16px]" />
            </IconButton>
              <p className="text-[13px] max-md:max-w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                #{group.channelName}
              </p>
              <p className="text-[13px] max-w-[70%] whitespace-nowrap overflow-hidden text-ellipsis">
                / {group.name}
              </p>
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

          <IconButton tooltipText="About">
            <MoreVertical className="size-[18px]" />
          </IconButton>
      </motion.div>
    </>
  );
}

