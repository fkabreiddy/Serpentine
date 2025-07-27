import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import * as signalR from "@microsoft/signalr";
import { HubResult } from "@/models/hub-result";
import { useEffect, useRef, useState } from "react";
import { showToast } from "./sonner-helper";
import { HubConnectionState } from '@microsoft/signalr';
import { set } from "zod";
import { JwtHelper } from "./jwt-helper";




export function useActiveUser() {
    const { setConnection, quitConnection, setConnectionState, activeUsersHub } = useActiveUserHubStore();
    const alreadyRendered = useRef<boolean>();
    const activeUsersHubRef = useRef<signalR.HubConnection | null>(null);

    const {getToken} = JwtHelper();


    useEffect(()=>{
        if(!alreadyRendered.current)
        {
            connectToActiveUsersHub();
            alreadyRendered.current = true;
            
        }
    },[])

    
    

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

            hub.onreconnecting(() => {unregisterHandlers(); setConnectionState(HubConnectionState.Reconnecting)});
            hub.onclose(() => {disconnectFromActiveUsersHub(); setConnectionState(HubConnectionState.Disconnected)});
            hub.onreconnected(() => {
                registerHandlers();
                setConnectionState(HubConnectionState.Connected);
            });

            await hub.start();
        
            
            registerHandlers();
            setConnection(hub);
            setConnectionState(hub.state);
        }
        catch{

            disconnectFromActiveUsersHub();
            
        


        }
        
    };

    return { disconnectFromActiveUsersHub };
}
