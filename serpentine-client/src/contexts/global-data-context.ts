import { create } from 'zustand';

interface GlobalData {
  currentChannelId: number | null;
  currentGroupId: number | null;
  setCurrentGroupId: (groupId: number) => void
  setCurrentChannelId: (channelId: number) => void

  
}

export const useGlobalDataStore = create<GlobalData>((set) => ({
  currentChannelId: null,
  currentGroupId: null,
  
  setCurrentGroupId: (groupId : number) =>{
    set((state) => ({
      ...state,
      currentGroupId: groupId,
     
    }));
  },

  setCurrentChannelId: (groupId : number) =>{
    set((state) => ({
      ...state,
      currentChannelId: groupId,
     
    }));
  },

 
}));