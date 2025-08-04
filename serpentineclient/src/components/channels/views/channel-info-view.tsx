import { useGlobalDataStore } from "@/contexts/global-data-context";
import { useDeleteChannel, useGetChannelById } from "@/hooks/channel-hooks";
import { useEffect, useState, useRef, useCallback, EventHandler } from "react";
import { Spinner } from "@heroui/spinner";
import { ChannelBanner } from "../common/channel-banner";
import { ChannelCover } from "../common/channel-cover";
import InfiniteScroll from "react-infinite-scroll-component"
import {
  Activity,
  ArrowLeft,
  CakeIcon,
  CopyIcon,
  Edit3Icon,
  InfoIcon,
  MessageCircleWarningIcon,
  MoreVertical,
  PlusCircle,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { HubResult } from "@/models/hub-result";

import IconButton from "@/components/common/icon-button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useLayoutStore } from "@/contexts/layout-context";
import { RightPanelView } from "@/models/right-panel-view";
import { showToast } from "@/helpers/sonner-helper";
import { useCreateChannelMember, useGetChannelMembersByChannelId } from "@/hooks/channel-member-hooks";
import { useUiSound } from "@/helpers/sound-helper";
import UserCard from "@/components/users/common/user-hor-card";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";

export default function ChannelInfoView() {
  const { channelInfoId, setChannelInfoId } = useGlobalDataStore();
  const { getChannelById, channel, loadingChannel } = useGetChannelById();
  const { activeChannelsHub } = useActiveChannelsHubStore();
  const [activeUsers, setActiveUsers] = useState(0);
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  const getChannelActiveMembersCount = async (channelId: string) => {
    if (!activeChannelsHub) return;

    try {
      const result: HubResult<number> = await activeChannelsHub.invoke(
        "GetActiveUsersOnAChannelById",
        channelId
      );
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
    if (!channelInfoId) return;
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


    return()=>{

      setChannelInfoId(null);
    }
  }, [channelInfoId]);

  if (loadingChannel)
    return (
      <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
        <Spinner className="" size="sm" variant="spinner" />
        <p className="text-xs ">Loading Channel</p>
      </div>
    );

  if (!channel)
    return (
      <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
        <p className="text-xs ">Channel not found. Try again later.</p>
      </div>
    );

  if (channel) {
    return (
      <>
        <div className="flex flex-col gap-4 w-full max-sm:w-[80%] max-md:mt-8 max-md:pb-4">
          <div className="">
            <h2 className="text-md font-semibold max-md:text-center">
              Manage your channel
            </h2>
            <p className="text-xs opacity-45 max-md:text-center">
              Manage channels you own or you administer
            </p>
          </div>

          <div className="flex flex-col w-full gap-2 relative mt-2 ">
            <ChannelBanner pictureUrl={channel?.bannerPicture} />
            <ChannelCover
              absolute={true}
              isSmall={false}
              pictureUrl={channel.coverPicture}
              channelName={channel.name}
            />
          </div>

          <div className="flex w-full gap-2 items-start justify-between">
            <div className="flex flex-col max-w-[70%]">
              <p
                className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                style={{ fontSize: "18px" }}
              >
                #{channel?.name}
              </p>
              <p className="opacity-50 whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-[10px] font-normal">
                id.{channel?.id}
              </p>
            </div>

            
            <OptionsDropdown channel={channel}></OptionsDropdown>
            
          </div>
          <div className="w-full" id={"channel-description-container"}>
            <p
             
              className={`w-full font-normal opacity-80 text-[13px] whitespace-pre-line  text-ellipsis overflow-hidden ${showMoreDescription ? "" : "line-clamp-3"}`}
            >
              {channel.description}
            </p>
          </div>

          {channel.description.length >= 100 && (
            <a
              className="text-blue-500 text-xs cursor-pointer"
              onClick={() => setShowMoreDescription(!showMoreDescription)}
            >
              {showMoreDescription ? "Show less..." : "Show more..."}
            </a>
          )}
          <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          <div className="flex flex-col gap-4">
            <p className="opacity-80 mt-1 text-xs font-normal flex gap-2 items-center">
              <CakeIcon className="size-[18px]" />{" "}
              {(() => {
                const date = new Date(channel.createdAt);
                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} (${getRelativeDate(date)})`;
              })()}
            </p>
            <div className="flex items-center gap-2">
              <UserIcon size={18} />
              <p className="opacity-90 mt-1 text-xs font-normal">
                {channel.membersCount} Member(s) {" "}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={18} />
              <div className="size-1 bg-blue-600 rounded-full" />
              <p
                style={{ fontSize: "12px" }}
                className="opacity-90 font-normal"
              >
                {activeUsers} Active user(s)
              </p>
            </div>
          </div>
          <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          <UsersContainer myMember={channel.myMember} channelId={channel.id}/>
        </div>
      </>
    );
  }
}

const OptionsDropdown: React.FC<{ channel: ChannelResponse }> = ({
  channel,
}) => {
  const { deleteChannel, deletingChannel, channelDeleted } = useDeleteChannel();
  const { setChannelInfoId, setDeletedChannelId, setChannelJoined, setUpdateChannelid } = useGlobalDataStore();
  const {createChannelMember, joining,  setChannelMember, channelMember} = useCreateChannelMember();
  const {setLayout} = useLayoutStore();
  const {playUiSound} = useUiSound();
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
      <DeleteChannelModal channel={channel}  open={openDeleteModal} onOpenChanged={setOpenDeleteModal}/>
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
        aria-label="Channel Actions"
        variant="flat"
      >
        <DropdownItem
          key="channelInf"
          startContent={<InfoIcon size={16} />}
          className="h-14 gap-2"
        >
          <p className="font-semibold text-xs">#{channel.name}</p>
          <p className="font-normal text-xs opacity-60">{channel.id}</p>
        </DropdownItem>
        <DropdownItem key="divider" isReadOnly={true}>
          <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </DropdownItem>
        <>
          {(channel.myMember?.isAdmin ||
            channel.myMember?.isOwner) && (
            <>
              <DropdownItem onClick={showUpdateChannelForm} key="edit" endContent={<Edit3Icon size={16} />}>
                <p className="font-normal text-[13px]">Edit this channel</p>
              </DropdownItem>
            </>
          )}
        </>
       
        <DropdownItem
          key="report"
          endContent={<MessageCircleWarningIcon size={16} />}
        >
          <p className="font-normal text-[13px]">Report an issue</p>
        </DropdownItem>
        <DropdownItem key="copy_id" onClick={async ()=>{await copyIdToClipboard()}} endContent={<CopyIcon size={16} />}>
                <p className="font-normal text-[13px]">Copy Id</p>
        </DropdownItem>
        <>
          <DropdownItem key="divider2" isReadOnly={true}>
            <hr className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </DropdownItem>
          {channel.myMember  ?
          
            <>

              {channel.myMember?.isOwner ?
                <DropdownItem
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
                  <p className="font-normal text-[13px]">Delete this channel</p>
                </DropdownItem> 
                :
                <DropdownItem
                  color="danger"
                  key="leave"
                  endContent={
                   <ArrowLeft size={16}/>
                  }
                >
                  <p className="font-normal text-[13px]">Leave this channel</p>
                </DropdownItem> 

                
              } 


            </> :
            <DropdownItem
                  key="join"
                  onClick={()=>{join();}}
                  endContent={
                    joining ? <Spinner size="sm" variant="spinner"/> :
                   <PlusCircle size={16}/>
                  }
                >
                  <p className="font-normal text-[13px]">Join this channel</p>
                </DropdownItem> 
           
          

           
           
           
           
          }
        </>
      </DropdownMenu>
    </Dropdown>
    </>
  
  );
};


interface UserContainerProps{

  myMember: ChannelMemberResponse | null,
  channelId: string
}

const UsersContainer : React.FC<UserContainerProps> = ({myMember, channelId}) =>{

  const {getChannelMembersByChannelId,hasMore, channelMembers, loadingChannelMembers} = useGetChannelMembersByChannelId();
  const firstRender = useRef(false);

   const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
 const fetchChannelMembers = async () =>{

   
    await getChannelMembersByChannelId({channelId: channelId, skip:  channelMembers.length, take: 5})

  }
  const observeLastElement = useCallback((node: HTMLDivElement | null) => {
    if (loadingChannelMembers) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchChannelMembers();
      }
    });

    if (node) observerRef.current.observe(node);
    lastElementRef.current = node;
  }, [loadingChannelMembers, hasMore, fetchChannelMembers]);
 

  useEffect(()=>{

    if(firstRender.current) return;


    firstRender.current = true;
    fetchChannelMembers();

  },[channelId])

  
 
  return(
 

          <div className="flex flex-col gap-3">
              <p className="text-xs ">Members of this channel</p>

              {
                channelMembers.map((cm, idx)=>

                  {
                    const isLast = idx === channelMembers.length - 1;

                    return(

                      <div  ref={isLast ? observeLastElement : null} className="w-full flex flex-col gap-2" key={cm.id}>
                        <UserCard myChannelMember={myMember}  channelMember={cm} />

                        <hr  className="ml-auto w-[80%] dark:border-neutral-950 border-neutral-100 border-t "/>
                        
                      </div>
                    )
                  }


                  

                  
                )
              }

              {loadingChannelMembers && <Spinner size="sm" variant="spinner"/>}
            </div>
   
   
  )
}

interface DeleteChannelModalProps{
    open: boolean
    onOpenChanged?: (change:boolean) => void;
    channel: ChannelResponse
}

const DeleteChannelModal : React.FC<DeleteChannelModalProps> = ({open, channel, onOpenChanged, channelName}) =>{

    const { deleteChannel, deletingChannel, channelDeleted } = useDeleteChannel();
    const { setChannelInfoId, setDeletedChannelId, setChannelJoined } = useGlobalDataStore();
    const [channelNameConfirmation, setChannelNameConfirmation] = useState<string>("");
     const {setLayout} = useLayoutStore();



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
    return(

        <Modal style={{zIndex: "9999999"}} isOpen={open} onOpenChange={onOpenChanged}>
        <ModalContent style={{zIndex: "9999999"}} className="dark:bg-neutral-900/50 max-w-[350px] backdrop-blur-lg">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Channel</ModalHeader>
              <ModalBody>
                <p className="text-[13px] font-normal">
                 Deleting the channel <strong>@{channel.name}</strong> ALL groups and messages will be deleted PERMANENTLY, do you wanna procceed?
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
                <Button isDisabled={channel.name !== channelNameConfirmation} className="bg-red-700 text-white" size="sm" onPress={fetchDeleteChannel}>
                  Yes, delete this channel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
}