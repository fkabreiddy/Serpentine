import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { HubResult } from "@/models/hub-result";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { HubConnectionState } from "@microsoft/signalr";
import {showToast} from "@/helpers/sonner-helper.ts"
import { useJwtHelper } from "@/helpers/jwt-helper";
import ChannelBanResponse from "@/models/responses/channel-ban-response";

export function useActiveChannels() {
  const {
    setConnection,
    quitConnection,
    clearChannels,
    setActiveChannelsHubConnectionState,
    removeChannel,
    activeChannelsHub,
  } = useActiveChannelsHubStore();
  const { setDeletedChannelId} = useGlobalDataStore();
  const {getToken} = useJwtHelper();


  function handleSendUserBanned(ban: ChannelBanResponse | null){

    if(!ban) return;
    setDeletedChannelId(ban.channelId);
    showToast({title: "Banned from channel!", description: `You have been banned from a channel for ${ban.channelId}. Reason: ${ban.reason}`, color: "danger"})

    
  }

  function handelSendChannelRemoved(channelId: string | null){

    if(!channelId) return;
    
    setDeletedChannelId(channelId);


    showToast({title: "Channel Deleted", description: `One of the channels you belong has been deleted`})

    
  }




  const alreadyRendered = useRef<boolean>(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(()=>{

    return () =>{

      setActiveChannelsHubConnectionState(HubConnectionState.Disconnected);
      clearChannels();
      quitConnection();
      connectionRef.current?.stop();

    }

  },[])

  useEffect(() => {
    const connect = async () => {
      await connectToActiveChannelsHub();
    };
    if (!alreadyRendered.current) {
      connect();
      alreadyRendered.current = true;
    }
  }, []);

  const registerHandlers = () => {
    if (!activeChannelsHub) return;

    activeChannelsHub.on("SendUserBanned", (result: HubResult<ChannelBanResponse>)=> handleSendUserBanned(result.data))
    activeChannelsHub.on("SendChannelRemoved", (result: HubResult<string>)=> handelSendChannelRemoved(result.data))


  };

  const unregisterHandlers = () => {
    if (!activeChannelsHub) return;
    activeChannelsHub.off("SendUserBanned")
    activeChannelsHub.off("SendChannelRemoved")
  };

  const handleDisconnect = () => {
    setActiveChannelsHubConnectionState(HubConnectionState.Disconnected);
    clearChannels();
    quitConnection();
  };

  const handleReconnecting = () => {
    setActiveChannelsHubConnectionState(HubConnectionState.Reconnecting);
    clearChannels();
    unregisterHandlers();
  };

  const handleReconnected = () => {
    setActiveChannelsHubConnectionState(HubConnectionState.Connected);
    registerHandlers();
  };

  const connectToActiveChannelsHub = async () => {
    try {
      const token = await getToken();
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

      unregisterHandlers();
      newHub.on("SendUserBanned", (result: HubResult<ChannelBanResponse>)=> handleSendUserBanned(result.data))
      newHub.on("SendChannelRemoved", (result: HubResult<string>)=> handelSendChannelRemoved(result.data))



      await newHub.start();

      setConnection(newHub);
      connectionRef.current = newHub;
      
      setActiveChannelsHubConnectionState(newHub.state);
    } catch (error) {
      activeChannelsHub?.stop();
    }
  };
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
  };
}
