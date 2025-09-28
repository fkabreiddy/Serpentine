import React, { useState, useEffect, useRef } from "react";
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
import {BoxIcon} from "lucide-react";
import { motion } from "motion/react";
interface LeftSideBarProps {}

const LeftSideBar: React.FC<LeftSideBarProps> = () => {
  const [filter, setFilter] = useState("");
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] =
    useState<ChannelResponse | null>(null);
  const {
    getChannelsByUserId,
    setChannels,
    channels,
    loadingChannels,
    hasMore,
  } = useGetChannelsByUserId();
  const { user } = useAuthStore();
  const { layout, setLayout } = useLayoutStore();
  const {
    createdChannel,
    deletedChannelId,
    setDeletedChannelId,
    channelJoined,
    setChannelJoined,
    updatedChannel,
    setNewUnreadMessage,
    newUnreadMessage  } = useGlobalDataStore();


   useEffect(()=>{
  
    if(!newUnreadMessage || (selectedChannel && selectedChannel.id === newUnreadMessage.channelId) ) return;

    setChannels(prev => 
    prev.map(channel =>
        channel.id === newUnreadMessage.channelId
      ? { ...channel, unreadMessages: channel.unreadMessages + 1 } // Actualiza solo ese grupo
      : channel
    ));

    setNewUnreadMessage(null);
  },[newUnreadMessage])

  

  useEffect(() => {
      if(!isMounted || !leftPanelRef) return;
      
      setLayout({leftPanelWidth: leftPanelRef.current?.offsetWidth})
  }, [isMounted, leftPanelRef]);
  
  useEffect(()=>{

    if(channelJoined)
    {
      setChannels((prev)=>([...prev, channelJoined]))
      setChannelJoined(null);
    }
  },[channelJoined])

  useEffect(()=>{

    if(!updatedChannel) return;

    setChannels(prev =>
      prev.map(c => c.id === updatedChannel.id ? updatedChannel : c)
    );
  },[updatedChannel])

  useEffect(() => {
    if (deletedChannelId) {
      setChannels(
        channels.filter((channel) => channel.id !== deletedChannelId)
      );

      setDeletedChannelId(null);
    }
  }, [deletedChannelId]);


  useEffect(() => {
    if (createdChannel) {
      setChannels((prev) => [...prev, createdChannel]);
    }
  }, [createdChannel]);

  useEffect(() => {
    if (channels.length > 0) {
      setSelectedChannel(channels[0]);
    } else {
      setSelectedChannel(null);
    }
  }, [channels.length]);


  useEffect(() => {
    if (user) {
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
      <div ref={leftPanelRef}  className={`${layout.sideBarExpanded ? "flex flex-col" : "hidden"}  w-[300px] z-[31] max-md:z-[50] bg-white dark:bg-black`}>
        <div
         
          id="side-bar"
          
          className={` h-full py-4   rounded-tr-lg bg-white dark:bg-black animate-all flex flex-col border-r border-t  border-default-100 px-3 overflow-auto gap-4 scroll-smooth scrollbar-hide`}
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
            searchButton={false}
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
          {(!selectedChannel && layout.sideBarExpanded && !loadingChannels) && 
            <div className="h-full w-full flex flex-col items-center justify-center">
              
              <motion.div
                  animate={{
                    y: [0, -50, 0],        
                    rotate: [0, 360, 360],  
                  }}
                  transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",}}
                  
              >
                <BoxIcon size={30} className={"opacity-30"}/>

              </motion.div>
              <p className="text-xs text-center opacity-30 font-semibold">
                Seems you dont have any channel yet
              </p>
            </div>
          }
          {(!selectedChannel && layout.sideBarExpanded && loadingChannels) && (
            <Spinner
              className="absolute top-1/2 left-1/2"
              size="sm"
              variant="spinner"
            />
          )}
        </div>
        
        <StatusBar isReady={(!hasMore && !loadingChannels)} channels={channels} /> 
            
        
      </div>
    </>
  );
};

export default LeftSideBar;
