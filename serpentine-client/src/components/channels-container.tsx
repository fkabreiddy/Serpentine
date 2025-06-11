import { ScrollShadow } from "@heroui/scroll-shadow";
import { Spinner } from "@heroui/spinner";
import { Minimize, PackageOpenIcon, X } from "lucide-react";
import React, { useEffect } from "react";
import ChannelCard from "./channels/channel-card";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGetChannelsByUserId } from "@/hooks/channel-hooks";
import { ChannelResponse } from "@/models/responses/channel-response";
import { CreateChannelDialog } from "./dialogs/create-channel-dialog";
import { Expand } from "lucide-react";
import IconButton from "./icon-button";
import ChannelSkeleton from "./skeletons/channel-skeleton";
import { useLayoutStore } from "@/contexts/layout-context";

interface ChannelContainerProps{
}

export default function ChannelsContainer(){

    const [showChannels, setShowChannels] = React.useState<boolean>(true);
    const {user} = useAuthStore();
    const {layout} = useLayoutStore();
    const {getChannelsByUserId, setChannels, channels, hasMore, loadingChannels, isBusy } = useGetChannelsByUserId();

    
    
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
   

    function handleChannelCreated(channel : ChannelResponse){

        setChannels(prev => [...prev, channel]);
    }

    return(
        <div className={`${showChannels ? "h-full" : "h-fit"} w-full flex flex-col gap-2 `} >
           
           {layout.sideBarExpanded && 
                <div className="w-full flex mb-2 px-3 items-center justify-between">
                    <label className="font-normal  text-xs text-nowrap">My Channels /  <span className="text-blue-500">{channels.length}</span></label>
                    <IconButton onClick={()=>{setShowChannels(!showChannels)}} tootltipText={showChannels ? "Minimize" : "Expand"}>
                        {showChannels ? 
                        <Minimize className="size-[12px] cursor-pointer"/> :
                        <Expand className="size-[12px] cursor-pointer"/> 
                    }
                    </IconButton>
                
                </div>
            } 
            <CreateChannelDialog onCreate={handleChannelCreated}/>
            
            {(channels && showChannels) &&
                    
                channels.map((ch, i) => (
                    
                    <ChannelCard key={`${i}-${ch.name}`} index={i} channel={ch} />
                ))
                

                
            }
            {loadingChannels &&
                <>
                    <ChannelSkeleton/>
                    <ChannelSkeleton/>
                    <ChannelSkeleton/>


                </>
            }

            
                
            
          
          
        </div>
    );
}