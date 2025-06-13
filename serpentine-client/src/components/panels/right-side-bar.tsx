import React, { useState, useEffect } from "react";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { HomeIcon, InfoIcon, Plug, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import SideBarButton from '../sidebar-button';
import ChannelsContainer from "../channels-container";
import { motion } from "motion/react";
import { CurrentRightBarViews, useLayoutStore } from "@/contexts/layout-context";
import { useCloseSession } from "@/hooks/user-hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import CreateChannelForm from "../forms/create-channel-form";
import TrendingPosts from "../trending-posts";
import IconButton from "../icon-button";


interface RightSideBarProps{

}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}


const RightSideBar: React.FC<RightSideBarProps> = () =>{

  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState<boolean>(false);
   const {layout, currentRightBarView, setCurrentRightBarView, setNewChannel} = useLayoutStore();
    const {closeSession} = useCloseSession();
   const isMobile = useIsMobile();

  




  useEffect(() => {
    setIsMounted(true);
  }, []);

 

  if (!isMounted) {
      return <></>;
  }

  return(

    <ScrollShadow hideScrollBar offset={0}  className={`h-scren ${isMobile ? "w-[100%]": "w-[30%]"}  bg-white dark:bg-black/40 backdrop-blur-lg   animate-all flex flex-col items-center border-l  border-default-100 p-2 overflow-auto gap-2  scroll-smooth scrollbar-hide `}>
        
        {currentRightBarView !== CurrentRightBarViews.TrendingPosts && 
        <div className="absolute top-2 right-2">
          <IconButton tootltipText="Close" onClick={()=>setCurrentRightBarView(CurrentRightBarViews.TrendingPosts)}>
            <X className="size-[18px]"/>
          </IconButton>
        </div>
        }
        <div className="mt-4"/>
        {currentRightBarView === CurrentRightBarViews.CrateChannelForm && <CreateChannelForm  onCreate={setNewChannel}/>}
        {currentRightBarView === CurrentRightBarViews.TrendingPosts && <TrendingPosts/> }

        
    </ScrollShadow>
  )
}

export default RightSideBar;