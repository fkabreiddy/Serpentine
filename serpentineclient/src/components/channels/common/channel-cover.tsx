import { Image } from "@heroui/image";
import Avatar from "boring-avatars";
import { Badge } from "@heroui/badge";
import React, {useEffect, useState} from "react";
import {
  ArrowLeft,
  CopyIcon,
  Edit3Icon,
  InfoIcon,
  MessageCircleWarningIcon,
  MoreVertical, PlusCircle,
  TrashIcon
} from "lucide-react";
import { motion } from "motion/react";
import {ChannelResponse} from "@/models/responses/channel-response.ts";
import {useDeleteChannel} from "@/hooks/channel-hooks.ts";
import {useGlobalDataStore} from "@/contexts/global-data-context.ts";
import {useCreateChannelMember} from "@/hooks/channel-member-hooks.ts";
import {useLayoutStore} from "@/contexts/layout-context.ts";
import {RightPanelView} from "@/models/right-panel-view.ts";
import {showToast} from "@/helpers/sonner-helper.ts";
import {Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger} from "@heroui/react";
import IconButton from "@/components/common/icon-button.tsx";
import {Spinner} from "@heroui/spinner";

export interface ChannelCoverProps {
  pictureUrl: string | null;
  channelName: string | null;
  isSmall: boolean;
  absolute: boolean;
  unreadMessages?: number;
  isEditable: boolean;
  channel?: ChannelResponse | null
}

export const ChannelCover: React.FC<ChannelCoverProps> = ({
  pictureUrl,
  channelName,
  isSmall = false,
  absolute = false,
  unreadMessages = 0,
  isEditable = false,
    channel = null
}) => {
    
   
    return(
      <Badge
        shape={"circle"}
        isInvisible={unreadMessages <= 0}
        content={unreadMessages}
        placement="bottom-right"
        className={"bg-blue-600 text-white text-[10px]"}
      >
        <>
          
          <div className={"group cursor-pointer"}>
            {pictureUrl ? (
                <img


                    src={pictureUrl}
                    style={{objectFit: "cover"}}
                    className={`shrink-0    ${absolute && "absolute  -bottom-[2px] right-[20px] ring-[3px] dark:ring-black  ring-white"} ${!isSmall ? "!size-[60px] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]" : "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]"}  rounded-full `}
                />
            ) : (
                <Avatar
                    size={!isSmall ? 50 : 28}
                    className={`shrink-0 rounded-full ${absolute && "absolute -bottom-[10px] right-[20px] ring-[3px] dark:ring-black  ring-white"} ${!isSmall ? "!size-[50px] min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]" : "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]"}`}
                    variant="marble"
                    name={channelName ?? "serpentine"}
                />
            )}
            {(absolute && isEditable && channel?.myMember && (channel?.myMember.isOwner || channel?.myMember.isAdmin)) &&
                <motion.div
                    
                    whileHover={{opacity: 1}}
                    animate={{opacity: 0}}
                    exit={{opacity: 0}}
                    className={`shrink-0 z-[32] invisible group-hover:visible flex items-center justify-center  backdrop-blur-md backdrop-opacity-90 ${absolute && "absolute -bottom-[2px] right-[20px] ring-[3px] dark:ring-black  ring-white"} ${!isSmall ? "!size-[60px] min-w-[60px] min-h-[60px] max-w-[60px] max-h-[60px]" : "!size-[28px] min-w-[28px] max-h-[28px] max-w-[28px] min-h-[28px]"}  rounded-full `}
                >
                  <EditCoverDropdown channel={channel} />
                </motion.div>
            }
          </div>
         
         
        </>
       
      </Badge>
    )
};


const EditCoverDropdown: React.FC<{ channel: ChannelResponse }> = ({
   channel,
 }) => {
  const {  deletingChannel } = useDeleteChannel();
  const { setChannelInfoId, setChannelJoined, setUpdateChannelid } = useGlobalDataStore();
  const {createChannelMember, joining,  setChannelMember, channelMember} = useCreateChannelMember();
  const {setLayout} = useLayoutStore();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);




  function showUpdateChannelForm()
  {
    setUpdateChannelid(channel.id);
    setLayout({currentRightPanelView: RightPanelView.UpdateChannelFormView})
  }
  const join = async () =>{


    await createChannelMember({channelId: channel.id});
  }

  useEffect(()=>{

    if(channelMember)
    {
      channel.myMember = channelMember;
      setChannelJoined(channel);
      showToast({title: `Channel joined`, description: `You've joined "${channel.name}'s" channel`})
      setChannelMember(null);
      setLayout({currentRightPanelView: RightPanelView.DefaultView});
      setChannelInfoId(null);
    }

  },[channelMember])



  async function copyIdToClipboard()
  {
    await navigator.clipboard.writeText(channel.id);
    showToast({ description: "Channel Id copied to clipboard!"})

  }


  return (
      <>
        <Dropdown  placement="bottom-end" offset={25} showArrow={true} className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  ">
          <DropdownTrigger className={"border-0 outlined-none"}>
            <Edit3Icon size={24} />
          </DropdownTrigger>
          <DropdownMenu
              aria-label="Edit Channels Actions"
              variant="flat"
          >
            <DropdownSection  showDivider={false} title={"Cover Actions"}>
              <DropdownItem    key="editCover"  >
                <p className="font-normal text-[13px]">Edit Cover</p>
              </DropdownItem>

              <>
                {channel.coverPicture !== "" && channel.coverPicture &&
                    <DropdownItem    key="editBanner"  color={"danger"} >
                      <p className="font-normal text-[13px]">Remove Cover</p>
                    </DropdownItem>
                }
              </>
             
             
            </DropdownSection>
              <DropdownSection showDivider={false} title={"Banner Actions"}>
                <>
                      <DropdownItem    key="removeCover" >
                        <p className="font-normal text-[13px]">Edit Banner</p>
                      </DropdownItem>
                  

                  {channel.bannerPicture !== "" && channel.bannerPicture &&
                      <DropdownItem  key="removeBanner"  color={"danger"} >
                        <p className="font-normal text-[13px]">Remove Banner</p>
                      </DropdownItem>
                  }
                
                </>
                
                
              </DropdownSection>
              
              

              
               
              

            
          </DropdownMenu>
        </Dropdown>
      </>

  );
};


