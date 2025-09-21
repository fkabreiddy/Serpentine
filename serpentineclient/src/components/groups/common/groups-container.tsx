import IconButton from "@/components/common/icon-button";
import { useLayoutStore } from "@/contexts/layout-context";
import { ChannelResponse } from "@/models/responses/channel-response";
import { Info, KeyIcon, PlusIcon, Settings } from "lucide-react";
import GroupCard from "./group-card";
import { ChannelBanner } from "@/components/channels/common/channel-banner";
import  ChannelCover  from "@/components/channels/common/channel-cover";
import { useEffect, useRef, useTransition } from "react";
import { useGetGroupsByChannelId } from "@/hooks/group-hooks.ts";
import { Spinner } from "@heroui/spinner";
import { RightPanelView } from "@/models/right-panel-view.ts";
import { useGlobalDataStore } from "@/contexts/global-data-context.ts";
import { includes } from "zod";
import { Tooltip } from "@heroui/tooltip";

interface GroupsContainerProps {
  channel: ChannelResponse | null;
  filter?: string;
  callbackUnreadMessagesCount: (notifications: number) => void;
}

export default function GroupsContainer({
  channel,
  filter = "",
  callbackUnreadMessagesCount,
}: GroupsContainerProps) {
  const { getGroupsByChannelId, groups, setGroups, loadingGroups } =
    useGetGroupsByChannelId();
  const prevChannelId = useRef("");
  const {
    setCreateGroupChannelData,
    
    createGroupChannelData: createChannelGroupData,
    setChannelInfoId,
    createdGroup,
    setCreatedGroup,
    newUnreadMessage,
    setNewUnreadMessage,
    resetGroupUnreadMessages,
    setResetGroupUnreadMessages,
    deletedMessageId,
    setDeletedMessageId,
    newMessageRecievedOnCurrentGroup,
    setNewMessageRecievedOnCurrentGroup,
    deletedGroupId,
    setDeletedGroupId,
    updatedGroup,
    setUpdatedGroup,

  } = useGlobalDataStore();
  const { layout, setLayout } = useLayoutStore();

  const fetchGroups = async () => {
    if (!channel) return;
    await getGroupsByChannelId({
      channelId: channel.id,
      skip: groups.length,
      take: 5,
    });
  };


  useEffect(()=>{

    if(deletedGroupId)
    {
      setGroups((prev)=>(prev.filter(g => g.id != deletedGroupId)));
      setDeletedGroupId(null);
    }

  },[deletedGroupId])

  useEffect(()=>{

    if(updatedGroup && channel && channel.id === updatedGroup.channelId)
    {
      setGroups( (prev) => (prev.map(g => g.id === updatedGroup.id ? updatedGroup : g)))
    }

    if(updatedGroup)
    {
      setUpdatedGroup(null);
    }

  },[updatedGroup, channel])
  useEffect(()=>{

    if(!newMessageRecievedOnCurrentGroup) return;

    setGroups(prev => 
      prev.map(group =>
        group.id === newMessageRecievedOnCurrentGroup.groupId
          ? { ...group, lastMessage: newMessageRecievedOnCurrentGroup }
          : group
      )
    );

  },[newMessageRecievedOnCurrentGroup])

  useEffect(() => {
    if (!deletedMessageId) return;

    setGroups((prev) =>
      prev.map((g) =>
        g.id === deletedMessageId ? { ...g, lastMessage: null } : g
      )
    );
    setDeletedMessageId(null);
  }, [deletedMessageId]);

  useEffect(()=>{
  
    if(!resetGroupUnreadMessages) return;

    setGroups(prev => 
      prev.map(g => 
        g.id === resetGroupUnreadMessages 
          ? { ...g, unreadMessages: 0 }  // creamos un nuevo objeto con unreadMessages = 0
          : g                           // mantenemos el objeto igual si no coincide
      )
    );

    setResetGroupUnreadMessages(null);
  },[resetGroupUnreadMessages])

  useEffect(()=>{

    if(!newUnreadMessage) return;

    setGroups(prev => 
    prev.map(group =>
       group.id === newUnreadMessage.groupId
      ? { ...group, lastMessage: newUnreadMessage, unreadMessages: group.unreadMessages + 1 } // Actualiza solo ese grupo
      : group
    ));

    setNewUnreadMessage(null);

  },[newUnreadMessage])

  useEffect(() => {
    if (createChannelGroupData) {
      setLayout({ currentRightPanelView: RightPanelView.CreateGroupFormView });
    }
  }, [createChannelGroupData]);

  const setCreateGroupData = (channel: ChannelResponse) => {
    setCreateGroupChannelData({
      channelId: channel.id,
      channelName: channel.name,
    });
  };
  useEffect(() => {
    if (createdGroup && createdGroup.channelId === channel?.id) {
      setGroups((prev) => [...prev, createdGroup]);
      setCreatedGroup(null);
    }
  }, [createdGroup]);

  useEffect(() => {
    if (groups) {

      let counter = 0;
      groups.map((group, _) => {
        counter += group.unreadMessages;
      });

      callbackUnreadMessagesCount(counter);
    }
  }, [groups.length]);

  useEffect(() => {
    if (channel === null) return;

    if (channel.id !== prevChannelId.current) {
      prevChannelId.current = channel.id;

      fetchGroups();
    }
  }, [channel?.id]);

  return (
    <>
      {channel && layout.sideBarExpanded && (
        <div
          className={`flex flex-col  items-center   `}
        >
          <div className="flex flex-col w-full gap-2 relative mt-2 mb-4">
            <ChannelBanner pictureUrl={channel?.bannerPicture} />
            <ChannelCover
              absolute={true}
              isSmall={false}
              pictureUrl={channel.coverPicture}
              channelName={channel.name}
            />
          </div>

          <div className="flex items-center gap-3  w-full justify-between">
            <div className="flex items-center gap-3">
              {(channel.myMember?.isOwner || channel.myMember?.isAdmin) && (
                <IconButton
                  onClick={() => setCreateGroupData(channel)}
                  placement="right"
                  tooltipText="Add a group"
                >
                  <PlusIcon className="size-[18px]" />
                </IconButton>
              )}
              <IconButton
                placement="right"
                onClick={() => {
                  setChannelInfoId(channel?.id);
                  setLayout({
                    currentRightPanelView: RightPanelView.ChannelInfo,
                  });
                }}
                tooltipText="About"
              >
                <Info className="size-[18px]" />
              </IconButton>
            </div>

            <div className="flex items-center gap-3">
              {channel?.myMember?.isOwner &&
                
                  <Tooltip
                    placement="bottom"
                    showArrow={true}
                    size="sm"
                    content="Admin"
                  >
                    <KeyIcon className="size-[15px] opacity-80 cursor-pointer" />
                  </Tooltip>
                }
              <h2 className="text-[13px] font-normal justify-self-end">
                {channel ? `#${channel.name}` : "Channel"}
              </h2>
            </div>
          </div>

          <div
            className="relative mb-[100px] w-full ml-[10px] pt-[25px]"
            style={{ width: `calc(100% - 18px)` }}
          >
            {groups.filter((g) =>
              g.name.toLowerCase().includes(filter.toLowerCase())
            ).length >= 1 && (
              <div
                style={{ height: "calc(100% - 15px)" }}
                className="absolute left-0 top-0 w-px border-l-2 dark:border-neutral-800 border-neutral-200 rounded-full"
              />
            )}
            {groups
              .filter((g) =>
                g.name.toLowerCase().includes(filter.toLowerCase())
              )
              .map((group, idx) => (
                <GroupCard
                  channelMember={channel.myMember}
                  index={idx}
                  group={group}
                  key={idx.toString() + channel?.name}
                />
              ))}
          </div>
          {loadingGroups && (
            <Spinner
              size={"sm"}
              color="default"
              variant={"dots"}
              className={" "}
            />
          )}
          {!loadingGroups && groups.length <= 0 && (
            <span className={"text-xs opacity-50"}>
              No groups found on this channel (T_T)
            </span>
          )}
        </div>
      )}
    </>
  );
}
