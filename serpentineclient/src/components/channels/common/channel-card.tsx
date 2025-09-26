import { ChannelResponse } from "@/models/responses/channel-response";
import { ChannelBanner } from "./channel-banner";
import ChannelCover from "./channel-cover";
import { useActiveChannelsHubActions } from "@/client-hubs/active-channels-hub";
import { useEffect, useRef, useState } from "react";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useLayoutStore } from "@/contexts/layout-context";
import { showToast } from "@/helpers/sonner-helper";
import { useDeleteChannel } from "@/hooks/channel-hooks";
import { useCreateChannelMember, useDeleteChannelMember } from "@/hooks/channel-member-hooks";
import { RightPanelView } from "@/models/right-panel-view";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Spinner, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { InfoIcon, Edit3Icon, MessageCircleWarningIcon, CopyIcon, TrashIcon, ArrowLeft, PlusCircle, MoreVertical } from "lucide-react";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import IconButton from "@/components/common/icon-button";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { HubConnectionState } from "@microsoft/signalr";

export default function ChannelCard({channel, allowFecthActiveUsers, showOptions = false}:{channel: ChannelResponse, allowFecthActiveUsers: boolean, showOptions?:boolean}){

    const [isMounted, setIsMounted] = useState(false);
    const firstRender = useRef(true);
    const { activeUsersCount, getChannelActiveMembersCount } =
        useActiveChannelsHubActions();
        const {activeChannelsHubsState, activeChannelsHub} = useActiveChannelsHubStore();


    async function fetchGetActiveMembersCount(channelId: string){
        await getChannelActiveMembersCount(channelId);
    }

    useEffect(()=>{

      setIsMounted(true)

    },[])


    useEffect(()=>{

      if(!isMounted || !allowFecthActiveUsers || !channel || !activeChannelsHub || activeChannelsHubsState !== HubConnectionState.Connected) return;

      fetchGetActiveMembersCount(channel.id);
        
        

    },[allowFecthActiveUsers, isMounted, channel, activeChannelsHubsState, activeChannelsHub])

    return(

     

        <div className="flex flex-col   gap-2 relative  ">
           {showOptions &&  <OptionsDropdown channel={channel}/>}
            <ChannelBanner pictureUrl={channel?.bannerPicture} />

            <div className="absolute z-[0] backdrop-blur-sm dark:bg-neutral-900/80 bg-neutral-200/80  bottom-[4px]  w-full max-w-full flex items-center justify-between p-2 gap-3 ">
               
               <> 
                <p
                    className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                    style={{ fontSize: "12px" }}
                >
                    #{channel?.name}
                    {allowFecthActiveUsers ? 
                      <div className="flex items-center gap-2  ">
                          <div className="size-2 rounded-full bg-green-600"/>
                          <p className="text-green-700 text-xs "> {activeUsersCount} Active members</p>

                      </div> : 
                      <p className="opacity-50 whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-[10px] font-normal">
                      id.{channel?.id}
                      </p>

                  }
                </p>

                
               </>
              
               
                <ChannelCover
                    absolute={true}
                    pictureUrl={channel.coverPicture}
                    channelName={channel.name}
                />
            </div>
           
        </div>
     
    )
}

