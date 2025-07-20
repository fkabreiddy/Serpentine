import { ArchiveIcon, Plus } from "lucide-react";
import React from "react";
import { ChannelResponse } from "@/models/responses/channel-response";
import {useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";
import IconButton from "@/components/common/icon-button";
import ChannelSkeleton from "../skeletons/channel-skeleton";
import ChannelCard from "./channel-card";
import { ScrollShadow } from "@heroui/scroll-shadow";

interface ChannelContainerProps{
    filter?: string;
    channels: ChannelResponse[];
    isLoading: boolean;
    onChannelSelected?: (channel: ChannelResponse) => void;
}

export default function ChannelsContainer({filter = "", channels, isLoading = true, onChannelSelected}:ChannelContainerProps){

    const [showChannels, setShowChannels] = React.useState<boolean>(true);
    const {layout, setLayout } = useLayoutStore();

   
    
   
   

   

    return(
        <ScrollShadow orientation="horizontal"  className={`${showChannels ? "h-full" : "h-fit"}  ${layout.sideBarExpanded ? "w-full flex-row items-start" : "w-fit flex-col items-center"} flex  gap-4  overflow-auto scrollbar-hide py-2  `} >
           
           
            <button className={` shrink-0 ${layout.sideBarExpanded ? "size-[40px]" : "size-[28px]"} shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-900 items-center justify-center flex hover:text-white hover:bg-blue-500 dark:hover:bg-blue-700 transition-all`}  onClick={()=> setLayout({currentRightPanelView: RightPanelView.CreateChannelFormView})} >
                <Plus className="size-[18px]  cursor-pointer  transition-all"/>
            </button>  
           
            {!layout.sideBarExpanded &&
                <>
                <IconButton tooltipText="Archived channels">
                            <ArchiveIcon className="size-[16px]" />
                    </IconButton>
                    <hr className="w-full max-md:w-[80%] border-neutral-100 border rounded-full my-3 dark:border-neutral-900" />

                </>
               
            }            
            {(channels) &&
              
                channels.filter(ch => ch.name.toLowerCase().includes(filter.toLowerCase()) ).map((ch, i) => (
                    
                    <ChannelCard index={i} onClick={() => onChannelSelected?.(ch)} key={`${i}-${ch.name}`}  channel={ch} />
                ))
               
            }
            
            {isLoading && <>
                 {Array.from({ length: 5 }).map((_, idx) => (
                              <ChannelSkeleton key={idx}/>
                            ))}
            
            </>}
            

            
                
            
          
          
        </ScrollShadow>
    );
}