import IconButton from "@/components/common/icon-button";
import { GroupResponse } from "@/models/responses/group-response";
import { Tooltip } from "@heroui/react";
import { ArrowLeftIcon, LockIcon, MoreVertical, X } from "lucide-react";
import { motion } from "motion/react";
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface CurrentGroupChatroomInfoProps {
  group: GroupResponse;
}

export default function CurrentGroupChatroomInfo({
  group,
}: CurrentGroupChatroomInfoProps) {
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="  w-full  pb-4 py-2 px-3  absolute left-0 top-0 flex flex-col items-center"
      >
        <div className="w-[70%]  flex justify-between items-center  p-3 max-md:w-[90%]   ">
          <div className="flex gap-3 items-center flex-nowrap w-full">
            <IconButton tooltipText="Close" onClick={() => navigate("/home")}>
              <X className="size-[18px]" />
            </IconButton>
            <div className="dark:bg-neutral-900 bg-neutral-200 py-2 px-2 rounded-md flex items-center gap-2 max-w-[60%]">
              <p className="text-xs max-md:max-w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                #{group.channelName}
              </p>
              <p className="text-xs max-w-[70%] whitespace-nowrap overflow-hidden text-ellipsis">
                / {group.name}
              </p>
              {!group.public && (
                <Tooltip
                  placement="bottom"
                  content={"This channel is locked"}
                  showArrow={true}
                  size="sm"
                >
                  <LockIcon className="cursor-pointer" size={16} />
                </Tooltip>
              )}
            </div>
          </div>

          <IconButton tooltipText="About">
            <MoreVertical className="size-[18px]" />
          </IconButton>
        </div>
      </motion.div>
    </>
  );
}

interface ContextButtonProps {
  children: ReactNode;
}

const ContextButton = ({ children }: ContextButtonProps) => (
  <button className="rounded-full dark:bg-neutral-950/20 bg-neutral-50/20  p-2 flex items-center justify-center backdrop-blur-xl  backdrop-opacity-70 shadow-inner dark:shadow-neutral-900/70 shadow-neutral-100/70 dark:border-neutral-900/70 border-neutral-100/70 ">
    {children}
  </button>
);
