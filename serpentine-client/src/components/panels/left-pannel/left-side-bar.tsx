import React, { useState, useEffect } from "react";
import {ScrollShadow} from "@heroui/scroll-shadow";
import { useNavigate } from "react-router-dom";
import { useLayoutStore } from "@/contexts/layout-context";
import { useCloseSession } from "@/hooks/user-hooks";
import ChannelsContainer from "@/components/channels/common/channels-container";
import SearchBar from "@/components/search-channel-bar";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGetChannelsByUserId } from "@/hooks/channel-hooks";
import { Spinner } from "@heroui/spinner";
import { CheckIcon, InfoIcon, Layout, Pause, PlayIcon, PlugIcon, Unplug } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { HubConnectionState } from "@microsoft/signalr";
import IconButton from "@/components/common/icon-button";
import { disconnect } from "process";
import AddIcon from "@fluentui/svg-icons/icons/add_20_filled.svg";
import { useActiveUser } from "@/helpers/active-user-hub";
import StatusBar from "./status-bar";
import GroupsContainer from "@/components/groups/common/groups-container";
interface LeftSideBarProps{

}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}


const LeftSideBar: React.FC<LeftSideBarProps> = () =>{

  
  const [filter, setFilter] = React.useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState<ChannelResponse | null>(null);
  const {getChannelsByUserId, setChannels, channels, loadingChannels, isBusy } = useGetChannelsByUserId();
  const {user, username} = useAuthStore();
  const {layout, newChannel, setNewChannel } = useLayoutStore();
  const statusBarRef = React.useRef<HTMLDivElement | null>(null);
  const [statusBarHeight, setStatusBarHeight] = useState<number>(0);
  
  

  useEffect(() => {
    if (statusBarRef.current) {
      setStatusBarHeight(statusBarRef.current.offsetHeight);
    }
  }, [isMounted]);
  
  useEffect(()=>{

    if(newChannel)
    {
        handleChannelCreated(newChannel)
        setNewChannel(null);

    }
  },[newChannel])

  useEffect(()=>{

    setSelectedChannel(channels[0]);
  },[channels])

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
    <>
     <div className={`relative h-screen`}>
      <ScrollShadow
        hideScrollBar
        offset={0}
        id="side-bar"
        className={`${
          layout.sideBarExpanded
            ? "!max-w-[300px] !min-w-[300px]"
            : "!max-w-[50px] !min-w-[50px]"
        } h-full  py-4 max-md:z-[9999] max-md:h-full bg-white dark:bg-black/40 backdrop-blur-lg animate-all flex flex-col border-r max-md:absolute border-default-100 px-2 overflow-auto gap-4 scroll-smooth scrollbar-hide`}
        style={{ paddingBottom: statusBarHeight }}
      >
        

        

        <div className="flex flex-col w-full items-center gap-3">
          <ChannelsContainer
            isLoading={loadingChannels}
            channels={channels}
            onChannelSelected={setSelectedChannel}
            filter={filter}
          />
        </div>



        {layout.sideBarExpanded && (
          <SearchBar
            placeholder={"Search on your things..."}
            width="100%"
            onSearch={setFilter}
          />
        )}
        {layout.sideBarExpanded && selectedChannel && <GroupsContainer channel={selectedChannel}/>}
      </ScrollShadow>
      
     <StatusBar channelsLength={channels.length} loadingChannels={loadingChannels} />
    </div>
    </>
  )
}


export default LeftSideBar;