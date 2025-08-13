import IconButton from "@/components/common/icon-button"
import UserAvatar from "./user-avatar"
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    Ban,
    CopyIcon,
    Edit3Icon,
    InfoIcon,
    MessageCircleWarningIcon,
    MoreVertical,
    PlusCircle,
    TrashIcon,
    UserIcon,
    X
} from "lucide-react"
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
import {useDeleteChannelMember, useUpdateChannelMember} from "@/hooks/channel-member-hooks.ts";
import { useLayoutStore } from "@/contexts/layout-context"

interface UserCardProps{

    channelMember : ChannelMemberResponse
    myChannelMember? : ChannelMemberResponse | null
    onUpdated:(channelMember: ChannelMemberResponse) => void
    onKickedOut: (channelMemberId: string) => void;
}


const UserCard:React.FC<UserCardProps> = ({channelMember, onKickedOut, onUpdated, myChannelMember} )=>{

    function handleChannelMemberUpdated(channelMember: ChannelMemberResponse){
        onUpdated(channelMember)
    }
    return(

        <div className="w-full items-center flex  gap-3 ">
            <UserAvatar src={channelMember?.userProfilePictureUrl ?? ""} userNameFallback={channelMember?.userUsername} size={30} />
            <div className="w-[90%]">
                <p className="text-[13px] font-semibold">@{channelMember?.userUsername} {myChannelMember?.id === channelMember.id && <>(You)</>}</p>
                <p className="text-xs font-normal opacity-60">{channelMember?.userName}{channelMember.isOwner && <> (Owner)</>}{!channelMember.isOwner && channelMember.isAdmin && <> (Admin)</>}</p>

            </div>

            {channelMember.id === myChannelMember?.id ||  
                <UserCardDropdown onMemberKickedOut={onKickedOut} onMemberUpdated={handleChannelMemberUpdated} imAdmin={myChannelMember?.isAdmin} imOwner={myChannelMember?.isOwner} channelMember={channelMember}/>
            }
        </div>
    )
}

interface UserCardDropdownProps{

    imAdmin? : boolean,
    imOwner? : boolean,
    channelMember: ChannelMemberResponse 
    onMemberUpdated: (channelMember:ChannelMemberResponse) => void 
    onMemberKickedOut: (channelMemberId: string) => void;
}

