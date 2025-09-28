import { useActiveChannelsHubActions } from "@/client-hubs/active-channels-hub";
import IconButton from "@/components/common/icon-button";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { useRightPanelViewData } from "@/contexts/right-panel-view-data";
import { useDeleteGroup } from "@/hooks/group-hooks";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { GroupResponse } from "@/models/responses/group-response";
import { RightPanelView } from "@/models/right-panel-view";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Tooltip } from "@heroui/react";
import { HubConnectionState } from "@microsoft/signalr";
import { ArrowLeftIcon, Edit3Icon, InfoIcon, LockIcon, MoreVertical, TrashIcon } from "lucide-react";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CurrentGroupChatroomInfo({
  group,
  channelMembership
}: {  
  group: GroupResponse;
  channelMembership: ChannelMemberResponse
}) {

  

  
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="  w-full p-4  bg-neutral-100 dark:bg-neutral-950 z-[33] justify-between   absolute left-0 top-0 flex flex-col "
      >
        <div className="flex w-full justify-between items-center gap-3">
          <div className="w-[full] flex gap-4 items-center  ">
              <IconButton tooltipText="Close" onClick={() => navigate("/home")}>
                <ArrowLeftIcon className="size-[16px]" />
              </IconButton>
                <p className="text-[13px] max-md:max-w-[20%] whitespace-nowrap overflow-hidden text-ellipsis">
                  #{group.channelName}
                </p>
                <strong className="text-[13px] max-w-[70%] whitespace-nowrap overflow-hidden text-ellipsis">
                  / {group.name}
                </strong>
                {!group.public && (
                  <Tooltip
                    placement="bottom"
                    content={"This group is just for admins and the owner"}
                    showArrow={true}
                    size="sm"
                  >
                    <LockIcon className="cursor-pointer" size={16} />
                  </Tooltip>
                )}
              
          </div>

           <OptionsDropdown group={group} membership={channelMembership}/>
        </div>
      
      </motion.div>
    </>
  );
}


const OptionsDropdown: React.FC<{ group: GroupResponse, membership: ChannelMemberResponse }> = ({
  group,
  membership
}) => {

  const {layout, setLayout} = useLayoutStore();
  const {setRightPanelViewData, rightPanelData} = useRightPanelViewData();
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState<boolean>(false);

 

  useEffect(()=>{

    if(rightPanelData.groupIdToUpdate)
    {
      setLayout({currentRightPanelView: RightPanelView.UpdateGroupFormView})
    }

  },[rightPanelData.groupIdToUpdate])


  
  return (
    <>

      
      <DeleteGroupModal onOpenChanged={setDeleteGroupModalOpen} open={deleteGroupModalOpen} group={group}/>

      <Dropdown  placement="bottom-end" showArrow={true} className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  ">
      <DropdownTrigger>
        <button>
          <IconButton tooltipText="Manage">
            <MoreVertical size={16} />
          </IconButton>
        </button>
      </DropdownTrigger>
      <DropdownMenu
        disabledKeys={["divider", "divider2", "channelInf"]}
        aria-label="Group Actions"
        variant="flat"
      >
        <DropdownSection showDivider={true} title={"About this group"}>
          <DropdownItem
          textValue="info"
              key="groupInf"
              startContent={<InfoIcon size={16} />}
              className="h-14 gap-2"
          >
            <p className="font-semibold text-xs">#{group.name}</p>
            <p className="font-normal text-xs opacity-60">{group.id}</p>
          </DropdownItem>
        </DropdownSection>
       
       
         <>
           {(membership.isAdmin ||
               membership.isOwner) && (
               <DropdownSection showDivider={true} title={"Actions"}>
                 <DropdownItem textValue="edit" onClick={()=>{setRightPanelViewData({groupIdToUpdate: group.id});}} key="edit" endContent={<Edit3Icon size={16} />}>
                   <p className="font-normal text-[13px]">Edit this Group</p>
                 </DropdownItem>
               </DropdownSection>
           )}
         </>

        
        

        
        <>
       
          {membership  &&
          
            <DropdownSection title={"Danger zone"}>
              <>
                 {membership.isOwner ?
                  <DropdownItem
                    color="danger"
                    key="delete"
                    onClick={()=>{setDeleteGroupModalOpen(true);}}
                    isReadOnly={deleteGroupModalOpen}
                    endContent={
                      deleteGroupModalOpen ? (
                        <Spinner variant="spinner" size="sm" />
                      ) : (
                        <TrashIcon size={16} />
                      )
                    }
                  >
                    <p className="font-normal text-[13px]">Delete this group</p>
                  </DropdownItem> : <> </>
                  



                } 
              </>
           


            </DropdownSection> 
           
          

           
           
           
           
          }
        </>
      </DropdownMenu>
    </Dropdown>
    </>
  
  );
};


const DeleteGroupModal = ({
  open,
  group,
  onOpenChanged,
}:{open: boolean, group: GroupResponse, onOpenChanged: (value: boolean) => void}) => {
  const {deleteGroup,  groupDeleted, deletingGroup } = useDeleteGroup();
  const [groupNameConfirmation, setGroupNameConfirmation] =
    useState<string>("");
  const { setLayout } = useLayoutStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupNameConfirmation(value);
  };

  const fetchDeleteChannel = async () => {
    await deleteGroup({ groupId: group.id });
  };

  useEffect(() => {
    if (groupDeleted) {
      
      setLayout({ currentRightPanelView: RightPanelView.DefaultView });
      onOpenChanged(false);
    }
  }, [groupDeleted]);
  return (
    <Modal
      style={{ zIndex: "9999999" }}
      isOpen={open}
      onOpenChange={onOpenChanged}
    >
      <ModalContent
        style={{ zIndex: "9999999" }}
        className="dark:bg-neutral-900/50 max-w-[350px] backdrop-blur-lg"
      >
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Group
            </ModalHeader>
            <ModalBody>
              <p className="text-[13px] font-normal">
                Deleting the group <strong>{group.name}</strong> ALL messages will be deleted PERMANENTLY, do you wanna procceed?
              </p>
              <Input
                label="Group name"
                type="text"
                placeholder="Write the name of the group to delete"
                minLength={3}
                maxLength={100}
                value={groupNameConfirmation}
                labelPlacement="outside"
                isRequired={true}
                onChange={handleInputChange}
                errorMessage={"Input the group name to confirm"}
                isInvalid={group.name !== groupNameConfirmation}
              />
            </ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deletingGroup}
                isDisabled={
                  group.name !== groupNameConfirmation || deletingGroup
                }
                className="bg-red-700 text-white"
                size="sm"
                onPress={fetchDeleteChannel}
              >
                Yes, delete this channel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
