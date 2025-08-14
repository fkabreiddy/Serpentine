import { useCallback, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { HubResult } from "@/models/hub-result";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { HubConnectionState } from "@microsoft/signalr";
import {showToast} from "@/helpers/sonner-helper.ts"
import { useJwtHelper } from "@/helpers/jwt-helper";
import ChannelBanResponse from "@/models/responses/channel-ban-response";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { ChannelResponse } from "@/models/responses/channel-response";
import { color } from "framer-motion";
import {MessageResponse} from "@/models/responses/message-response.ts";
import { useParams } from "react-router-dom";
import { showMessageNotification } from "../helpers/sonner-helper";
import { LucideToggleRight } from "lucide-react";
import { user } from "@heroui/theme";
import { channel } from "diagnostics_channel";



export function useActiveChannelsHubConnection(){

  const {getToken} = useJwtHelper();
  const {activeChannelsHub, setConnection, setActiveChannelsHubConnectionState, clearChannels, quitConnection} = useActiveChannelsHubStore();
  const firstRender = useRef<boolean>(true);
  const {setDeletedChannelId, setNewUnreadMessage, currentGroupIdAtChatroomPage} = useGlobalDataStore()
  const [isMounted, setIsMounted]=useState<boolean>(false);
  const currentGroupIdRef = useRef(currentGroupIdAtChatroomPage);
  useEffect(() => {
    currentGroupIdRef.current = currentGroupIdAtChatroomPage;
  }, [currentGroupIdAtChatroomPage]);

  const handleSendUserBanned = useCallback((result: HubResult<ChannelBanResponse | null>) => {
   
    const ban = result.data;
   
    if(!ban) return;
    setDeletedChannelId(ban.channelId);
    showToast({
      title: "Banned from channel!", 
      description: `You have been banned from a channel for ${ban.channelId}. Reason: ${ban.reason}`, 
      color: "danger"
    });
  }, []); // Sin dependencias - solo usa setters y funciones


  const handleSendChannelRemoved = useCallback((result: HubResult<string | null>) => {
    const channelId = result.data;
    
    if(!channelId) return;
    
    setDeletedChannelId(channelId);
    showToast({
      title: "Channel Deleted", 
      description: `One of the channels you belong has been deleted`
    });
  }, []); // Sin dependencias

  const handleSendChannelMemberKickedOut = useCallback((result: HubResult<ChannelResponse | null>) => {
    const channel = result.data;
    
    if(!channel) return;
    setDeletedChannelId(channel.id);
    showToast({
      title: "Membership Removed", 
      description: `You've been kickedout from the channel ${channel.name}`, 
      color: "danger"
    });
  }, []); // Sin dependencias

  const handleSendMessage = useCallback((result: HubResult<MessageResponse | null>)=>{

      console.log("Send Message hit");

      const message = result.data;

      if(!message) return;




      setNewUnreadMessage(message);


      if(currentGroupIdRef.current === message.groupId) return;
      console.log(currentGroupIdRef.current);

      showMessageNotification({
        title: `${message.channelName} > ${message.groupName}`, 
        description: `@${message.senderUsername}: ${message.content.substring(0, 50)}`
      });

    },[]);

  
  


  const registerHandlers = useCallback(() => {

    if(!activeChannelsHub) return;

    activeChannelsHub.on("SendUserBanned",  handleSendUserBanned);
    activeChannelsHub.on("SendChannelRemoved",  handleSendChannelRemoved);
    activeChannelsHub.on("SendUserKickedOut",  handleSendChannelMemberKickedOut);
    activeChannelsHub.on("SendMessage", handleSendMessage);

   

  }, [activeChannelsHub, handleSendMessage]);

  const unregisterHandlers  = useCallback(() => {
    if (!activeChannelsHub) return;
    activeChannelsHub.off("SendUserBanned")
    activeChannelsHub.off("SendChannelRemoved")
    activeChannelsHub.off("SendUserKickedOut")
    activeChannelsHub.off("SendMessage");


  }, [activeChannelsHub]);

  const handleDisconnect = useCallback(() => {
    setActiveChannelsHubConnectionState(HubConnectionState.Disconnected);
    clearChannels();
    quitConnection();
  },[]);

  const handleReconnecting = useCallback(() => {
    setActiveChannelsHubConnectionState(HubConnectionState.Reconnecting);
    clearChannels();
    unregisterHandlers();
  },[]);

  const handleReconnected = useCallback(() => {
    setActiveChannelsHubConnectionState(HubConnectionState.Connected);
    registerHandlers();
  },[]);



  useEffect(()=>{

    setIsMounted(true);

  },[])

  

  useEffect(()=>{

    if(!firstRender.current) return;
    firstRender.current = false;

      const token = getToken();
      const newHub = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/hub/active-channels", {
          accessTokenFactory: () => token ?? "",
        })
        .withAutomaticReconnect()
        .build();

      newHub.onreconnecting(async () => {
        handleReconnecting();
      });

      newHub.onclose(async () => {
        handleDisconnect();
      });

      newHub.onreconnected(async () => {
        handleReconnected(); 
      });

    newHub.start().then(()=>{setConnection(newHub);})

    



  },[isMounted])


 
 

  useEffect(()=>{

    if(!activeChannelsHub) return;

    setActiveChannelsHubConnectionState(activeChannelsHub.state);
    registerHandlers();


    return()=>{

      unregisterHandlers();
      activeChannelsHub.stop()
      clearChannels();
      setConnection(null);
    }

  },[activeChannelsHub])
}


export function useActiveChannelsHubActions() {
  const { activeChannelsHub, addChannel, removeChannel } =
    useActiveChannelsHubStore();

  const listenToChannel = async (
    channelId: string,
    channelName: string | null = null
  ) => {
    if (!activeChannelsHub) return;

    try {
      const result: HubResult<boolean> = await activeChannelsHub.invoke(
        "ConnectToChannel",
        channelId
      );
      if (result.isSuccess) {
        addChannel(channelId);
        return;
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: `Error connecting to channel ${channelName ?? ""}`,
      });
    }
  };

  const stopListeningToChannel = async (
    channelId: string,
    channelName: string | null = null
  ) => {
    if (!activeChannelsHub) return;

    try {
      const result: HubResult<boolean> = await activeChannelsHub.invoke(
        "DisconnectFromChannel",
        channelId
      );
      if (result.isSuccess) {
        removeChannel(channelId);
        return;
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: `Error disconnecting from channel ${channelName ?? ""}`,
      });
    }
  };

  return {
    listenToChannel,
    stopListeningToChannel,
  }
}
