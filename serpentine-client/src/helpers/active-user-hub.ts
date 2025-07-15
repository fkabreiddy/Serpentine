import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import * as signalR from "@microsoft/signalr";
import { getToken } from "./jwt-helper";
import { HubResult } from "@/models/hub-result";
import { useEffect, useRef, useState } from "react";
import { showToast } from "./sonner-helper";
import { HubConnectionState } from '@microsoft/signalr';




export function useActiveUser() {
    const { setConnection, quitConnection, setConnectionState, activeUsersHub } = useActiveUserHubStore();
    const alreadyRendered = useRef<boolean>();

    useEffect(()=>{
        if(!alreadyRendered.current)
        {
            connectToActiveUsersHub();
            alreadyRendered.current = true;
        }
    },[])

    useEffect(()=>{

        if(activeUsersHub)
        {
            setConnectionState(activeUsersHub.state);
        }
        else{
            setConnectionState(HubConnectionState.Disconnected);
        }
    },[activeUsersHub?.state])
    

    const registerHandlers = () => {
        
        if (!activeUsersHub) return;

        activeUsersHub.on("SendUserConnected", result => ()=>{});
        activeUsersHub.on("SendUserDisconnected", result => ()=>{});
    };

    const unregisterHandlers = () =>{
        if (!activeUsersHub) return;
        activeUsersHub.off("SendUserConnected");
        activeUsersHub.off("SendUserDisconnected");

    }

    const disconnectFromActiveUsersHub = async () => {
        if (activeUsersHub) {
            unregisterHandlers();
            await activeUsersHub.stop();
            quitConnection();
            setConnectionState(HubConnectionState.Disconnected);
            showToast({title: "Disconnected", description: "You were disconnected from serpentine. Try again"})

        }
    };

    const connectToActiveUsersHub = async () => {
        try{

            const token = await getToken();

            const hub = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5000/hub/active-users", {
                    accessTokenFactory: () => token ?? "",
                })
                .withAutomaticReconnect()
                .build();

            hub.onreconnecting(() => unregisterHandlers());
            hub.onclose(() => disconnectFromActiveUsersHub());
            hub.onreconnected(() => {
                registerHandlers();
            });

            await hub.start();

            registerHandlers();
            setConnection(hub);
        }
        catch{

            disconnectFromActiveUsersHub();
            
        


        }
        
    };

    return { disconnectFromActiveUsersHub };
}
