import { create } from 'zustand';

interface GlobalData {
  currentGroupId: number | null;
  currentChatId: number | null;
  
}

export const useGlobalDataStore = create<GlobalData>((set) => ({
  currentGroupId: null,
  currentChatId: null,
  
  setCurrentGroupId: (groupId : number) =>{
    set({
      currentGroupId: groupId,
     
    });
  },

  setCurrentChatId: (groupId : number) =>{
    set({
      currentChatId: groupId,
     
    });
  },

 
}));