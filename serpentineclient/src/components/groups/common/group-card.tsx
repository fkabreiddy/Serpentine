import React from "react";
import { useNavigate } from "react-router-dom";
import { GroupResponse } from "@/models/responses/group-response.ts";
import { motion } from "motion/react";

interface GroupCardProps {
  group: GroupResponse;
  index?: number;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index ? index * 0.1 : 0 }}
      className="relative mb-5 last:mb-0"
      onClick={() => {
        navigate(`/group/${group.id}`);
      }}
    >
      <div className="absolute left-0 top-3 w-4 h-[10px] border-b-2 border-l-2  dark:border-neutral-800 border-neutral-200 rounded-bl-2xl" />

      <div className="flex transition-all   flex-col items-end w-full">
        <div
          style={{ width: "calc(100% - 24px)" }}
          className=" flex items-center justify-between gap-1"
        >
          <div className="w-full gap-3 flex items-center   ">
            <div className="flex text-ellipsis overflow-hidden   w-full flex-col gap-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold opacity-80 hover:text-blue-600  dark:hover:text-blue-500  cursor-pointer hover:underline">
                  {group.name}
                </span>
              </div>
              {group.lastMessage ? (
                <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  <strong>
                    {
                      group.lastMessage.senderUsername}{" "}
                  </strong>
                  {group.lastMessage && group.lastMessage.content}
                </span>
              ) : (
                <span className="font-normal text-[10px] opacity-60 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  No messages available.
                </span>
              )}
            </div>
          </div>

          {group.unreadMessages > 0 && (
            <div className="w-1 h-1 bg-blue-800 rounded-full mr-4 " />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const HashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.7"
    stroke="currentColor"
    className="size-3 "
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
    />
  </svg>
);

export default GroupCard;
