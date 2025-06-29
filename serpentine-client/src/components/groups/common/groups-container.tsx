import IconButton from "@/components/common/icon-button";
import SideBarButton from "@/components/panels/left-pannel/sidebar-button";
import { useLayoutStore } from "@/contexts/layout-context";
import { ChannelResponse } from "@/models/responses/channel-response";
import { ArrowLeft, FolderOpenIcon, Plus, X } from "lucide-react";
import React from "react";
import openBox from "../../../../public/profile-pictures/open-box-white.png"
import ChannelCard from "@/components/channels/common/channel-card";
import GroupCard from "./group-card";
import GroupCardMini from "./group-card-mini";


interface GroupsContainerProps {

    channel: ChannelResponse | null;
    onClose: () => void;
    
}

export default function GroupsContainer({channel, onClose}:GroupsContainerProps) {

    const {layout} = useLayoutStore()
    return (
        <div className={`${layout.sideBarExpanded ? "w-full" : "w-fit"} flex flex-col gap-2 items-center  `} >
            {!layout.sideBarExpanded &&
                <ChannelCard  channel={channel ?? new ChannelResponse()}/>
            }
            <div className="flex items-center justify-between w-full">
                {layout.sideBarExpanded &&        
                    <>
                        <IconButton placement="right"  onClick={onClose} tooltipText="Close groups" >
                            <ArrowLeft className="size-3"  />
                        </IconButton>
                        <h2 className="text-[13px] font-normal">{channel ? `#${channel.name}` : "Channel"}</h2>

                    </>         
                }
              
            </div>
            {!layout.sideBarExpanded &&             <hr className={` w-[80%] border-neutral-100 border rounded-full my-3 dark:border-neutral-900`} /> }
            <SideBarButton  text="Create a group"  >
                <Plus className="size-[18px]  cursor-pointer  transition-all"/>
            </SideBarButton>     
            {!layout.sideBarExpanded &&             <hr className={` w-[80%] border-neutral-100 border rounded-full my-3 dark:border-neutral-900`} /> }

            <div className="flex-grow h-full w-full flex-col flex items-center gap-3 justify-center">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <>
                        {layout.sideBarExpanded ? <GroupCard key={idx} /> : <GroupCardMini key={idx} index={idx} /> }
                    </>
                ))}
            </div>
            

        </div>
    );
}