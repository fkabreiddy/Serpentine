import { Minimize, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGetChannelsByUserId } from "@/hooks/channel-hooks";
import { ChannelResponse } from "@/models/responses/channel-response";
import { Expand } from "lucide-react";
import {useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";
import IconButton from "@/components/common/icon-button";
import SideBarButton from "@/components/panels/left-pannel/sidebar-button";
import ChannelSkeleton from "../skeletons/channel-skeleton";
import ChannelCard from "./channel-card";

interface ChannelContainerProps{
}

export default function ChannelsContainer(){

    const [showChannels, setShowChannels] = React.useState<boolean>(true);
    const {user} = useAuthStore();
    const {layout, setLayout, newChannel, setNewChannel } = useLayoutStore();
    const {getChannelsByUserId, setChannels, channels, hasMore, loadingChannels, isBusy } = useGetChannelsByUserId();

    
    useEffect(()=>{

        if(newChannel)
        {
            handleChannelCreated(newChannel)
            setNewChannel(null);

        }
    },[newChannel])
    
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
        <div className={`${showChannels ? "h-full" : "h-fit"}  ${layout.sideBarExpanded ? "w-full" : "w-fit"} flex flex-col gap-2 `} >
           
           {layout.sideBarExpanded && 
                <div className="w-full flex mb-2 px-3 items-center justify-between">
                    <label className="font-normal  text-xs text-nowrap">My Channels /  <span className="text-blue-500">{channels.length}</span></label>
                    <IconButton onClick={()=>{setShowChannels(!showChannels)}} tooltipText={showChannels ? "Minimize" : "Expand"}>
                        {showChannels ? 
                        <Minimize className="size-[12px] cursor-pointer"/> :
                        <Expand className="size-[12px] cursor-pointer"/> 
                    }
                    </IconButton>
                
                </div>
            } 
            <SideBarButton  text="Create a channel" onClick={()=> setLayout({currentRightPanelView: RightPanelView.CreateChannelFormView})} >
                  <Plus className="size-[18px]  cursor-pointer group-hover:text-blue-500 transition-all"/>
            </SideBarButton>              
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