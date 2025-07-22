import { useGlobalDataStore } from "@/contexts/global-data-context"
import { useDeleteChannel, useGetChannelById } from "@/hooks/channel-hooks";
import { useEffect, useState, useRef } from "react";
import {Spinner} from "@heroui/spinner"
import { ChannelBanner } from "./channel-banner";
import { ChannelCover } from "./channel-cover";
import { Activity, ArrowLeft, CakeIcon, Edit, Edit3Icon, EditIcon, InfoIcon, MessageCircleWarningIcon, MoreVertical, TrashIcon, UserIcon } from "lucide-react";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { HubResult } from "@/models/hub-result";
import { Accordion, AccordionItem } from "@heroui/accordion";
import IconButton from "@/components/common/icon-button";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@heroui/react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { ChannelMemberRoleResponse } from "@/models/responses/channel-member-role-response";
import { useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";


export default function ManageChannelView(){

    const {channelInfoId} = useGlobalDataStore();
    const { getChannelById, channel, loadingChannel } = useGetChannelById();
    const {activeChannelsHub} = useActiveChannelsHubStore();
    const [activeUsers, setActiveUsers] = useState(0);
    const [showMoreDescription, setShowMoreDescription] = useState(false);

    const getChannelActiveMembersCount = async (channelId: string)  => {
    
        if (!activeChannelsHub) return ;
    
        try {
          const result: HubResult<number> = await activeChannelsHub.invoke("GetActiveUsersOnAChannelById", channelId);
          if (result.isSuccess && result.data !== null) {
             setActiveUsers(result.data);
             return;
          }
          setActiveUsers(0);
        } catch (error) {
          setActiveUsers(0);
        }
};
    const fetchChannel = async () => {
        if(!channelInfoId) return;
        await getChannelById({ channelId: channelInfoId });
        await getChannelActiveMembersCount(channelInfoId);
    };

  

    function getRelativeDate(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
        if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
        if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
        return "just now";
    }

    useEffect(() => {



        fetchChannel();

    }, [channelInfoId]);
    return(
        <>
            {

                (!channel  && !loadingChannel) || !channelInfoId? 
                <div className="relative h-full w-full">
                    <p className="text-xs">Channel not found. Try again later.</p>
                </div>  : 
                
                <>
                    {
                        (loadingChannel || !channel) ? 
                        <div className="relative h-full w-full">
                            <Spinner className="absolute top-1/2 left-1/2 " size="sm" variant="dots"/>
                        </div> :

                        <div className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4">
                        
                         <div className="">
                                <h2 className="text-md font-semibold max-md:text-center">Manage your channel</h2>
                                <p className="text-xs opacity-45 max-md:text-center">Manage channels you own or you administer</p>
                            </div>
                            {channel && 
                                <div className="flex flex-col w-full gap-2 relative mt-2 ">
                                    <ChannelBanner pictureUrl={channel?.bannerPicture}  />
                                    <ChannelCover absolute={true} isSmall={false} pictureUrl={channel.coverPicture} channelName={channel.name}/>                    
                                </div>
                            }
                            <div className="flex w-full gap-2 items-start justify-between">
                                <div className="flex flex-col max-w-[70%]">
                                    <p className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full" style={{fontSize: '18px'}}>#{channel?.name}</p>
                                    <p className="opacity-50 whitespace-nowrap overflow-hidden text-ellipsis max-w-full mt-1 text-[10px] font-normal">id.{channel?.id}</p>

                                </div>

                                
                            
                                { (channel.myMember?.isOwner || channel.myMember?.role?.name === "admin")  && 

                                    <OptionsDropdown channel={channel}>
                                           
                                    </OptionsDropdown>
                                }
                                
                            </div>
                            <div className="w-full" id={"channel-description-container"} >
                                <p   style={{height: showMoreDescription ? "auto" : "60px"}} className="w-full font-normal opacity-80 text-[13px] whitespace-pre-line  text-ellipsis overflow-hidden ">
                                    {channel?.description && 
                                            <>{channel.description}</>
                                    }
                                </p>
                            </div>

                            {channel && channel?.description.length >= 100 &&
                                <a className="text-blue-500 text-xs cursor-pointer" onClick={() => setShowMoreDescription(!showMoreDescription)}>{showMoreDescription ? "Show less..." : "Show more..."}</a>
                            }
                            <hr className="w-full border-t border-neutral-200 dark:border-neutral-800"/>
                            <div className="flex flex-col gap-4">
                                <p className="opacity-80 mt-1 text-xs font-normal flex gap-2 items-center">
                                    <CakeIcon className="size-[18px]"/> {channel?.createdAt
                                        ? (() => {
                                            const date = new Date(channel.createdAt);
                                            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} (${getRelativeDate(date)})`;
                                        })() 
                                        : ""}
                                </p>
                                <div className="flex items-center gap-2">
                                    <UserIcon size={18}/>
                                    <p className="opacity-90 mt-1 text-xs font-normal">{channel?.membersCount} Members </p>

                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity size={18}/>
                                    <div className="size-1 bg-blue-600 rounded-full"/>
                                    <p style={{fontSize: '12px'}} className="opacity-90 font-normal">{activeUsers} Active users</p> 
                                </div>

                            </div>
                            <hr className="w-full border-t border-neutral-200 dark:border-neutral-800"/>

                        </div>
                    }
                
                </>
              
            }
        </>
    )
}


const OptionsDropdown: React.FC<{ channel: ChannelResponse }> = ({ channel }) => {

    const {deleteChannel, deletingChannel, channelDeleted} = useDeleteChannel();
    const {setChannelInfoId, setDeletedChannelId} = useGlobalDataStore();

    const {setLayout} = useLayoutStore();

    const fetchDeleteChannel = async () => {

        await deleteChannel({channelId: channel.id});
    }

    useEffect(() => {
        if (channelDeleted) {
            setChannelInfoId(null);
            setDeletedChannelId(channel.id);
            setLayout({currentRightPanelView: RightPanelView.DefaultView});
        }
    }, [channelDeleted]);
    return(

      <Dropdown placement="bottom-end">
        <DropdownTrigger>
            <button>
                <IconButton tooltipText="Manage">
                    <MoreVertical size={16}/>
                </IconButton>    
            </button>
        </DropdownTrigger>
        <DropdownMenu disabledKeys={["divider", "divider2"]} aria-label="Channel Actions" variant="flat" >
          <DropdownItem key="channelInf" startContent={<InfoIcon size={16}/>} className="h-14 gap-2">
            <p className="font-semibold text-xs">#{channel.name}</p>
            <p className="font-normal text-xs opacity-60">{channel.id}</p>
          </DropdownItem>
           <DropdownItem key="divider" isReadOnly={true}>
                <hr className="w-full border-t border-neutral-200 dark:border-neutral-800"/>
             </DropdownItem>
          <>
                {(channel.myMember?.role?.name === "admin" || channel.myMember?.isOwner) &&  
                    <>
                        <DropdownItem key="edit" endContent={<Edit3Icon size={16}/>} >
                            <p className="font-normal text-[13px]">Edit this channel</p>

                        </DropdownItem>

                    </>
                }
                    
            </>
            <>
                { !channel.myMember && <DropdownItem key="join">Join</DropdownItem> }
            </>
                <DropdownItem key="report" endContent={<MessageCircleWarningIcon size={16}/>} >            
                <p className="font-normal text-[13px]">Report an issue</p>
                </DropdownItem>
             <>

             <DropdownItem key="divider2" isReadOnly={true}>
                <hr className="w-full border-t border-neutral-200 dark:border-neutral-800"/>
             </DropdownItem>
         {
            channel.myMember?.isOwner ?       
            <DropdownItem color="danger" key="delete" onClick={() => fetchDeleteChannel()} endContent={deletingChannel ? <Spinner variant="spinner" size="sm" /> : <TrashIcon size={16}/>}>

                <p className="font-normal text-[13px]">Delete this channel</p>

            </DropdownItem> :
            <DropdownItem color="danger" key="delete" endContent={<ArrowLeft size={16}/>}>

                <p className="font-normal text-[13px]">Leave this channel</p>

            </DropdownItem>
        }
         </>
        
        </DropdownMenu>
      </Dropdown>
     
  
    )
}