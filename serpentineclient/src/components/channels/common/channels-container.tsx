import { ArchiveIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";
import IconButton from "@/components/common/icon-button";
import ChannelSkeleton from "../skeletons/channel-skeleton";
import ChannelCard from "./channel-card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Tooltip } from "@heroui/react";

interface ChannelContainerProps {
  filter?: string;
  channels: ChannelResponse[];
  isLoading: boolean;
  onChannelSelected?: (channel: ChannelResponse) => void;
}

export default function ChannelsContainer({
  filter = "",
  channels,
  isLoading = true,
  onChannelSelected,
}: ChannelContainerProps) {
  const { layout, setLayout } = useLayoutStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  } 
  
  
    return (
      <ScrollShadow
        orientation="horizontal"
        className={` ${layout.sideBarExpanded ? "w-full flex-row items-start" : "w-fit flex-col items-center"} flex  gap-7  overflow-auto scrollbar-hide py-2  `}
      >
        <Tooltip content={"Create a channel"} showArrow={true} size={"sm"} placement={"right"}>
          <button
              className={` cursor-pointer shrink-0 ${layout.sideBarExpanded ? "size-[60px]" : "size-[28px]"} shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-900 items-center justify-center flex hover:text-white hover:bg-blue-500 dark:hover:bg-blue-700 transition-all`}
              onClick={() =>
                  setLayout({
                    currentRightPanelView: RightPanelView.CreateChannelFormView,
                  })
              }
          >
            <Plus className="size-[18px]  cursor-pointer  transition-all" />
          </button>
        </Tooltip>
       

       
        {channels &&
          channels
            .filter((ch) =>
              ch.name.toLowerCase().includes(filter.toLowerCase())
            )
            .map((ch, i) => (
              <ChannelCard
                index={i}
                onClick={() => onChannelSelected?.(ch)}
                key={ch.id}
                channel={ch}
              />
            ))}

        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, idx) => (
              <ChannelSkeleton key={idx} />
            ))}
          </>
        )}
      </ScrollShadow>
    );
  
}
