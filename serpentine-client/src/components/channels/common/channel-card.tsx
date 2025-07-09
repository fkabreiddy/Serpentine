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

    <div className="relative w-full ">
      {/* Main Node */}
      <div className="flex items-center gap-3 " onClick={() => {setCurrentChannelIntoGlobalState(channel.id); setIsExpanded(!isExpanded);}} >
        <div
          {...rest}
          className={`flex  justify-between ${layout.sideBarExpanded ? "rounded-lg py-2 px-1 " : "rounded-full p-1 "}    w-full max-w-full  min-w-fit !shrink-0 group   gap-2   transition-all cursor-pointer  `}
        >
          <div className="flex items-center  max-w-[80%] gap-3  ">
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
                    className="shrink-0 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] "
                  />
                ) : (
                  <Avatar
                    size={24}
                    className="max-md:!w-[24px] max-md:!h-[24px]"
                    variant="marble"
                    name={channel.name}
                  />
                )}
              </div>
            </Tooltip>
            {layout.sideBarExpanded && (
              <p
                
                className="text-[13px] group-hover:underline group-hover:text-blue-500 opacity-80 hover:opacity-100 transition-all font-normal whitespace-nowrap overflow-hidden text-ellipsis w-auto"
              >
                #{channel.name}
              </p>
            )}
          </div>
          {layout.sideBarExpanded && (
            <div className="flex items-center gap-3">
              {channel.myMember.isOwner && (
                <Tooltip size="sm" content={"You own this channel"} placement="right" showArrow={true}>
                  <KeyIcon className="opacity-60" size={15} />
                </Tooltip>
              )}
              {channel.myMember.isSilenced && <Mute />}
            </div>
          )}
        </div>
      </div>

      {isExpanded && (

        <>

             
        
            <div className="relative ml-4 ">
              <div style={{height:  "calc(100% - 15px)"}} className="absolute left-0 top-0 w-px border-l-2 dark:border-neutral-800 border-neutral-200 rounded-full" />
              
              
              {Array.from({ length: groups }).map((group, idx) => (
                <GroupCard key={idx} />
              ))}                
            </div>
        
        </>
       
      )}
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