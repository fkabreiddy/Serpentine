import React, {useState} from "react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { KeyIcon } from "lucide-react";
import { Image } from "@heroui/image";
import { useLayoutStore } from "@/contexts/layout-context";
import { Tooltip } from "@heroui/tooltip";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { RightPanelView } from "@/models/right-panel-view";
import Avatar from "boring-avatars";

interface ChannelCardProps{
    index : number,
    channel: ChannelResponse
}

const ChannelCard:React.FC<ChannelCardProps> = ({index, channel}) =>{

    const {layout, setLayout} = useLayoutStore();
    const {setCurrentChannelId} = useGlobalDataStore();
    
    const setCurrentChannelIntoGlobalState = (channelId: number) =>{

        setCurrentChannelId(channelId);
        setLayout({currentRightPanelView: RightPanelView.DefaultView})
    }
  


    return(
    <>
       

        <div  className={`flex justify-between my-1  w-full max-w-full px-2 group  gap-2   transition-all cursor-pointer  `}>
            <div className="flex items-center  max-w-[80%] gap-3  ">
                <Tooltip content={channel.name} size={"sm"} showArrow={true} placement="right" isDisabled={layout.sideBarExpanded} >
                   
                   <div>
                        {channel.channelCoverPicture ? 
                            <Image src={channel.channelCoverPicture} className="shrink-0 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] "/> :

                            <Avatar size={24} className="max-md:!w-[24px] max-md:!h-[24px]" variant="marble" name={channel.name}/>

                            
                        } 
                   </div>
                    

                </Tooltip>
               
               {layout.sideBarExpanded && <p onClick={()=> setCurrentChannelIntoGlobalState(channel.id)} className="text-[13px] group-hover:underline group-hover:text-blue-500 transition-all font-normal opacity-80 whitespace-nowrap overflow-hidden text-ellipsis w-auto">#{channel.name}</p>}
                
            </div>
            
            {layout.sideBarExpanded &&  
                <div className="flex items-center gap-3">
                    {
                        channel.myMember.isOwner &&
                        <Tooltip size="sm" content={"You own this channel"} placement="right" showArrow={true}>
                            <KeyIcon size={15}/>
                        </Tooltip> 
                    }
                    {
                        channel.myMember.isSilenced && <Mute/>

                    }

                </div>
            }
           
        
        </div>
            
     
    </>
       
    )
}





const Mute = () => (

  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-[17px] opacity-20">
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
</svg>


)
export default ChannelCard;