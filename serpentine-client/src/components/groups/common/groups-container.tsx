import IconButton from "@/components/common/icon-button";
import SideBarButton from "@/components/panels/left-pannel/sidebar-button";
import { useLayoutStore } from "@/contexts/layout-context";
import { ChannelResponse } from "@/models/responses/channel-response";
import { ArrowLeft, FolderOpenIcon, Plus, PlusIcon, Settings, X } from "lucide-react";
import React from "react";
import openBox from "../../../../public/profile-pictures/open-box-white.png"
import ChannelCard from "@/components/channels/common/channel-card";
import GroupCard from "./group-card";
import GroupCardMini from "./group-card-mini";
import { ChannelBanner } from "@/components/channels/common/channel-banner";
import { CoverAvatar } from "@/components/channels/common/cover";
import Avatar from "boring-avatars";


interface GroupsContainerProps {

    channel: ChannelResponse | null;
    onClose: () => void;
    
}

export default function GroupsContainer({channel, onClose}:GroupsContainerProps) {

    const {layout} = useLayoutStore()
    return (
        <div className={`${layout.sideBarExpanded ? "w-full" : "w-fit"} flex flex-col  items-center   `} >
            {channel && 
                <div className="flex flex-col w-full gap-2 relative mt-2 mb-4">
                    <ChannelBanner pictureUrl={channel?.bannerPicture}  />
                    <CoverAvatar pictureUrl={channel.coverPicture} channelName={channel.name}/>                    
                </div>
            }
            <div className="flex items-center gap-3 w-full justify-between">
               
                <div className="flex items-center gap-3">
                    <IconButton placement="right"  onClick={onClose} tooltipText="Add a group" >
                        <PlusIcon className="size-[18px]"  />
                    </IconButton>
                    <IconButton placement="right"  onClick={onClose} tooltipText="Manage" >
                        <Settings className="size-[18px]"  />
                    </IconButton>
                </div>
                       
                        <h2  className="text-[13px] font-normal justify-self-end">{channel ? `#${channel.name}` : "Channel"}</h2>

                  
            </div>
                 

            <div className="relative  w-full ml-[10px] pt-[25px]" style={{width: `calc(100% - 18px)`}}>
                              <div style={{height:  "calc(100% - 15px)"}} className="absolute left-0 top-0 w-px border-l-2 dark:border-neutral-800 border-neutral-200 rounded-full" />

                {Array.from({ length: 4 }).map((_, idx) => (
                    <>
                        {layout.sideBarExpanded ? <GroupCard key={idx} /> : <GroupCardMini name={idx.toString()} key={idx} index={idx} /> }
                    </>
                ))}
            </div>
            

        </div>
    );
}

