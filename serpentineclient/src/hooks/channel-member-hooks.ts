import { handleApiErrors } from "@/helpers/api-results-handler-helper";
import { useFetch } from "@/helpers/axios-helper";
import { showToast } from "@/helpers/sonner-helper";
import ApiResult from "@/models/api-result";
import { ChannelMemberResponse } from "@/models/responses/channel-member-response";
import { useState, useEffect } from "react";

export function useGetChannelMemberByUserAndChannelId() {

    
    const [channelMember, setChannelMember] = useState<ChannelMemberResponse | null>(null);
    const [loadingChannelMember, setloadingChannelMember] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelMemberResponse> | null>(null);
    const { get } = useFetch<ChannelMemberResponse>();

   
    useEffect(() => {
       

        if(!result)
        {
            setloadingChannelMember(false);
            return;
        }

        

        if (result.data && result.isSuccess) {
           setChannelMember(result.data)

        } 
        else {
            handleApiErrors(result);
        }

        setResult(null);


    }, [result]);
    
    

   
    const getChannelMemberByUserAndChannelId = async (data: GetChannelMemberByChannelAndUserIdRequest) => {
        
        setResult(null);
        setChannelMember(null);
        setloadingChannelMember(true);
       
        const response = await get({endpoint: "channel-members/by-user-channel-id" }, data );
        
        setResult(response);

       
    };

    return { getChannelMemberByUserAndChannelId, channelMember, loadingChannelMember};
}



export function useCreateChannelMember(){

    const [result, setResult] = useState<ApiResult<ChannelMemberResponse> | null>(null);
    const [joining, setJoining] = useState<boolean>(false);
    const [channelMember, setChannelMember] = useState<ChannelMemberResponse | null>(null);
    const {post} = useFetch<ChannelMemberResponse>();

    useEffect(()=>{


        if(!result)
        {
            setJoining(false);
            return;
        }

        if(result.data && result.isSuccess)
        {
            setChannelMember(result.data);
        }
        
        else{
            handleApiErrors(result);
        }

        setResult(null);
    },[result])

    const createChannelMember  = async (body: CreateChannelMemberRequest) => {

        setResult(null);
        setChannelMember(null);
        setJoining(true);

        const response = await post({endpoint: "channel-members/create", contentType: "application/json" }, body)

        setResult(response);

    }   

    return{

        joining,
        createChannelMember,
        setChannelMember,
        channelMember
    }
}