const OptionsDropdown: React.FC<{ channel: ChannelResponse }> = ({
  channel,
}) => {
  const { deletingChannel } = useDeleteChannel();
  const {
    setChannelInfoId,
    setChannelJoined,
    setUpdateChannelId: setUpdateChannelid,
  } = useGlobalDataStore();

  const { createChannelMember, joining, setChannelMember, channelMember } =
    useCreateChannelMember();
  const { setLayout } = useLayoutStore();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openLeaveChannelModal, setOpenLeaveChannelModal] = useState(false);

  function showUpdateChannelForm() {
    setUpdateChannelid(channel.id);
    setLayout({ currentRightPanelView: RightPanelView.UpdateChannelFormView });
  }
  const join = async () => {
    await createChannelMember({ channelId: channel.id });
  };

  useEffect(() => {
    if (channelMember) {
      channel.myMember = channelMember;
      setChannelJoined(channel);
      showToast({
        title: `Channel joined`,
        description: `You've joined "${channel.name}'s" channel`,
      });
      setChannelMember(null);
      setLayout({ currentRightPanelView: RightPanelView.DefaultView });
      setChannelInfoId(null);
    }
  }, [channelMember]);

  async function copyIdToClipboard() {
    await navigator.clipboard.writeText(channel.id);
    showToast({ description: "Channel Id copied to clipboard!" });
  }

  return (
    <>

      {channel.myMember && (
        <LeaveChannelModal
          channelMember={channel.myMember}
          open={openLeaveChannelModal}
          onOpenChanged={setOpenLeaveChannelModal}
        />
      )}
      <DeleteChannelModal
        channel={channel}
        open={openDeleteModal}
        onOpenChanged={setOpenDeleteModal}
      />
      <Dropdown
        placement="bottom-end"
        showArrow={true}
        className="bg-neutral-100/50 backdrop-blur-3xl dark:bg-neutral-950/50  "
      >
        <DropdownTrigger>
          <button className="absolute top-[4px] right-[4px]">
            <IconButton tooltipText="Manage">
                <MoreVertical size={16}/>
            </IconButton>
          </button>
        </DropdownTrigger>
        <DropdownMenu
          disabledKeys={["divider", "divider2", "channelInf"]}
          aria-label="Channel Actions"
          variant="flat"
        >
          <DropdownSection showDivider={true} title={"About this channel"}>
            <DropdownItem
              textValue="info"
              key="channelInf"
              startContent={<InfoIcon size={16} />}
              className="h-14 gap-2"
            >
              <p className="font-semibold text-xs">#{channel.name}</p>
              <p className="font-normal text-xs opacity-60">{channel.id}</p>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider={true} title={"Actions"}>
            <>
              {(channel.myMember?.isAdmin || channel.myMember?.isOwner) && (
                <>
                  <DropdownItem
                    textValue="edit"
                    onClick={showUpdateChannelForm}
                    key="edit"
                    endContent={<Edit3Icon size={16} />}
                  >
                    <p className="font-normal text-[13px]">Edit this channel</p>
                  </DropdownItem>
                </>
              )}
            </>

            <DropdownItem
              key="report"
              textValue="report"
              endContent={<MessageCircleWarningIcon size={16} />}
            >
              <p className="font-normal text-[13px]">Report an issue</p>
            </DropdownItem>
            <DropdownItem
              textValue="copyId"
              key="copy_id"
              onClick={async () => {
                await copyIdToClipboard();
              }}
              endContent={<CopyIcon size={16} />}
            >
              <p className="font-normal text-[13px]">Copy Id</p>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection title={"Danger zone"}>
            {channel.myMember ? (
              <>
                {channel.myMember?.isOwner ? (
                  <DropdownItem
                    textValue="delete"
                    color="danger"
                    key="delete"
                    onClick={() => setOpenDeleteModal(true)}
                    endContent={
                      deletingChannel ? (
                        <Spinner variant="spinner" size="sm" />
                      ) : (
                        <TrashIcon size={16} />
                      )
                    }
                  >
                    <p className="font-normal text-[13px]">
                      Delete this channel
                    </p>
                  </DropdownItem>
                ) : (
                  <DropdownItem
                    textValue="leave"
                    onClick={() => setOpenLeaveChannelModal(true)}
                    color="danger"
                    key="leave"
                    endContent={<ArrowLeft size={16} />}
                  >
                    <p className="font-normal text-[13px]">
                      Leave this channel
                    </p>
                  </DropdownItem>
                )}
              </>
            ) : (
              <DropdownItem
                textValue="join"
                key="join"
                onClick={() => {
                  join();
                }}
                endContent={
                  joining ? (
                    <Spinner size="sm" variant="spinner" />
                  ) : (
                    <PlusCircle size={16} />
                  )
                }
              >
                <p className="font-normal text-[13px]">Join this channel</p>
              </DropdownItem>
            )}
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};



const DeleteChannelModal = ({
  open,
  channel,
  onOpenChanged,
}:{
open: boolean;
  onOpenChanged?: (change: boolean) => void;
  channel: ChannelResponse;
}) => {
  const { deleteChannel, channelDeleted, deletingChannel } = useDeleteChannel();
  const { setChannelInfoId, setDeletedChannelId } = useGlobalDataStore();
  const [channelNameConfirmation, setChannelNameConfirmation] =
    useState<string>("");
  const { setLayout } = useLayoutStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChannelNameConfirmation(value);
  };

  const fetchDeleteChannel = async () => {
    await deleteChannel({ channelId: channel.id });
  };

  useEffect(() => {
    if (channelDeleted) {
      setChannelInfoId(null);
      setDeletedChannelId(channel.id);
      setLayout({ currentRightPanelView: RightPanelView.DefaultView });
    }
  }, [channelDeleted]);
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
              Delete Channel
            </ModalHeader>
            <ModalBody>
              <p className="text-[13px] font-normal">
                Deleting the channel <strong>#{channel.name}</strong> ALL groups
                and messages will be deleted PERMANENTLY, do you wanna procceed?
              </p>
              <Input
                label="Channel name"
                type="text"
                placeholder="Write the name of the channel to delete"
                minLength={3}
                maxLength={100}
                value={channelNameConfirmation}
                labelPlacement="outside"
                isRequired={true}
                onChange={handleInputChange}
                errorMessage={"Input the channel name to confirm"}
                isInvalid={channel.name !== channelNameConfirmation}
              />
            </ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deletingChannel}
                isDisabled={
                  channel.name !== channelNameConfirmation || deletingChannel
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


const LeaveChannelModal = ({
  open,
  channelMember,
  onOpenChanged,
}:{
    open: boolean;
  onOpenChanged?: (change: boolean) => void;
  channelMember: ChannelMemberResponse;
}) => {
  const { deleteChannelMember, deletingChannelMember, channelMemberDeleted } =
    useDeleteChannelMember();
  const { setChannelInfoId, setDeletedChannelId } = useGlobalDataStore();
  const [channelNameConfirmation, setChannelNameConfirmation] =
    useState<string>("");
  const { setLayout } = useLayoutStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChannelNameConfirmation(value);
  };

  const fetchLeaveChannel = async () => {
    await deleteChannelMember({ channelMemberId: channelMember.id });
  };

  useEffect(() => {
    if (channelMemberDeleted) {
      setChannelInfoId(null);
      setDeletedChannelId(channelMember.channelId);
      setLayout({ currentRightPanelView: RightPanelView.DefaultView });
    }
  }, [channelMemberDeleted]);
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
              Delete Channel
            </ModalHeader>
            <ModalBody>
              <p className="text-[13px] font-normal">
                Are you sure that you wanna leave the this channel?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={deletingChannelMember}
                isDisabled={deletingChannelMember}
                className="bg-red-700 text-white"
                size="sm"
                onPress={fetchLeaveChannel}
              >
                Yes, leave this channel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
