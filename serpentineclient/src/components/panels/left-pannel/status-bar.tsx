import IconButton from "@/components/common/icon-button";
import SquarePattern from "@/components/common/square-pattern";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { useActiveChannels, useActiveChannelsActions } from "@/helpers/active-channels-hub";
import { useActiveUser } from "@/helpers/active-user-hub";
import { ChannelResponse } from "@/models/responses/channel-response";
import { Spinner } from "@heroui/spinner";
import { HubConnectionState } from "@microsoft/signalr";
import { PlugIcon, Square, Unplug } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StatusBarProps{

  channels: ChannelResponse[]
}

export default function StatusBar({channels}:StatusBarProps){

    const {activeChannels, activeChannelsHub, activeChannelsHubsState} = useActiveChannelsHubStore();
    const [listeningToChannel, setListeningToChannel] = useState(false);
    const alreadyRendered = useRef<boolean>(false);
    const {layout } = useLayoutStore();
    const {user, username} = useAuthStore();
    const {createdChannel} = useGlobalDataStore();
    const {listenToChannel, stopListeningToChannel} = useActiveChannelsActions();

    const activeChannelsConnection = useActiveChannels();
    
    useEffect(() => {

       
      if(!activeChannelsHub || activeChannelsHubsState !== HubConnectionState.Connected || !createdChannel) return;

      setListeningToChannel(true);

      listenToChannel(createdChannel);
      
      setListeningToChannel(false);


    }, [createdChannel]);

    useEffect(() => {}, [activeChannelsHub, activeChannelsHubsState]);



    
    

    const listenToChannels = async (channels: ChannelResponse[]) => {

      if(!activeChannelsHub || activeChannelsHubsState !== HubConnectionState.Connected) return;

      setListeningToChannel(true);
      for(const channel of channels)
      {
        await stopListeningToChannel(channel);
        await listenToChannel(channel);
      }
      setListeningToChannel(false);

    }

    
 
    useEffect(()=>{


      if(!activeChannelsHub || activeChannelsHubsState !== HubConnectionState.Connected) return;
     

      if(!alreadyRendered.current || activeChannelsHubsState === HubConnectionState.Connected)
      {
        listenToChannels(channels);
        alreadyRendered.current = true;
      }
    },[activeChannelsHubsState])

   
    return (<>

        {layout.sideBarExpanded  && (

        <div
          id="status-bar"
          className="fixed left-0 max-md:z-[9999]  bottom-0 z-10 backdrop-blur-xl px-2 py-3 justify-center min-w-[300px]  items-center flex gap-3 border-t border-r border-default-100 "
          style={{
            width: layout.sideBarExpanded ? 250 : 50,
            transition: "width 0.2s",
          }}
        >
          <div className="absolute w-full h-full backdrop-blur-2xl dark:bg-neutral-950/80   bg-neutral-100/80  z-[-1]"/>
            <SquarePattern/>
          
            {(() => {
                switch (activeChannelsHubsState) {
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
              <p className="text-xs">{activeChannelsHubsState.toString() } {activeChannelsHubsState === HubConnectionState.Connected && "as @" + username}</p>
             
              {
                activeChannels.length !== channels.length && activeChannelsHubsState === HubConnectionState.Connected ?
                <label className="text-xs">
                  We couldn't connect to some of your channels. Reload this page.
                </label>:
                <label className="text-xs">
                  {listeningToChannel
                    ? "Connecting to channels..."
                    : `Connected to ${activeChannels.length} channels`
                  }
                </label>
              }
            
            </div>

          </>



        </div>
      )}
    </>)
}