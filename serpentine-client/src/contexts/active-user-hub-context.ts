import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { create } from "zustand";

interface ActiveUserHub{

    hub: HubConnection;
}

interface ActiveUserHubContext{

    connection : ActiveUserHub | null;
    connectionStatus: HubConnectionState | HubConnectionState.Disconnected;
    setConnection: (updates: Partial<ActiveUserHub>) => void;
    quitConnection:()=> void;
}

export const useActiveUserHubStore = create<ActiveUserHubContext>((set)=>({

    connection: null,
    connectionStatus: HubConnectionState.Disconnected,
    setConnection: (updates: Partial<ActiveUserHub>) => {
        set((state)=>({
            connection: state.connection
            ? { ...state.connection, ...updates }
            : { ...updates } as ActiveUserHub,
            connectionStatus: state.connection  ? state.connection.hub.state : HubConnectionState.Disconnected
        }))
    },

    

    quitConnection:() =>{
        set((state)=>({
            ...state,
            connection: null,
            connectionStatus: HubConnectionState.Disconnected
            
        }))
    }
})) 