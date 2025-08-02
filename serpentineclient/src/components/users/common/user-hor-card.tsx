import IconButton from "@/components/common/icon-button"
import UserAvatar from "./user-avatar"
import { ArrowLeft, ArrowUp, Ban, CopyIcon, Edit3Icon, InfoIcon, MessageCircleWarningIcon, MoreVertical, PlusCircle, TrashIcon, UserIcon, X } from "lucide-react"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Textarea } from "@heroui/react"
import { channel } from "diagnostics_channel"
import { join } from "path"
import { ChannelMemberResponse } from "@/models/responses/channel-member-response"
import React, { useEffect, useState } from "react"
import { useCreateBan } from "@/hooks/channel-ban-hooks"
import { CreateChannelBanRequest, createChannelBanSchema } from "@/models/requests/channel-ban/create-channel-ban-request"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAuthStore } from "@/contexts/authentication-context"

interface UserCardProps{

    channelMember : ChannelMemberResponse
    myChannelMember? : ChannelMemberResponse | null
}


const UserCard:React.FC<UserCardProps> = ({channelMember, myChannelMember} )=>{

    return(

        <div className="w-full items-center flex  gap-3 ">
            <UserAvatar src={channelMember?.userProfilePictureUrl ?? ""} userNameFallback={channelMember?.userUsername} size={30} />
            <div className="w-[90%]">
                <p className="text-[13px] font-semibold">@{channelMember?.userUsername} {myChannelMember?.id === channelMember.id && <>(You)</>}</p>
                <p className="text-xs font-normal opacity-60">{channelMember?.userName}{channelMember.isOwner && <> (Owner)</>}{!channelMember.isOwner && channelMember.isAdmin && <>(Admin)</>}</p>

            </div>

            {channelMember.id === myChannelMember?.id ||  
                <UserCardDropdown imAdmin={myChannelMember?.isAdmin} imOwner={myChannelMember?.isOwner} channelMember={channelMember}/>
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

    const [showBanModal, setShowBanModal] = useState(false);

   
    return(
        <>
            <BanUserModal  open={showBanModal} onOpenChanged={setShowBanModal} channelMember={channelMember}/>
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
           


           {(channelMember !== null && (imOwner || (imAdmin && !channelMember.isAdmin)))
            ? (
                <>
                <DropdownItem color="danger" key="remove-user" startContent={<X size={14} />}>
                    <p className="text-[13px] font-normal">Kick user</p>
                </DropdownItem>
                <DropdownItem onClick={()=>{setShowBanModal(true)}} color="danger" key="ban-user" startContent={<Ban size={14} />}>
                    <p className="text-[13px] font-normal">Ban user</p>
                    <p className="text-xs opacity-80">Banned user can't no longer join</p>

                </DropdownItem>
                </>
            ) : null}

          
           
          
            

            
        </DropdownMenu>
            </Dropdown>
        </>
      
    )
}

interface BanUserModalProps{
    open: boolean
    onOpenChanged: (change:boolean) => void;
    channelMember: ChannelMemberResponse
}

const BanUserModal : React.FC<BanUserModalProps> = ({open, onOpenChanged, channelMember}) =>{

    const fetchBan = async (request: CreateChannelBanRequest) =>{


        await createBan(request);
    }

    
    useEffect(()=>{

        if(!channelMember) return;

        setValue("channelId", channelMember.channelId);
        setValue("userId", channelMember.userId);
    },[channelMember])

    const {ban, createBan, creatingBan} = useCreateBan();

    useEffect(()=>{

        if(!ban) return;

        onOpenChanged(false);
    },[ban])

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
      } = useForm({
        resolver: zodResolver(createChannelBanSchema),
        mode: "onChange",
        defaultValues: {
            reason: "",
            channelId: channelMember.channelId,
            userId: channelMember.userId
        }
        
    
        
    });
    return(

        <Modal style={{zIndex: "9999999"}} isOpen={open} onOpenChange={onOpenChanged}>
        <ModalContent style={{zIndex: "9999999"}} className="dark:bg-neutral-900/50 max-w-[350px] backdrop-blur-lg">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ban user</ModalHeader>
              <ModalBody>
                <p className="text-[13px] font-normal">
                 Banning the user <strong>@{channelMember.userUsername}</strong> from this channel make them unable to join again and will be removed from this channel. This action can be undone later, do you wanna procceed?
                </p>
                <form 
                    onSubmit={handleSubmit((data) => fetchBan(data))}
                    className="w-full relative  flex flex-col gap-3 mt-4"

                 >

                    <Textarea
                        label="reason"
                        type="text"
                        placeholder="The reason of the ban"
                        minLength={3}
                        maxLength={100}
                        value={watch("reason")}
                        labelPlacement="outside"
                        id={"ban-reason"}
                        isRequired={true}
                        autoComplete="ban-reason"
                        description="Must be more than 5 characters and less than 300"
                        {...register("reason")}
                        errorMessage={errors.reason?.message}
                        isInvalid={errors.reason?.message !== undefined}
                    />

                    <div className="w-full items-center justify-end gap-3">
                    <Button type="button" size="sm" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button isDisabled={!isValid || creatingBan} type="submit" className="bg-red-700 text-white" size="sm" >
                        {creatingBan ? <Spinner size="sm" variant="spinner"/> : "Yes, ban this user"}
                    </Button>
                    </div>
                    
                </form>
                
              </ModalBody>
              
            </>
          )}
        </ModalContent>
      </Modal>
    )
}

export default UserCard