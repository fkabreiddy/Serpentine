import { ArchiveIcon, Minimize, Plus, TvIcon } from "lucide-react";
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
    filter?: string;
    channels: ChannelResponse[];
    onChannelSelected?: (channel: ChannelResponse) => void;
}

export default function ChannelsContainer({filter = "", channels, onChannelSelected}:ChannelContainerProps){

    const [showChannels, setShowChannels] = React.useState<boolean>(true);
    const {layout, setLayout, newChannel, setNewChannel } = useLayoutStore();

   
    
   
   

   

    return(
        <div className={`${showChannels ? "h-full" : "h-fit"}  ${layout.sideBarExpanded ? "w-full" : "w-fit"} flex flex-col gap-2 items-center  `} >
           
           {layout.sideBarExpanded &&
                <div className="w-full flex mb-2 px-3 items-center justify-between">
                    <label className="font-normal  text-xs text-nowrap">My Channels /  <span className="text-blue-500">{channels.length}</span></label>
                    <IconButton tooltipText="Archived channels">
                        <ArchiveIcon className="size-[14px]" />
                    </IconButton>
                
                </div>
               
            } 
            <SideBarButton  text="Create a channel" onClick={()=> setLayout({currentRightPanelView: RightPanelView.CreateChannelFormView})} >
                  <Plus className="size-[18px]  cursor-pointer  transition-all"/>
            </SideBarButton>  
            {!layout.sideBarExpanded &&
                <>
                <IconButton tooltipText="Archived channels">
                            <ArchiveIcon className="size-[18px]" />
                    </IconButton>
                    <hr className="w-full max-md:w-[80%] border-neutral-100 border rounded-full my-3 dark:border-neutral-900" />

                </>
               
            }            
            {(channels && showChannels) &&
                    
                channels.filter(ch => ch.name.toLowerCase().includes(filter.toLowerCase()) ).map((ch, i) => (
                    
                    <ChannelCard onClick={() => onChannelSelected?.(ch)} key={`${i}-${ch.name}`}  channel={ch} />
                ))
                

                
            }
            
            

            
                
            
          
          
        </div>
    );
}