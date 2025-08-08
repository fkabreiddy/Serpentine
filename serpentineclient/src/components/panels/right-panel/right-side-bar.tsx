import React, { useEffect, useState } from "react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { X } from "lucide-react";
import { useLayoutStore } from "@/contexts/layout-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { RightPanelView } from "@/models/right-panel-view";
import CreateChannelForm from "@/components/channels/forms/create-channel-form";
import IconButton from "@/components/common/icon-button";
import CreateGroupForm from "@/components/groups/forms/create-group-form.tsx";
import ChannelInfoView from "@/components/channels/views/channel-info-view";
import { motion } from "framer-motion";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import EditChannelForm from "@/components/channels/forms/edit-channel-form";

interface RightSideBarProps {}

const RightSideBar: React.FC<RightSideBarProps> = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { layout, setLayout } = useLayoutStore();
  const {clearGlobalData} = useGlobalDataStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const close = () => {
    setLayout({ currentRightPanelView: RightPanelView.DefaultView });
    clearGlobalData();
  };

  if (!isMounted) {
    return <></>;
  }

  return (
    <ScrollShadow
      hideScrollBar
      offset={0}
      style={{width: isMobile ? `calc(100% - 108px)` : "300px"}}
      className={`h-screen ${isMobile ? " ml-[105px] absolute " : "!min-w-[300px] !max-w-[300px]"} z-[31]  bg-white dark:bg-black  animate-all flex flex-col items-center max-md:border-0 border-l  border-default-100 p-3 overflow-auto gap-2  scroll-smooth scrollbar-hide `}
    >

    
      {layout.currentRightPanelView !== RightPanelView.DefaultView && (
        <div className="absolute top-2 right-2">
          <IconButton tooltipText="Close" onClick={() => close()}>
            <X className="size-[18px]" />
          </IconButton>
        </div>
      )}
      <div className="mt-4" />
      {layout.currentRightPanelView ===
        RightPanelView.CreateChannelFormView && (
        <CreateChannelForm triggerClose={() => close()} />
      )}
      {layout.currentRightPanelView === RightPanelView.CreateGroupFormView && (
        <CreateGroupForm onCreate={() => close()} />
      )}
      {layout.currentRightPanelView === RightPanelView.ChannelInfo && (
        <ChannelInfoView />
      )}

      {layout.currentRightPanelView === RightPanelView.UpdateChannelFormView && (
        <EditChannelForm />
      )}
     
    </ScrollShadow>
  );
};

export default RightSideBar;
