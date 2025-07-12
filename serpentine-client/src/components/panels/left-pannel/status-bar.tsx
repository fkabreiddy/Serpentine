import IconButton from "@/components/common/icon-button";
import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import { useAuthStore } from "@/contexts/authentication-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { useActiveUser } from "@/helpers/active-user-hub";
import { Spinner } from "@heroui/spinner";
import { HubConnectionState } from "@microsoft/signalr";
import { PlugIcon, Unplug } from "lucide-react";

interface StatusBarProps{

    loadingChannels: boolean;
    channelsLength: number;
}

export default function StatusBar({loadingChannels, channelsLength}:StatusBarProps){

    const {connection, connectionStatus} = useActiveUserHubStore();
    const {layout, newChannel, setNewChannel } = useLayoutStore();
    const {user, username} = useAuthStore();
    const {connectToApp, disconnect} = useActiveUser(
    
        {
    
          onUserConnected: () =>{},
          onUserDisconnected: ()=>{}
        }
      );
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
 
      
    
    return(<>
    
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
           <div className="doodle-pattern z-[-10]"/>

          
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
                    : `Connected to ${channelsLength} channels`}
                </label>
              </div>
              <div></div>
            </>

          <IconButton tooltipText={connectionStatus === HubConnectionState.Connected ? "Disconnect" : "Connect"} onClick={switchConnection}>
                    {connectionStatus === HubConnectionState.Disconnected ? <PlugIcon className="size-[18px]"/> : <Unplug className="size-[18px]"/>}
          </IconButton>
          
        </div>
      )}
    </>)
}