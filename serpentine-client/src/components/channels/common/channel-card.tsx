import React, {useEffect, useState} from "react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { KeyIcon, VolumeOffIcon } from "lucide-react";
import { Image } from "@heroui/image";
import { useLayoutStore } from "@/contexts/layout-context";
import { Tooltip } from "@heroui/tooltip";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { RightPanelView } from "@/models/right-panel-view";
import Avatar from "boring-avatars";
import GroupCard from "@/components/groups/common/group-card";
import CustomButton from "@/components/common/custom-button";
import { Button } from "@heroui/button";
import { motion } from "motion/react";

type ChannelCardProps ={
    channel: ChannelResponse
} & React.HTMLAttributes<HTMLDivElement>;

const ChannelCard:React.FC<ChannelCardProps> = ({channel, ...rest}) =>{

    const {layout, setLayout} = useLayoutStore();
    const {setCurrentChannelId} = useGlobalDataStore();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [groups, setGroups] = useState<number>(() => Math.floor(Math.random() * 5) + 1)
    const setCurrentChannelIntoGlobalState = (channelId: string) =>{

        setCurrentChannelId(channelId);
        setLayout({currentRightPanelView: RightPanelView.DefaultView})
    }
  

    useEffect(()=>{

        if(!layout.sideBarExpanded)
        {
            setIsExpanded(false);
        }
    },[layout.sideBarExpanded])


    return(


    <>

      {/* Main Node */}
      <div className="flex items-center gap-3 flex-col w-[50px] " onClick={() => {setCurrentChannelIntoGlobalState(channel.id); setIsExpanded(!isExpanded);}} >
        <div
          {...rest}
          className={`flex items-center flex-col  w-full max-w-full  min-w-fit !shrink-0 group   gap-2   transition-all cursor-pointer  `}
        >
            <Tooltip
              content={channel.name}
              size={"sm"}
              showArrow={true}
              placement="right"
              isDisabled={layout.sideBarExpanded}
            >

              
              <div>
                {channel.coverPicture ? (
                  <Image
                    src={channel.coverPicture || "/placeholder.svg"}
                    className={`shrink-0 ${layout.sideBarExpanded ? "!size-[40px] min-w-[40px] min-h-[40px] max-w-[40px] min-h-[40px]" : "!size-[28px] min-w-[28px] min-h-[28px] max-w-[28px] min-h-[28px]"}  rounded-full `}
                  />
                ) : (
                  <Avatar
                    size={layout.sideBarExpanded ? 40 : 28}
                    className={`shrink-0 ${layout.sideBarExpanded ? "!size-[40px] min-w-[40px] min-h-[40px] max-w-[40px] min-h-[40px]" : "!size-[28px] min-w-[28px] min-h-[28px] max-w-[28px] min-h-[28px]"}`}
                    variant="marble"
                    name={channel.name}
                  />
                )}
              </div>
            </Tooltip>
            {layout.sideBarExpanded && (
              <p
                
                className="text-[11px] max-w-[50px] group-hover:underline group-hover:text-blue-500 opacity-80 hover:opacity-100 transition-all font-normal whitespace-nowrap overflow-hidden text-ellipsis w-auto"
              >
                {channel.name}
              </p>
            )}
         
        </div>
      </div>

     
      

       
            
     
    </>
       
    )
}





const Mute = () => (

  <VolumeOffIcon size={15}/>


)

const Line = () => (

    <div className="h-[40px] rounded-bl-lg border-l border-neutral-500 absolute left-[15px] top-[10px] z-[-1]">

    </div>
)
export default ChannelCard;