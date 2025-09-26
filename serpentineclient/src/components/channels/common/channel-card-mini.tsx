import React, { HtmlHTMLAttributes, useEffect, useState } from "react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { VolumeOffIcon } from "lucide-react";
import { useLayoutStore } from "@/contexts/layout-context";
import { Tooltip } from "@heroui/tooltip";

import ChannelCover  from "./channel-cover";
import { motion, MotionConfigProps, MotionNodeEventOptions, MotionNodeOptions } from "motion/react";
import { MotionProps } from "framer-motion";

export default function ChannelCardMini({
  channel,
  index,
  onClick
}: {
  channel: ChannelResponse;
  index?: number;
  onClick: ()=> void;
}) {


  //constants
  const { layout } = useLayoutStore();


  //functions
  function centerElement() {
    var element = document.getElementById(channel.id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      inline: "center", // centra en scroll horizontal
      block: "nearest", // mantiene la posición vertical
    });
  }


  return (
    
      
      <motion.div
        id={channel.id.toString()}
        key={channel.id.toString() + "-motion"}
        className=" w-[40px] flex items-center flex-col   min-w-fit !shrink-0 group   gap-1   transition-all cursor-pointer  "
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.2, delay: index ? index * 0.1 : 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        
          <Tooltip
            content={channel.name}
            size={"sm"}
            showArrow={true}
            placement="right"
            isDisabled={layout.sideBarExpanded}
          >
            <div onClick={centerElement}>
              <ChannelCover
                unreadMessages={channel.unreadMessages}
                absolute={false}
                channelName={channel.name}
                pictureUrl={channel.coverPicture}
              />
            </div>
          </Tooltip>
          {layout.sideBarExpanded && (
            <p className="text-[11px] max-w-[50px] group-hover:underline group-hover:text-blue-500 opacity-80 hover:opacity-100 transition-all font-normal whitespace-nowrap overflow-hidden text-ellipsis w-auto">
              {channel.name}
            </p>
          )}
       
      </motion.div>
    
  );
}
