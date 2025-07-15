import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getToken } from "./jwt-helper";
import { useActiveChannelsHubStore } from "@/contexts/active-channels-hub-context";
import { ChannelResponse } from "@/models/responses/channel-response";
import { HubResult } from "@/models/hub-result";
import { a } from "motion/react-client";
import { useLayoutStore } from "@/contexts/layout-context";

interface UseActiveChannelsProps{

    
    onReconnected?: () => void | Promise<void>;

    
}

export function useActiveChannels({onReconnected = ()=>{}}:UseActiveChannelsProps) {
  const {
    setConnection,
    quitConnection,
    addChannel,
    clearChannels,
    removeChannel,
    setActiveChannelsHubConnectionState,
    activeChannels,
    activeChannelsHub,
  } = useActiveChannelsHubStore();

  const alreadyRendered = useRef<boolean>(false);
  const [registeringToChannels, setRegisteringToChannels] = useState(false);
  const {newChannel} = useLayoutStore();

  useEffect(()=>{

    const connect = async (channel: ChannelResponse) =>{

        await listenToChannel(channel);
    }
    if(newChannel)
    {
        connect(newChannel);
    }
  },[newChannel])

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

  useEffect(() => {
    
    if (activeChannelsHub) {
      setActiveChannelsHubConnectionState(activeChannelsHub.state);
    } else {
      setActiveChannelsHubConnectionState(signalR.HubConnectionState.Disconnected);
    }
  }, [activeChannelsHub?.state]);

  const registerHandlers = () => {
    if (!activeChannelsHub) return;
  };

  const unregisterHandlers = () => {
    if (!activeChannelsHub) return;
  };

  const disconnectFromActiveChannelsHub = async () => {
    if (activeChannelsHub) {
      unregisterHandlers();
      await stopListeningToChannels();
      clearChannels();
      await activeChannelsHub.stop();
      quitConnection();
    }
  };

  const listenToChannels = async (channels: ChannelResponse[]) => {

    if (!activeChannelsHub) return;

    setRegisteringToChannels(true);

    for (const channel of channels) {
      try {
        const result: HubResult<boolean> = await activeChannelsHub.invoke("ConnectToChannel", channel.id);
        if (result.isSuccess) {
          addChannel(channel);
        }
      } catch (error) {
        console.error(`Error connecting to channel ${channel.id}`, error);
      }
    }
    setRegisteringToChannels(false);
  };

  const stopListeningToChannels = async () => {
    if (!activeChannelsHub) return;

    setRegisteringToChannels(true);
    for (const channel of activeChannels) {
      try {
        const result: HubResult<boolean> = await activeChannelsHub.invoke("DisconnectFromChannel", channel.id);
        if (result.isSuccess) {
          removeChannel(channel);
        }
      } catch (error) {
        console.error(`Error disconnecting to channel ${channel.id}`, error);
      }
    }
    clearChannels();
    setRegisteringToChannels(false);
  };

  const listenToChannel = async (channel: ChannelResponse) =>{

    
    if (!activeChannelsHub) return;

    try {
        const result: HubResult<boolean> = await activeChannelsHub.invoke("ConnectToChannel", channel.id);
        if (result.isSuccess) {
          addChannel(channel);
        }
      } catch (error) {
        console.error(`Error connecting to channel ${channel.id}`, error);
      }
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

       await stopListeningToChannels();
        unregisterHandlers();
      })

      newHub.onclose(async () => {

        await stopListeningToChannels();
      });

      newHub.onreconnected(async () => {
        registerHandlers();
        onReconnected(); //remember to listen to channels again manually outside of this hook
      });

      await newHub.start();

      setConnection(newHub);
      registerHandlers();

    } catch (error) {
      disconnectFromActiveChannelsHub();
    }
  };

  return {
    listenToChannels,
    registeringToChannels,
  };
}
