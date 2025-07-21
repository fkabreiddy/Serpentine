import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getToken } from "./jwt-helper";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { ChannelResponse } from "@/models/responses/channel-response";
import { HubResult } from "@/models/hub-result";
import { a } from "motion/react-client";
import { useLayoutStore } from "@/contexts/layout-context";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import { HubConnectionState } from "@microsoft/signalr";
import { clear } from "console";
import { showToast } from "./sonner-helper";


export function useActiveChannels() {
  const {
    setConnection,
    quitConnection,
    clearChannels,
    setActiveChannelsHubConnectionState,
    activeChannelsHub,
  } = useActiveChannelsHubStore();

  const alreadyRendered = useRef<boolean>(false);
  

  useEffect(() => {
   
    const connect = async () =>{
        await connectToActiveChannelsHub();
    }
    if(!alreadyRendered.current)
    {
        connect();
        alreadyRendered.current = true;
    }
  }, []);

  


  const registerHandlers = () => {
    if (!activeChannelsHub) return;
  };

  const unregisterHandlers = () => {
    if (!activeChannelsHub) return;
  };


  const handleDisconnect =  () =>{

    setActiveChannelsHubConnectionState(HubConnectionState.Disconnected);
    clearChannels();
    quitConnection();
  }

  const handleReconnecting = () =>{
    setActiveChannelsHubConnectionState(HubConnectionState.Reconnecting);
    clearChannels();
    unregisterHandlers();


  } 

  const handleReconnected = () => {
    setActiveChannelsHubConnectionState(HubConnectionState.Connected);
    registerHandlers();
  }


  const connectToActiveChannelsHub = async () => {
    try {
      const token = await getToken();
      const newHub = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5000/hub/active-channels", {
          accessTokenFactory: () => token ?? "",
        })
        .withAutomaticReconnect()
        .build();

      newHub.onreconnecting(async ()=>{

        handleReconnecting();
      })

      newHub.onclose(async () => {
        handleDisconnect();
      });

      newHub.onreconnected(async () => {
         handleReconnected(); //remember to listen to channels again manually outside of this hook
      });

      await newHub.start();

      setConnection(newHub);
      unregisterHandlers();
      registerHandlers();
      setActiveChannelsHubConnectionState(newHub.state);

    } catch (error) {
      activeChannelsHub?.stop();
    }
  };

  
}

export function useActiveChannelsActions() {
  
  const {activeChannelsHub, addChannel, removeChannel} = useActiveChannelsHubStore();
  const listenToChannel = async (channel: ChannelResponse) =>{

    
    if (!activeChannelsHub) return;

    try {
        const result: HubResult<boolean> = await activeChannelsHub.invoke("ConnectToChannel", channel.id);
        if (result.isSuccess) {
          addChannel(channel.id);
          return;
        }
      } catch (error) {
        showToast({title: "Error", description: `Error connecting to channel ${channel.id}`});
      }
  }

  const stopListeningToChannel = async (channel: ChannelResponse) =>{

    
    if (!activeChannelsHub) return;

    try {
        const result: HubResult<boolean> = await activeChannelsHub.invoke("DisconnectFromChannel", channel.id);
        if (result.isSuccess) {
          removeChannel(channel.id);
          return;
        }
      } catch (error) {
        showToast({title: "Error", description: `Error disconnecting from channel ${channel.id}`});
      }
  }

  return {
    listenToChannel,
    stopListeningToChannel,
  }
}
