import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import * as signalR from "@microsoft/signalr";
import { getToken } from "./jwt-helper";
import { HubResult } from "@/models/hub-result";
import { useEffect, useRef, useState } from "react";
import { showToast } from "./sonner-helper";
import { HubConnectionState } from '@microsoft/signalr';



interface UseActiveUsersHubOptions {
    onUserConnected?: (result: HubResult<string>) => void;
    onUserDisconnected?: (result: HubResult<string>) => void;
}
export function useActiveUser({ onUserDisconnected, onUserConnected  }: UseActiveUsersHubOptions) {
    const { setConnection, quitConnection } = useActiveUserHubStore();
    const [hubStatus, setHubStatus] = useState<signalR.HubConnectionState>(signalR.HubConnectionState.Disconnected);
    const hubRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        return () => {
            hubRef.current?.stop();
            hubRef.current = null;
            quitConnection();
        };
    }, []);

    useEffect(() => {
        if (hubRef.current) {
            setConnection({ hub: hubRef.current });
        } else {
            quitConnection();
        }
    }, [hubStatus, hubRef]);

    const registerHandlers = () => {
        const hub = hubRef.current;
        if (!hub) return;

        hub.off("SendUserConnected");
        hub.off("SendUserDisconnected");

        hub.on("SendUserConnected", result => onUserConnected?.(result));
        hub.on("SendUserDisconnected", result => onUserDisconnected?.(result));
    };

    const unregisterHandlers = () =>{
        const hub = hubRef.current;
        if (!hub) return;

        hub.off("SendUserConnected");
        hub.off("SendUserDisconnected");

    }

    const disconnect = async () => {
        if (hubRef.current) {
            unregisterHandlers();
            await hubRef.current.stop();
            hubRef.current = null;
            quitConnection();
            showToast({title: "Disconnected", description: "You were disconnected from serpentine. Try again"})

        }
    };

    const connectToApp = async () => {
        try{

            const token = await getToken();

            const hub = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5000/hub/active-users", {
                    accessTokenFactory: () => token ?? "",
                })
                .withAutomaticReconnect()
                .build();

            hub.onreconnecting(() => setHubStatus(signalR.HubConnectionState.Reconnecting));
            hub.onclose(() => setHubStatus(signalR.HubConnectionState.Disconnected));
            hub.onreconnected(() => {
                setHubStatus(signalR.HubConnectionState.Connected);
                registerHandlers();
            });

            await hub.start();

            hubRef.current = hub;
            registerHandlers();
            setConnection({ hub });
            setHubStatus(signalR.HubConnectionState.Connected);
        }
        catch{

            disconnect();
            
        


        }
        
    };

    return { connectToApp, disconnect };
}
