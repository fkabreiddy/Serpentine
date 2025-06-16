import React, { useState, useEffect } from "react";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { HomeIcon, InfoIcon, Plug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import { useLayoutStore } from "@/contexts/layout-context";
import { useCloseSession } from "@/hooks/user-hooks";
import ChannelsContainer from "@/components/channels/common/channels-container";
import SideBarButton from "./sidebar-button";


interface LeftSideBarProps{

}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}


const LeftSideBar: React.FC<LeftSideBarProps> = () =>{

  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState<boolean>(false);
   const {layout, setLayout} = useLayoutStore();
    const {closeSession} = useCloseSession();
   
 
 




  useEffect(() => {
    setIsMounted(true);
  }, []);

 

  if (!isMounted) {
      return <></>;
  }

  return(

    <ScrollShadow hideScrollBar offset={0} id="side-bar" className={` ${layout.sideBarExpanded ? "!max-w-[250px] !min-w-[250px]" : "!max-w-[80px] !min-w-[80px]"} h-scren   bg-white dark:bg-black/40 backdrop-blur-lg   animate-all flex flex-col border-r  border-default-100 p-2 overflow-auto gap-2  scroll-smooth scrollbar-hide `}>
       
          
          
        <div className="flex flex-col items-center gap-3  ">

          <SideBarButton onClick={()=> navigate("/home")} text="Serpentine">
                <HomeIcon className="size-[18px]  cursor-pointer group-hover:text-blue-500 transition-all"/>

          </SideBarButton>
          <SideBarButton text="My Messages" >
                <ChatBubbleLeftEllipsisIcon className="size-[18px]  cursor-pointer group-hover:text-blue-500 transition-all"/>

          </SideBarButton>

          

          <hr className="w-full self-center my-1 border-default-100 border-t"/>

        </div>
            

        <div className="flex flex-col w-full items-center gap-3  ">
          <ChannelsContainer/>
        </div>
        
        

        <div className="flex flex-col items-center gap-3  ">
          <hr className="w-full self-center my-1 border-default-100 border-t"/>
          <SideBarButton text="Settings" >
            <motion.div
                            key="setting-icon"
                            whileHover={{ rotate: 180 }}
                            animate={{ rotate: 0 }}
                            exit={{ rotate: -180}}
                            className="flex flex-col gap-1 relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 group-hover:text-blue-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                            </svg>
                </motion.div>
          </SideBarButton>
          <SideBarButton text="About Serpentine" >
                <InfoIcon className="size-[18px]  cursor-pointer group-hover:text-blue-500 transition-all"/>

          </SideBarButton>
          <SideBarButton text="logout" onClick={closeSession}>
            
            <Plug className="size-[18px] group-hover:text-blue-500 "/>
            
          </SideBarButton>
          

          

          
        </div>

        
    </ScrollShadow>
  )
}

export default LeftSideBar;