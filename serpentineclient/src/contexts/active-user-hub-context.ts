import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { create } from "zustand";


interface ActiveUserHubContext{

    activeUserHubConnectionState: HubConnectionState
    activeUsersHub: HubConnection | null
    setConnection: (hub: HubConnection | null) => void;
    quitConnection:()=> void;
    setConnectionState:(connectionState: HubConnectionState) => void;

}

export const useActiveUserHubStore = create<ActiveUserHubContext>((set)=>({

    activeUsersHub: null,
    activeUserHubConnectionState: HubConnectionState.Disconnected,
    setConnection: (hubUpdate: HubConnection | null) => {
        set((state)=>({
          ...state,
          activeUsersHub: hubUpdate
        }))
    },

    setConnectionState: (connectionState: HubConnectionState)=> {
         set((state)=>({
          ...state,
          activeUserHubConnectionState: connectionState
        }))
    },

    

    quitConnection:() =>{
        set((state)=>({
            ...state,
            activeUsersHub: null,

            
        }))
    }
})) 