import { ChannelResponse } from "@/models/responses/channel-response";
import { ChannelBanner } from "./channel-banner";
import { ChannelCover } from "./channel-cover";
import { Badge, Button, Chip, Popover, PopoverContent, PopoverTrigger, Spinner, Tooltip, user } from "@heroui/react";
import { Info, KeyIcon, LockIcon, PlusIcon, User2Icon, UserCheck, UserCheck2, UserIcon, UserLock, UserPlus2 } from "lucide-react";
import IconButton from "@/components/common/icon-button";
import { useCreateChannelMember } from "@/hooks/channel-member-hooks";
import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/helpers/sonner-helper";

interface SearchChannelCardProps {
  channel: ChannelResponse;
  infoClicked: (channelId: string) => void;
  onJoin: (channel : ChannelResponse)=>void;
  userIsOverage: boolean

}
export default function SearchChannelCard({
  channel,
  userIsOverage = true,
  infoClicked,
  onJoin
}: SearchChannelCardProps) {


  const {createChannelMember, joining,  setChannelMember, channelMember} = useCreateChannelMember();
  const canJoin = channel.myMember === null;

  const join = useCallback(async () => {
    await createChannelMember({ channelId: channel.id });
  }, [channel.id, createChannelMember]);

  useEffect(()=>{

    if(channelMember)
    {
       channel.myMember = channelMember;
       onJoin(channel);
       showToast({title: `Channel joined`, description: `You've joined "${channel.name}'s" channel`})

       setChannelMember(null);
    }

  },[channelMember])


  return (


    <div  key={channel.id}  className="flex relative  px-2 rounded-lg   flex-col gap-2 w-full max-w-full ">
        <div className="flex flex-col w-full gap-2 relative  mb-2">
         
          <ChannelBanner  isBlurred={false} pictureUrl={channel?.bannerPicture ?? ""} />
          <ChannelCover
            absolute={true}
            isSmall={false}
            pictureUrl={channel?.coverPicture ?? ""}
            channelName={channel?.name ?? ""}
          />
        </div>
        <div className="flex items-center gap-3 w-full  justify-between">
          <div className="flex items-center gap-3">
            <IconButton
              placement="right"
              onClick={() => {
                infoClicked(channel.id);
              }}
              tooltipText="About"
            >
              <Info className="size-[18px]" />
            </IconButton>
            {canJoin ? 
             (!userIsOverage && channel.adultContent  ?  
              <Tooltip size="sm" placement="bottom" showArrow={true} content="This channel contains +18 content. You must be overage to join">
                   <UserLock size={18}/>

                </Tooltip> :
              <IconButton onClick={()=> join()}  tooltipText="Join">
                {joining ? <Spinner size="sm" variant="spinner"/> : <UserPlus2 size={18}/>}
              </IconButton> 

              
            ) : 
                <Tooltip size="sm" placement="bottom" showArrow={true} content="You've joined this channel">
                   <UserCheck2 size={18}/>

                </Tooltip>
             }
           
            
          </div>

            
            <p
                className="text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
              >
                #{channel.name}
              </p>
        </div>
        <p className="text-xs my-3 opacity-70 line-clamp-3"><strong>Description: </strong>{channel.description}</p>

        <div className="w-full  mt-auto flex items-center gap-3">
            {channel.adultContent &&  
              <Popover placement="bottom" showArrow={true}>
                <PopoverTrigger>
                  <Chip size="sm" className="cursor-pointer" color="danger"> 
                    <p className="text-[13px] font-semibold">+18</p>
                  </Chip>

                </PopoverTrigger>
                <PopoverContent  className="w-[200px] p-2">
                  <p className="text-[13px] ">This channel may content content that may result innapropiate for some people. We ask discression.</p>
                </PopoverContent>
              </Popover>
            }
            
            <Chip size="sm" variant="flat" className="cursor-pointer" color="default"> 
              <p className="text-xs ">{channel.membersCount >= 1000 ? "1k+ " : channel.membersCount} Members</p>
            </Chip>

               

            
           
        </div>
    </div>

    
  );
}
