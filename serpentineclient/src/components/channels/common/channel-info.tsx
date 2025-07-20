import React, { useEffect } from "react";
import { useGlobalDataStore } from "@/contexts/global-data-context";


export default function ChannelInfo(){
    const {currentChannelId} = useGlobalDataStore();

    useEffect(()=>{


    },[currentChannelId])
    return(
        <div>
            <div>{currentChannelId}</div>
        </div>
    )
}