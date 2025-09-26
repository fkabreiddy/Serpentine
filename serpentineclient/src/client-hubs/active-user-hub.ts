import { useActiveUserHubStore } from "@/contexts/active-user-hub-context";
import * as signalR from "@microsoft/signalr";
import { HubResult } from "@/models/hub-result";
import { useCallback, useEffect, useRef, useState } from "react";
import { showToast } from "@/helpers/sonner-helper";
import { HubConnectionState } from '@microsoft/signalr';
import { set } from "zod";
import { useJwtHelper } from "@/helpers/jwt-helper";
import { useAuthStore } from "@/contexts/authentication-context";



export function useActiveUser() {
    const { setConnection, quitConnection, setConnectionState, activeUsersHub } = useActiveUserHubStore();
    const firstRender = useRef<boolean>(true);
    const {setAuthenticationState} = useAuthStore();
    const [isMounted, setIsMounted]=useState<boolean>(false);


    const {getToken} = useJwtHelper();

    useEffect(()=>{

        setIsMounted(true);
       
    },[])
   useEffect(()=>{

    if(!firstRender.current) return;

    if(!activeUsersHub) return;
    firstRender.current = false;
    setConnectionState(activeUsersHub.state);
    registerHandlers();



    return()=>{

      unregisterHandlers();
      activeUsersHub.stop()
      setConnection(null);
    }

  },[activeUsersHub])

    
    

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

    useEffect(()=>{

        if(!isMounted) return;

        connectToActiveUsersHub();
    },[isMounted])
    
    const handleDisconnect = useCallback(() => {
        setConnectionState(HubConnectionState.Disconnected);
        quitConnection();
    },[]);
    
      const handleReconnecting = useCallback(() => {
        setConnectionState(HubConnectionState.Reconnecting);
        unregisterHandlers();
      },[]);
    
      const handleReconnected = useCallback(() => {
        setConnectionState(HubConnectionState.Connected);
        registerHandlers();
      },[]);

    const connectToActiveUsersHub = async () => {
        
            const token = await getToken();

            const hub = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5000/hub/active-users", {
                    accessTokenFactory: () => token ?? "",
                })
                .withStatefulReconnect()
                .withAutomaticReconnect()
                .build();

            hub.onreconnecting(handleReconnecting);
            hub.onclose(handleDisconnect);
            hub.onreconnected(handleReconnected);

            await hub.start().then(()=>{setConnection(hub)}).catch(err => {
                if (err?.message?.includes("401") || err?.statusCode === 401) {
                setAuthenticationState(null);
                }
            });
        
            
       
        
    };

}
