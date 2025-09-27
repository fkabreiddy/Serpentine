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
import UpdateGroupForm from "@/components/groups/forms/update-group-form";
import { useRightPanelViewData } from "@/contexts/right-panel-view-data";

interface RightSideBarProps {}

const RightSideBar: React.FC<RightSideBarProps> = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { layout, setLayout } = useLayoutStore();
  const isMobile = useIsMobile();
  const {setRightPanelViewData, resetRightPanelViewData, rightPanelData} = useRightPanelViewData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const close = () => {
    setLayout({ currentRightPanelView: RightPanelView.DefaultView });
    resetRightPanelViewData();
    
  };

  if (!isMounted) {
    return <></>;
  }

  return (
    <ScrollShadow
      hideScrollBar
      offset={0}
      style={{width: isMobile ? `calc(100% - 60px)` : "300px", minWidth: isMobile ? `calc(100% - 60px)` : "300px", maxWidth: isMobile ? `calc(100% - 60px)` : "300px",}}
      className={`h-screen ${isMobile ? "  absolute right-0" : ""} z-[31]  bg-white dark:bg-black  animate-all flex flex-col items-center max-md:border-0 border-l  border-default-100 p-3 overflow-auto gap-2  scroll-smooth scrollbar-hide `}
    >

    
      <div className="mt-4" />
      {layout.currentRightPanelView ===
        RightPanelView.CreateChannelFormView && (
        <CreateChannelForm onDone={() => {close();}} />
      )}
      {layout.currentRightPanelView === RightPanelView.CreateGroupFormView && (
        <CreateGroupForm onDone={() => {close();}} />
      )}
      {layout.currentRightPanelView === RightPanelView.ChannelInfo && (
        <ChannelInfoView onDone={()=>{close(); }} />
      )}

      {layout.currentRightPanelView === RightPanelView.UpdateChannelFormView && (
        <EditChannelForm onDone={()=> {close();}} />
      )}

      {layout.currentRightPanelView === RightPanelView.UpdateGroupFormView && (

        <UpdateGroupForm onDone={()=>{close(); }}/>
      )}
     
    </ScrollShadow>
  );
};

export default RightSideBar;
