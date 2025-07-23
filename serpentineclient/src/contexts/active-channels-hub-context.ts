import { ChannelResponse } from "@/models/responses/channel-response";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { create } from "zustand";

interface ActiveChannelsStore {
  activeChannelsHub: HubConnection | null;
  activeChannelsHubsState: HubConnectionState;
  activeChannels: string[];
  setConnection: (hub: HubConnection | null) => void;
  quitConnection: () => void;
  setActiveChannelsHubConnectionState: (
    connetionState: HubConnectionState
  ) => void;
  addChannel: (channelId: string) => void;
  removeChannel: (channelId: string) => void;
  clearChannels: () => void;
}

export const useActiveChannelsHubStore = create<ActiveChannelsStore>((set) => ({
  activeChannelsHub: null,
  activeChannelsHubsState: HubConnectionState.Disconnected,
  activeChannels: [],

  setActiveChannelsHubConnectionState: (
    connectionState: HubConnectionState
  ) => {
    set((state) => ({
      ...state,
      activeChannelsHubsState: connectionState,
    }));
  },

  setConnection: (hub) => {
    set((state) => ({
      ...state,
      activeChannelsHub: hub,
    }));
  },

  quitConnection: () => {
    set((state) => ({
      ...state,

      activeChannelsHub: null,
    }));
  },

  addChannel: (channel) => {
    set((state) => ({
      ...state,
      activeChannels: [...state.activeChannels, channel],
    }));
  },

  removeChannel: (channelToRemove) => {
    set((state) => ({
      ...state,

      activeChannels: state.activeChannels.filter((c) => c !== channelToRemove),
    }));
  },

  clearChannels: () => {
    set((state) => ({
      ...state,
      activeChannels: [],
    }));
  },
}));
