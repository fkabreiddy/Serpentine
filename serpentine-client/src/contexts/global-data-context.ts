import { create } from 'zustand';

interface GlobalData {
  currentChannelId: string | null;
  currentGroupId: string | null;
  setCurrentGroupId: (groupId: string) => void
  setCurrentChannelId: (channelId: string) => void

  
}

export const useGlobalDataStore = create<GlobalData>((set) => ({
  currentChannelId: null,
  currentGroupId: null,
  
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