const UserCardDropdown : React.FC<UserCardDropdownProps> = ({imAdmin = false,onMemberKickedOut, onMemberUpdated, imOwner = false, channelMember}) =>{

    const [showBanModal, setShowBanModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showKickOutModal, setShowKickOutModal] = useState(false);

    
    function handleMemberUpdated(channelMember : ChannelMemberResponse){
        onMemberUpdated(channelMember)
    }
   
    
    

   
    return(
        <>
        <KickOutUserModal open={showKickOutModal} onOpenChanged={setShowKickOutModal} onKickedOut={onMemberKickedOut} channelMember={channelMember}/>
            <UpdateUserModal onUpdated={handleMemberUpdated} shouldBeAdmin={!channelMember.isAdmin} channelMember={channelMember} open={showUpdateModal} onOpenChanged={setShowUpdateModal}/>
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
                
                <DropdownItem textValue={"visitProfile"} key="visit-profile" startContent={<UserIcon size={14}/>} isReadOnly={true}>
                    <p className="text-[13px] font-normal">Visit profile</p>
                </DropdownItem>
    
                {imOwner ? 
                
                    <>
    
    
                        <DropdownItem textValue={"divider"} key="divider" isReadOnly={true}>
                            <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                        </DropdownItem>
    
                        {!channelMember.isAdmin ? 
                             <DropdownItem textValue={"promote"} key="promote-member" onClick={() => {setShowUpdateModal(true)}} startContent={<ArrowUp size={14}/>} >
                                <p className="text-[13px] font-normal">Promote member</p>
                                <p className="text-xs opacity-80">Promote user as an administrator</p>
                            </DropdownItem> :
                            <DropdownItem textValue={"demote"} key="demote-member" onClick={() => {setShowUpdateModal(true)}} startContent={<ArrowDown size={14}/>}>
                                <p className="text-[13px] font-normal">Demote member</p>
                                <p className="text-xs opacity-80">Demote user as a default user</p>
                            </DropdownItem>
                        
                        }
                    </> :
                    null
                }
              
                
                <DropdownItem textValue={"divider2"} key="divider2" isReadOnly={true}>
                    <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                </DropdownItem>
               
    
    
               {((imOwner || (imAdmin && !channelMember.isAdmin)))
                ? (
                    <>
                    <DropdownItem onClick={() => setShowKickOutModal(true)} textValue={"kick"} color="danger" key="remove-user" startContent={<X size={14} />}>
                        <p className="text-[13px] font-normal">Kick user</p>
                    </DropdownItem>
                    <DropdownItem textValue={"ban"} onClick={()=>{setShowBanModal(true)}} color="danger" key="ban-user" startContent={<Ban size={14} />}>
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

interface UpdateUserModalProps{
    open: boolean
    onOpenChanged: (change:boolean) => void;
    channelMember: ChannelMemberResponse;
    shouldBeAdmin?: boolean | null;
    onUpdated: (chanelMember:ChannelMemberResponse) => void;
}
const UpdateUserModal : React.FC<UpdateUserModalProps> = ({open, onOpenChanged, channelMember, onUpdated, shouldBeAdmin = null}) =>{

    const {updatedChannelMember, updatingChannelMember, updateChannelMember} = useUpdateChannelMember();
    
    
    const fetchUpdate = async () =>{

        
        await updateChannelMember({channelMemberId: channelMember.id, shouldBeAdmin: shouldBeAdmin});
    }


   


    useEffect(()=>{

        if(!updatedChannelMember) return;
        onUpdated(updatedChannelMember);
        onOpenChanged(false);
    },[updatedChannelMember])

   
    return(

        <Modal style={{zIndex: "9999999"}} isOpen={open} onOpenChange={onOpenChanged}>
            <ModalContent style={{zIndex: "9999999"}} className="dark:bg-neutral-900/50 max-w-[350px] backdrop-blur-lg">
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{shouldBeAdmin ? "Promote" : "Demote"} user</ModalHeader>
                        <ModalBody>
                            <p className="text-[13px] font-normal">
                                You will update the role of <strong>@{channelMember.userUsername} </strong>to <strong>{shouldBeAdmin ? "promote" : "demote"}</strong> them. When {shouldBeAdmin ? "promoting you will be changing their role to admin" : "demoting you will change their role to a default one"}. Even though this can be undone, do you want to continue?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" size="sm" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button isDisabled={updatingChannelMember} onPress={fetchUpdate} className="bg-blue-700 text-white" size="sm" >
                                {updatingChannelMember ? <Spinner size="sm" variant="spinner"/> : <>{shouldBeAdmin ? "Yes, promote to admin" : "Yes, demote to default"}</>}
                            </Button>
                        </ModalFooter>

                    </>
                )}
            </ModalContent>
        </Modal>
    )
}


interface KickOutUserModalProps{
    open: boolean
    onOpenChanged?: (change:boolean) => void;
    channelMember: ChannelMemberResponse,
    onKickedOut: (channelMemberId: string) => void;
}

const KickOutUserModal : React.FC<KickOutUserModalProps> = ({open, channelMember, onKickedOut, onOpenChanged}) =>{

  const { deleteChannelMember, deletingChannelMember, channelMemberDeleted } = useDeleteChannelMember();
  const {setLayout} = useLayoutStore();



 
  const fetchDeleteChannel = async () => {
    await deleteChannelMember({ channelMemberId: channelMember.id });
  };

  useEffect(() => {
    if (channelMemberDeleted) {
      onKickedOut(channelMember.id);
    }
  }, [channelMemberDeleted]);
  return(

      <Modal style={{zIndex: "9999999"}} isOpen={open} onOpenChange={onOpenChanged}>
        <ModalContent style={{zIndex: "9999999"}} className="dark:bg-neutral-900/50 max-w-[350px] backdrop-blur-lg">
          {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Delete Channel</ModalHeader>
                <ModalBody>
                  <p className="text-[13px] font-normal">
                    Are you sure you wanna kick out <strong>@{channelMember.userUsername}</strong> from this channel?
                  </p>
                  
                </ModalBody>
                <ModalFooter>
                  <Button size="sm" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                      isLoading={deletingChannelMember}
                      isDisabled={ deletingChannelMember} className="bg-red-700 text-white" size="sm" onPress={fetchDeleteChannel}>
                    Yes, kick out this user
                  </Button>
                </ModalFooter>
              </>
          )}
        </ModalContent>
      </Modal>
  )
}

export default UserCard