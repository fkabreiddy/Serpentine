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
interface LeftSideBarProps{

}

interface JoinChannelDrawerProps{

    open : boolean 
    openChanged : (change : boolean) => void
}


const LeftSideBar: React.FC<LeftSideBarProps> = () =>{

  const navigate = useNavigate();
  const {connection, connectionStatus} = useActiveUserHubStore();
  const [filter, setFilter] = React.useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const {closeSession} = useCloseSession();
  const [selectedChannel, setSelectedChannel] = useState<ChannelResponse | null>(null);
  const {getChannelsByUserId, setChannels, channels, hasMore, loadingChannels, isBusy } = useGetChannelsByUserId();
  const {user, username} = useAuthStore();
  const {layout, setLayout, newChannel, setNewChannel } = useLayoutStore();
  const statusBarRef = React.useRef<HTMLDivElement | null>(null);
  const [statusBarHeight, setStatusBarHeight] = useState<number>(0);
  const {connectToApp, disconnect} = useActiveUser(

    {

      onUserConnected: () =>{},
      onUserDisconnected: ()=>{}
    }
  );

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

  const switchConnection = async () =>{

    if(connection && connectionStatus === HubConnectionState.Connected)
    {
       await disconnect();
    }
    else
    {
      await connectToApp();
    }
  }
 

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
      
      {layout.sideBarExpanded  && (

        <div
          id="status-bar"
          ref={statusBarRef}
          className="fixed left-0 max-md:z-[9999]  bottom-0 z-10 backdrop-blur-md px-2 py-3 justify-center min-w-[300px]  items-center flex gap-3 border-t border-r border-default-100 bg-white/80 dark:bg-black/60"
          style={{
            width: layout.sideBarExpanded ? 250 : 50,
            transition: "width 0.2s",
          }}
        >
          <div className="doodle-pattern -z-[10]"/>

          
            {(() => {
                switch (connectionStatus) {
                    case HubConnectionState.Connected:
                      return <div className="bg-green-600 animate-pulse size-[6px] shrink-0 rounded-full text-xs font-semibold"/>
                    case HubConnectionState.Disconnected:
                      return <div className="bg-red-600 size-[6px] shrink-0 rounded-full font-semibold"/>;
                    case HubConnectionState.Reconnecting:
                      return <Spinner size="sm" variant="spinner" />;
                    default:
                      return <div className="text-gray-500 text-xs">Unknown</div>;
                }
            })()}

            

        
            <>
              <div className="w-full flex flex-col">
                <p className="text-xs">{connectionStatus.toString() } {connectionStatus === HubConnectionState.Connected && "as @" + username}</p>
                <label className="text-xs">
                  {loadingChannels
                    ? "Connecting to channels..."
                    : `Connected to ${channels.length} channels`}
                </label>
              </div>
              <div></div>
            </>

          <IconButton tooltipText={connectionStatus === HubConnectionState.Connected ? "Disconnect" : "Connect"} onClick={switchConnection}>
                    {connectionStatus === HubConnectionState.Disconnected ? <PlugIcon className="size-[18px]"/> : <Unplug className="size-[18px]"/>}
          </IconButton>
          
        </div>
      )}
    </div>
    </>
  )
}


export default LeftSideBar;