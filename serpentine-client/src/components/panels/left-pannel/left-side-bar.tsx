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
import SearchBar from "@/components/search-channel-bar";
import SearchPopover from "../app-bar/search-popover";
import { ChannelResponse } from "@/models/responses/channel-response";
import GroupsContainer from "@/components/groups/common/groups-container";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGetChannelsByUserId } from "@/hooks/channel-hooks";


interface LeftSideBarProps{

}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}


const LeftSideBar: React.FC<LeftSideBarProps> = () =>{

  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<string>("");
  
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const {closeSession} = useCloseSession();
  const [selectedChannel, setSelectedChannel] = useState<ChannelResponse | null>(null);
  const {getChannelsByUserId, setChannels, channels, hasMore, loadingChannels, isBusy } = useGetChannelsByUserId();
  const {user} = useAuthStore();
  const {layout, setLayout, newChannel, setNewChannel } = useLayoutStore();
  useEffect(()=>{

    if(newChannel)
    {
        handleChannelCreated(newChannel)
        setNewChannel(null);

    }
  },[newChannel])

  function handleChannelCreated(channel : ChannelResponse){

    setChannels(prev => [...prev, channel]);
  }
   
  const hasFetched = React.useRef(false);
 
    useEffect(() => {
        if (user && !loadingChannels && !isBusy && !hasFetched.current) {
        hasFetched.current = true;
        fetchChannels();
        }
    }, [user]);

    const fetchChannels = async () => {
  
        await getChannelsByUserId({take: 5, skip: channels.length });
        
    };
 




  useEffect(() => {
    setIsMounted(true);
  }, []);

 

  if (!isMounted) {
      return <></>;
  }

  return(

    <ScrollShadow  hideScrollBar offset={0} id="side-bar" className={` ${layout.sideBarExpanded ? "!max-w-[250px] !min-w-[250px]" : "!max-w-[50px] !min-w-[50px]"} h-scren py-3 max-md:z-[9999] max-md:h-full bg-white dark:bg-black/40 backdrop-blur-lg   animate-all flex flex-col border-r  max-md:absolute border-default-100 px-2 overflow-auto gap-4  scroll-smooth scrollbar-hide `}>
       
          
        {
          layout.sideBarExpanded &&
          <SearchBar placeholder={selectedChannel ? "Filter groups" : "Filter your channels"} width="100%" onSearch={setFilter}  /> 
          
        }
      

            

        <div className="flex flex-col w-full items-center gap-3  ">

          {!selectedChannel &&           
            <ChannelsContainer channels={channels}  onChannelSelected={setSelectedChannel} filter={filter}/>
          }
          {selectedChannel && <GroupsContainer channel={selectedChannel} onClose={() => setSelectedChannel(null)} />}
        </div>
        
        

       

          

        
    </ScrollShadow>
  )
}

export default LeftSideBar;