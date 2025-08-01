import IconButton from "@/components/common/icon-button"
import UserAvatar from "./user-avatar"
import { ArrowLeft, Ban, CopyIcon, Edit3Icon, InfoIcon, MessageCircleWarningIcon, MoreVertical, PlusCircle, TrashIcon, UserIcon, X } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown"
import { Spinner } from "@heroui/react"
import { channel } from "diagnostics_channel"
import { join } from "path"
import { ChannelMemberResponse } from "@/models/responses/channel-member-response"
import React from "react"



const UserCard = ( )=>{

    return(

        <div className="w-full items-center flex  gap-3 ">
            <UserAvatar size={40} />
            <div className="w-[90%]">
                <p className="text-[13px] font-semibold">@fkabreiddy</p>
                <p className="text-xs font-normal opacity-60">Breiddy Garcia</p>

            </div>
           <UserCardDropdown/>
        </div>
    )
}

interface UserCardDropdownProps{

    channelMember? : ChannelMemberResponse
    myChannelMember? : ChannelMemberResponse 
}

const UserCardDropdown : React.FC<UserCardDropdownProps> = ({channelMember, myChannelMember}) =>{

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
            disabledKeys={ ["divider2"]}
            aria-label="Channel Actions"
            variant="flat"
        >
            
            <DropdownItem key="visit-profile" startContent={<UserIcon size={14}/>} isReadOnly={true}>
                <p className="text-[13px] font-normal">Visit profile</p>
            </DropdownItem>
            <DropdownItem key="divider2" isReadOnly={true}>
                <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </DropdownItem>
           


           {(myChannelMember !== null && channelMember !== null && (myChannelMember?.isOwner || (myChannelMember?.role.name === "admin" && channelMember.role.name === "default")))
            ? (
                <>
                <DropdownItem key="remove-user" startContent={<X size={14} />}>
                    <p className="text-[13px] font-normal">Remove user</p>
                </DropdownItem>
                <DropdownItem key="ban-user" startContent={<Ban size={14} />}>
                    <p className="text-[13px] font-normal">Ban user</p>
                </DropdownItem>
                </>
            ) : null}
          
            

            
        </DropdownMenu>
        </Dropdown>
    )
}

export default UserCard