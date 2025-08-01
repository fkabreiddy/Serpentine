import React, { useState, useEffect, useRef } from "react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useLayoutStore } from "@/contexts/layout-context";
import ChannelsContainer from "@/components/channels/common/channels-container";
import SearchBar from "@/components/search-channel-bar";
import { ChannelResponse } from "@/models/responses/channel-response";
import { useAuthStore } from "@/contexts/authentication-context";
import { useGetChannelsByUserId } from "@/hooks/channel-hooks";
import { Spinner } from "@heroui/spinner";

import StatusBar from "./status-bar";
import GroupsContainer from "@/components/groups/common/groups-container";

import { useGlobalDataStore } from "@/contexts/global-data-context.ts";
interface LeftSideBarProps {}

const LeftSideBar: React.FC<LeftSideBarProps> = () => {
  const [filter, setFilter] = useState("");
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] =
    useState<ChannelResponse | null>(null);
  const {
    getChannelsByUserId,
    setChannels,
    channels,
    loadingChannels,
    isBusy,
    hasMore,
  } = useGetChannelsByUserId();
  const { user } = useAuthStore();
  const { layout } = useLayoutStore();
  const {
    createdChannel,
    setCreatedChannel,
    deletedChannelId,
    setDeletedChannelId,
    channelJoined,
    setChannelJoined
  } = useGlobalDataStore();
  const statusBarRef = React.useRef<HTMLDivElement | null>(null);
  const [statusBarHeight, setStatusBarHeight] = useState<number>(0);
  const alreadyMounted = useRef<boolean>(false);

  useEffect(()=>{

    if(channelJoined)
    {
      setChannels((prev)=>([...prev, channelJoined]))
      setChannelJoined(null);
    }
  },[channelJoined])
  useEffect(() => {
    if (deletedChannelId) {
      setChannels(
        channels.filter((channel) => channel.id !== deletedChannelId)
      );

      setDeletedChannelId(null);
    }
  }, [deletedChannelId]);

  useEffect(() => {
    if (statusBarRef.current) {
      setStatusBarHeight(statusBarRef.current.offsetHeight);
    }

    alreadyMounted.current = true;
  }, [isMounted]);

  useEffect(() => {
    if (createdChannel) {
      console.log(createdChannel);
      setChannels((prev) => [...prev, createdChannel]);
    }
  }, [createdChannel]);

  useEffect(() => {
    if (channels.length > 0) {
      setSelectedChannel(channels[0]);
    } else {
      setSelectedChannel(null);
    }
  }, [channels]);

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (user && !loadingChannels && !isBusy && !hasFetched.current) {
      hasFetched.current = true;
      fetchChannels();
    }
  }, [user]);

  const fetchChannels = async () => {
    await getChannelsByUserId({ take: 5, skip: channels.length });
  };

  const handleGroupsUnreadMessagesCount = (unreadMessages: number) => {
    if (!selectedChannel) return;

    const channel = channels.find((ch) => ch.id === selectedChannel.id);

    if (!channel) return;

    channel.unreadMessages = unreadMessages;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  return (
    <>
      <div className={`relative z-[999999]  h-screen bg-white dark:bg-black`}>
        <ScrollShadow
          hideScrollBar
          offset={0}
          id="side-bar"
          className={`${
            layout.sideBarExpanded
              ? "!max-w-[300px] !min-w-[300px]"
              : "!max-w-[50px] !min-w-[50px]"
          } h-full  py-4 max-md:z-[99999] max-md:h-full bg-white dark:bg-black animate-all flex flex-col border-r max-md:absolute border-default-100 px-2 overflow-auto gap-4 scroll-smooth scrollbar-hide`}
          style={{ paddingBottom: statusBarHeight }}
        >
          <div className="flex flex-col w-full items-center gap-3">
            <ChannelsContainer
              isLoading={loadingChannels}
              channels={channels}
              onChannelSelected={setSelectedChannel}
              filter={filter}
            />
          </div>

          {layout.sideBarExpanded && (
            <SearchBar
              placeholder={"Search on your things..."}
              width="100%"
              onSearch={setFilter}
            />
          )}
          {selectedChannel && (
            <GroupsContainer
              filter={filter}
              channel={selectedChannel}
              callbackUnreadMessagesCount={handleGroupsUnreadMessagesCount}
            />
          )}
          {!selectedChannel && layout.sideBarExpanded && !loadingChannels && (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-xs text-center">
                Seems you dont have any channel yet
              </p>
            </div>
          )}
          {!selectedChannel && layout.sideBarExpanded && loadingChannels && (
            <Spinner
              className="absolute top-1/2 left-1/2"
              size="sm"
              variant="spinner"
            />
          )}
        </ScrollShadow>

        {!hasMore && !loadingChannels && !isBusy && (
          <StatusBar channels={channels} />
        )}
      </div>
    </>
  );
};

export default LeftSideBar;
