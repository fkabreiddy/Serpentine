import React, { useEffect, useState } from "react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { VolumeOffIcon } from "lucide-react";
import { useLayoutStore } from "@/contexts/layout-context";
import { Tooltip } from "@heroui/tooltip";

import { ChannelCover } from "./channel-cover";
import { motion } from "motion/react";

type ChannelCardProps = {
  channel: ChannelResponse;
  index?: number;
} & React.HTMLAttributes<HTMLDivElement>;

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  index,
  ...rest
}) => {
  const { layout } = useLayoutStore();

  return (
    <>
      {/* Main Node */}
      <motion.div
        key={channel.id.toString() + "-motion"}
        className="flex items-center gap-3 flex-col w-[50px] "
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.2, delay: index ? index * 0.1 : 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          {...rest}
          className={`flex items-center flex-col  w-full max-w-full  min-w-fit !shrink-0 group   gap-1   transition-all cursor-pointer  `}
        >
          <Tooltip
            content={channel.name}
            size={"sm"}
            showArrow={true}
            placement="right"
            isDisabled={layout.sideBarExpanded}
          >
            <div>
              <ChannelCover
                unreadMessages={channel.unreadMessages}
                absolute={false}
                channelName={channel.name}
                isSmall={!layout.sideBarExpanded}
                pictureUrl={channel.coverPicture}
              />
            </div>
          </Tooltip>
          {layout.sideBarExpanded && (
            <p className="text-[11px] max-w-[50px] group-hover:underline group-hover:text-blue-500 opacity-80 hover:opacity-100 transition-all font-normal whitespace-nowrap overflow-hidden text-ellipsis w-auto">
              {channel.name}
            </p>
          )}
        </div>
      </motion.div>
    </>
  );
};

const Mute = () => <VolumeOffIcon size={15} />;

const Line = () => (
  <div className="h-[40px] rounded-bl-lg border-l border-neutral-500 absolute left-[15px] top-[10px] z-[-1]"></div>
);
export default ChannelCard;
