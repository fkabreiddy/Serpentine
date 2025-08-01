import IconButton from "@/components/common/icon-button"
import UserAvatar from "./user-avatar"
import { ArrowLeft, ArrowUp, Ban, CopyIcon, Edit3Icon, InfoIcon, MessageCircleWarningIcon, MoreVertical, PlusCircle, TrashIcon, UserIcon, X } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown"
import { Spinner } from "@heroui/react"
import { channel } from "diagnostics_channel"
import { join } from "path"
import { ChannelMemberResponse } from "@/models/responses/channel-member-response"
import React from "react"

interface UserCardProps{

    channelMember : ChannelMemberResponse
    myChannelMember? : ChannelMemberResponse | null
}


const UserCard:React.FC<UserCardProps> = ({channelMember, myChannelMember} )=>{

    return(

        <div className="w-full items-center flex  gap-3 ">
            <UserAvatar src={channelMember?.userProfilePictureUrl ?? ""} userNameFallback={channelMember?.userUsername} size={40} />
            <div className="w-[90%]">
                <p className="text-[13px] font-semibold">@{channelMember?.userUsername} {myChannelMember?.id === channelMember.id && <>(You)</>}</p>
                <p className="text-xs font-normal opacity-60">{channelMember?.userName}{channelMember.isOwner && <> (Owner)</>}{!channelMember.isOwner && channelMember.role.name == "admin" && <>(Admin)</>}</p>

            </div>

            {channelMember.id === myChannelMember?.id ||  
                <UserCardDropdown imAdmin={myChannelMember?.role.name == "admin"} imOwner={myChannelMember?.isOwner} channelMember={channelMember}/>
            }
        </div>
    )
}

interface UserCardDropdownProps{

    imAdmin? : boolean,
    imOwner? : boolean,
    channelMember: ChannelMemberResponse 
}

const UserCardDropdown : React.FC<UserCardDropdownProps> = ({imAdmin = false, imOwner = false, channelMember}) =>{

    return(
        
        <Dropdown  placement="bottom-end" showArrow={true} className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  ">
        <DropdownTrigger>
            <button>
                <IconButton tooltipText="Manage">
                    <MoreVertical size={16} />
                </IconButton>
            </button>
           
        </DropdownTrigger>
        <DropdownMenu
            disabledKeys={ ["divider2", "divider"]}
            aria-label="Channel Actions"
            variant="flat"
        >
            
            <DropdownItem key="visit-profile" startContent={<UserIcon size={14}/>} isReadOnly={true}>
                <p className="text-[13px] font-normal">Visit profile</p>
            </DropdownItem>

            {imOwner ? 
            
                <>


                    <DropdownItem key="divider" isReadOnly={true}>
                        <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                    </DropdownItem>
                     <DropdownItem key="promote-member" startContent={<ArrowUp size={14}/>} isReadOnly={true}>
                        <p className="text-[13px] font-normal">Pormote member</p>
                        <p className="text-xs opacity-80">Promote user as an administrator</p>
                    </DropdownItem>
                </> :
                null
            }
          
            
            <DropdownItem key="divider2" isReadOnly={true}>
                <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </DropdownItem>
           


           {(channelMember !== null && (imOwner || (imAdmin && channelMember.role.name === "default")))
            ? (
                <>
                <DropdownItem color="danger" key="remove-user" startContent={<X size={14} />}>
                    <p className="text-[13px] font-normal">Kick user</p>
                </DropdownItem>
                <DropdownItem color="danger" key="ban-user" startContent={<Ban size={14} />}>
                    <p className="text-[13px] font-normal">Ban user</p>
                    <p className="text-xs opacity-80">Banned user can't no longer join</p>

                </DropdownItem>
                </>
            ) : null}

          
           
          
            

            
        </DropdownMenu>
        </Dropdown>
    )
}

export default UserCard