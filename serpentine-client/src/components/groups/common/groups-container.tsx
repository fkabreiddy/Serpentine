import IconButton from "@/components/common/icon-button";
import { useLayoutStore } from "@/contexts/layout-context";
import { ChannelResponse } from "@/models/responses/channel-response";
import { PlusIcon, Settings } from "lucide-react";
import GroupCard from "./group-card";
import { ChannelBanner } from "@/components/channels/common/channel-banner";
import { ChannelCover } from "@/components/channels/common/channel-cover";


interface GroupsContainerProps {

    channel: ChannelResponse | null;
    
}

export default function GroupsContainer({channel}:GroupsContainerProps) {

    const {layout} = useLayoutStore()
    return (
        <div className={`${layout.sideBarExpanded ? "w-full" : "w-fit"} flex flex-col  items-center   `} >
            {channel && 
                <div className="flex flex-col w-full gap-2 relative mt-2 mb-4">
                    <ChannelBanner pictureUrl={channel?.bannerPicture}  />
                    <ChannelCover absolute={true} isSmall={false} pictureUrl={channel.coverPicture} channelName={channel.name}/>                    
                </div>
            }
            
            <div className="flex items-center gap-3 w-full justify-between">
               
                <div className="flex items-center gap-3">
                    <IconButton placement="right"  tooltipText="Add a group" >
                        <PlusIcon className="size-[18px]"  />
                    </IconButton>
                    <IconButton placement="right"   tooltipText="Manage" >
                        <Settings className="size-[18px]"  />
                    </IconButton>
                </div>
                       
                        <h2  className="text-[13px] font-normal justify-self-end">{channel ? `#${channel.name}` : "Channel"}</h2>

                  
            </div>
                 

            <div className="relative  w-full ml-[10px] pt-[25px]" style={{width: `calc(100% - 18px)`}}>
                              <div style={{height:  "calc(100% - 15px)"}} className="absolute left-0 top-0 w-px border-l-2 dark:border-neutral-800 border-neutral-200 rounded-full" />

                {Array.from({ length: 4 }).map((_, idx) => (
                
                    <GroupCard key={idx.toString() + channel?.name} />  
                    
                ))}
            </div>
            

        </div>
    );
}

