import React, { useState, useEffect } from "react";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { X } from "lucide-react";
import {  useLayoutStore } from "@/contexts/layout-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { RightPanelView } from "@/models/right-panel-view";
import CreateChannelForm from "@/components/channels/forms/create-channel-form";
import IconButton from "@/components/common/icon-button";
import DefaultView from "./default-view";



interface RightSideBarProps{

}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}


const RightSideBar: React.FC<RightSideBarProps> = () =>{

  const [isMounted, setIsMounted] = useState<boolean>(false);
   const {layout, setLayout, setNewChannel} = useLayoutStore();
   const isMobile = useIsMobile();

  




  useEffect(() => {
    setIsMounted(true);
  }, []);

 

  if (!isMounted) {
      return <></>;
  }

  return(

    <ScrollShadow hideScrollBar offset={0}  className={`h-scren ${isMobile ? "w-[100%]": "!min-w-[300px] !max-w-[300px]"}  bg-white dark:bg-black/40 backdrop-blur-lg   animate-all flex flex-col items-center border-l  border-default-100 p-3 overflow-auto gap-2  scroll-smooth scrollbar-hide `}>
        {layout.currentRightPanelView !== RightPanelView.DefaultView && 
          <div className="absolute top-2 right-2">
            <IconButton tootltipText="Close" onClick={()=>setLayout({currentRightPanelView: RightPanelView.DefaultView})}>
              <X className="size-[18px]"/>
            </IconButton>
          </div>
        }
        <div className="mt-4"/>
        {layout.currentRightPanelView === RightPanelView.CreateChannelFormView && <CreateChannelForm  onCreate={setNewChannel}/>}
        {layout.currentRightPanelView === RightPanelView.DefaultView && 
          <div className=" h-full w-full flex items-center justify-center">
              
             <DefaultView/>

          </div> 
        }

        
    </ScrollShadow>
  )
}

export default RightSideBar;