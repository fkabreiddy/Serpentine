import { create } from 'zustand';
import {ChannelResponse} from "@/models/responses/channel-response.ts";
import {GroupResponse} from "@/models/responses/group-response.ts";

interface GlobalData {
  currentChannelId: string | null;
  currentGroupId: string | null;
  setCreatedChannel: (channel: ChannelResponse | null) => void;
  setCurrentGroupId: (groupId: string) => void;
  setCurrentChannelId: (channelId: string)  => void;
  createdChannel: ChannelResponse | null;
  createdGroup: GroupResponse | null;
  setCreatedGroup: (group: GroupResponse | null)=>void

  
}

export const useGlobalDataStore = create<GlobalData>((set) => ({
  currentChannelId: null,
  currentGroupId: null,
  createdChannel: null,
  createdGroup: null,
  
  setCreatedGroup: (group: GroupResponse | null) => {
    set((state)=>({
      
      ...state,
      createdGroup: group,
    }))
  },
  setCreatedChannel: (channel: ChannelResponse | null) => {
    set((state)=> ({
      ...state,
      createdChannel: channel
    }))
  },
  
  setCurrentGroupId: (groupId : string) =>{
    set((state) => ({
      ...state,
      currentGroupId: groupId,
     
    }));
  },

  setCurrentChannelId: (groupId : string) =>{
    set((state) => ({
      ...state,
      currentChannelId: groupId,
     
    }));
  },

 
}));