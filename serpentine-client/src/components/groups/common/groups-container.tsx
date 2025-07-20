import IconButton from "@/components/common/icon-button";
import {useLayoutStore} from "@/contexts/layout-context";
import {ChannelResponse} from "@/models/responses/channel-response";
import {Info, PlusIcon, Settings} from "lucide-react";
import GroupCard from "./group-card";
import {ChannelBanner} from "@/components/channels/common/channel-banner";
import {ChannelCover} from "@/components/channels/common/channel-cover";
import {useEffect, useRef, useTransition} from "react";
import {useGetGroupsByChannelId} from "@/hooks/group-hooks.ts";
import {Spinner} from "@heroui/spinner";
import {RightPanelView} from "@/models/right-panel-view.ts";
import {useGlobalDataStore} from "@/contexts/global-data-context.ts";


interface GroupsContainerProps {

    channel: ChannelResponse | null;
    
}

export default function GroupsContainer({channel}:GroupsContainerProps) {

    const {getGroupsByChannelId, groups, setGroups} = useGetGroupsByChannelId();
    const prevChannelId = useRef("");
    const {setCurrentChannelId, createdGroup, setCreatedGroup} = useGlobalDataStore();
    const {layout, setLayout} = useLayoutStore();
    const [loadingGroups, startLoadingGroups] = useTransition();
    
    

    const fetchChannels = async () =>{
        
        if(!channel ) return;
        await getGroupsByChannelId({
            channelId: channel.id,
            skip: groups.length,
            take: 5
        })
    }

    useEffect(() => {
        
        if(createdGroup && createdGroup.channelId === channel?.id){
            
            setGroups((prev)=>([...prev, createdGroup]));
            setCreatedGroup(null);
        }
    }, [createdGroup]);
    
    useEffect(() => {
        if(channel === null) return;
        
        if(channel.id !== prevChannelId.current) {
            
            prevChannelId.current = channel.id;
            
            startLoadingGroups(async () => {
                 await fetchChannels();

            })
            
        }
    }, [channel?.id]);
    
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
                    {((channel?.myMember?.role && channel?.myMember.role.name == "admin") || channel?.myMember?.isOwner) ?
                       <>
                           <IconButton onClick={()=> {
                               setLayout({currentRightPanelView: RightPanelView.CreateGroupFormView}); 
                               setCurrentChannelId(channel?.id);
                           }} placement="right"  tooltipText="Add a group" >
                               <PlusIcon className="size-[18px]"  />
                           </IconButton>
                           <IconButton placement="right"   tooltipText="Manage" >
                               <Settings className="size-[18px]"  />
                           </IconButton>
                       </>
                        :
                        <IconButton placement="right"   tooltipText="About" >
                            <Info className="size-[18px]"  />
                        </IconButton>
                        
                       
                    }
                   
                </div>
                       
                        <h2  className="text-[13px] font-normal justify-self-end">{channel ? `#${channel.name}` : "Channel"}</h2>

                  
            </div>
                 

            <div className="relative  w-full ml-[10px] pt-[25px]" style={{width: `calc(100% - 18px)`}}>

                {groups.length >= 1 &&
                    <div style={{height:  "calc(100% - 15px)"}} className="absolute left-0 top-0 w-px border-l-2 dark:border-neutral-800 border-neutral-200 rounded-full" />
                }
                {groups.map((group, idx) => (
                
                    <GroupCard group={group} key={idx.toString() + channel?.name} />  
                    
                ))}
               
            </div>
            {loadingGroups && <Spinner size={"sm"} variant={"dots"} className={" "}/>}
            {!loadingGroups && groups.length <= 0 && <span className={"text-xs mt-[40px] opacity-50"}>No groups found on this channel (T_T)</span>}

        </div>
    );
}

