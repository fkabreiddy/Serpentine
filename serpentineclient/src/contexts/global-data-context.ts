import { create } from "zustand";
import { ChannelResponse } from "@/models/responses/channel-response.ts";
import { GroupResponse } from "@/models/responses/group-response.ts";

interface GlobalData {
  createChannelGroupData: { channelId: string; channelName: string } | null;
  setCreateGroupChannelData: (
    data: { channelId: string; channelName: string } | null
  ) => void;
  channelInfoId: string | null;
  setChannelInfoId: (id: string | null) => void;
  createdChannel: ChannelResponse | null;
  setCreatedChannel: (channel: ChannelResponse | null) => void;
  createdGroup: GroupResponse | null;
  setCreatedGroup: (group: GroupResponse | null) => void;
  deletedChannelId: string | null;
  setDeletedChannelId: (id: string | null) => void;
}

export const useGlobalDataStore = create<GlobalData>((set) => ({
  createChannelGroupData: null,
  createdChannel: null,
  deletedChannelId: null,
  createdGroup: null,
  channelInfoId: null,

  setDeletedChannelId: (id: string | null) => {
    set((state) => ({
      ...state,
      deletedChannelId: id,
    }));
  },
  setChannelInfoId: (id: string | null) => {
    set((state) => ({
      ...state,
      channelInfoId: id,
    }));
  },
  setCreatedGroup: (group: GroupResponse | null) => {
    set((state) => ({
      ...state,
      createdGroup: group,
    }));
  },

  setCreateGroupChannelData: (
    data: { channelId: string; channelName: string } | null
  ) => {
    set((state) => ({
      ...state,
      createChannelGroupData: data,
    }));
  },
  setCreatedChannel: (channel: ChannelResponse | null) => {
    set((state) => ({
      ...state,
      createdChannel: channel,
    }));
  },
}));
