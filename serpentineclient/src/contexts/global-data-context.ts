import { create } from "zustand";
import { ChannelResponse } from "@/models/responses/channel-response.ts";
import { GroupResponse } from "@/models/responses/group-response.ts";
import { MessageResponse } from "@/models/responses/message-response";

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
  channelJoined: ChannelResponse | null;
  setChannelJoined: (channel: ChannelResponse | null) => void;
  updateChannelId: string | null;
  setUpdateChannelid: (channelId : string | null) => void;
  updatedChannel: ChannelResponse | null;
  setUpdatedChannel: (channelId: ChannelResponse | null) => void;
  newUnreadMessage: MessageResponse | null;
  setNewUnreadMessage: (message: MessageResponse | null) => void;
  currentGroupIdAtChatroomPage: string | null;
  setCurrentGroupIdAtChatroomPage: (groupId: string | null) => void;
  resetGroupUnreadMessages: string | null;
  setResetGroupUnreadMessages: (groupId: string | null) => void;
  deletedMessageId: string | null;
  setDeletedMessageId: (id: string | null) => void;
  newMessageRecievedOnCurrentGroup: MessageResponse | null;
  setNewMessageRecievedOnCurrentGroup: (message: MessageResponse | null) => void;
  clearGlobalData: ()=>void
}

export const useGlobalDataStore = create<GlobalData>((set) => ({
  createChannelGroupData: null,
  createdChannel: null,
  deletedChannelId: null,
  createdGroup: null,
  channelInfoId: null,
  channelJoined: null,
  updateChannelId: null,
  updatedChannel: null, 
  newUnreadMessage: null,
  resetGroupUnreadMessages: null,
  currentGroupIdAtChatroomPage: null,
  deletedMessageId: null,
  newMessageRecievedOnCurrentGroup: null,

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

  setChannelJoined: (channel: ChannelResponse | null) => {
    set((state) => ({
      ...state,
      channelJoined: channel,
    }));
  },
  
  setUpdateChannelid: (channelId: string | null) => {
    set((state) => ({
      ...state,
      updateChannelId: channelId,
    }));
  },

   setUpdatedChannel: (channel: ChannelResponse | null) => {
    set((state) => ({
      ...state,
      updatedChannel: channel,
    }));
  },

     setNewUnreadMessage: (message: MessageResponse | null) => {
    set((state) => ({
      ...state,
      newUnreadMessage: message,
    }));
  },
  setCurrentGroupIdAtChatroomPage: (groupId: string | null) => {
    set((state) => ({
      ...state,
      currentGroupIdAtChatroomPage: groupId,
    }));
  },

  setResetGroupUnreadMessages: (groupId: string | null) => {
    set((state) => ({
      ...state,
      resetGroupUnreadMessages: groupId,
    }));
  },

  setDeletedMessageId: (id: string | null) => {
    set((state) => ({
      ...state,
      deletedMessageId: id,
    }));
  },

  setNewMessageRecievedOnCurrentGroup: (message: MessageResponse | null) => {

    set((state)=>({
        ...state,
        newMessageRecievedOnCurrentGroup: message

    }))
  },

  clearGlobalData: () => {
    set((state) => ({
      ...state,
      createChannelGroupData: null,
      channelInfoId: null
    }))
  }



}));
