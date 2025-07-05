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
import { CheckIcon, InfoIcon, Layout, Pause, PlayIcon } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";


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
            ? "!max-w-[250px] !min-w-[250px]"
            : "!max-w-[50px] !min-w-[50px]"
        } h-full  py-4 max-md:z-[9999] max-md:h-full bg-white dark:bg-black/40 backdrop-blur-lg animate-all flex flex-col border-r max-md:absolute border-default-100 px-2 overflow-auto gap-4 scroll-smooth scrollbar-hide`}
        style={{ paddingBottom: statusBarHeight }}
      >
        {layout.sideBarExpanded && (
          <SearchBar
            placeholder={selectedChannel ? "Filter groups" : "Filter your channels"}
            width="100%"
            onSearch={setFilter}
          />
        )}

        <div className="flex flex-col w-full items-center gap-3">
          <ChannelsContainer
            isLoading={loadingChannels}
            channels={channels}
            onChannelSelected={setSelectedChannel}
            filter={filter}
          />
        </div>
      </ScrollShadow>

      {layout.sideBarExpanded && (
        <div
          id="status-bar"
          ref={statusBarRef}
          className="fixed left-0 max-md:z-[9999]  bottom-0 z-10 backdrop-blur-md px-2 py-3 justify-center w-[inherit] max-w-[250px] min-w-[50px] items-center flex gap-3 border-t border-r border-default-100 bg-white/80 dark:bg-black/60"
          style={{
            width: layout.sideBarExpanded ? 250 : 50,
            transition: "width 0.2s",
          }}
        >
          {loadingChannels ? (
            <Spinner size="sm" />
          ) : (
            <CheckIcon className="size-5 text-blue-600" />
          )}

        
            <>
              <div className="w-full flex flex-col">
                <label className="text-xs">
                  {loadingChannels
                    ? "Connecting to channels..."
                    : `Connected to ${channels.length} channels`}
                </label>
                <p className="text-xs ">No group is active</p>
              </div>
              <div></div>
            </>
          
        </div>
      )}
    </div>
    </>
  )
}


export default LeftSideBar;