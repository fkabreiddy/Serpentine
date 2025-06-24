import React, { useEffect, useState } from "react";
import { useGlobalDataStore } from "@/contexts/global-data-context";
import ChannelInfo from "@/components/channels/common/channel-info";
import IconButton from "@/components/common/icon-button";
import { X } from "lucide-react";
export default function DefaultView(){
    const {currentChannelId, currentGroupId } = useGlobalDataStore();
    const [channelId, setChannelId] = useState<string | null>(null);
    const [groupId, setGroupId] = useState<string | null>(null)

    useEffect(()=>{

        if(currentChannelId !== channelId)
        {
             setChannelId(currentChannelId);
            setGroupId(null);
        }

    


    }, [currentChannelId])

    useEffect(()=>{

        if(currentGroupId !== groupId)
        {
            setGroupId(currentGroupId);
            setChannelId(null);
        }

    


    }, [currentGroupId])

    const resetValues = () =>{
        setChannelId(null);
        setGroupId(null);
    }

    
    return (
        <>
            {!channelId && !groupId && (
                <div className="flex flex-col gap-1">
                    <div className="doodle-pattern"></div>

                    <p className="font-normal text-center text-xs">No channel or group selected</p>
                </div>
            )}

            {
                (channelId || groupId) && (
                    <div className="fixed top-2 right-2">
                        <IconButton tooltipText="Close" onClick={resetValues}>
                            <X className="size-[18px]"/>
                        </IconButton>
                    </div>
                )
            }
            {channelId && !groupId && <ChannelInfo/>}
            {!channelId && groupId && <></>}
        </>
    );




}