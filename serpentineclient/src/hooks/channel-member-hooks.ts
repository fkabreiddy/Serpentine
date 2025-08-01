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


export function useGetChannelMembersByChannelId() {

    
    const [channelMembers, setChannelMembers] = useState<ChannelMemberResponse[]>([]);
    const [loadingChannelMembers, setloadingChannelMembers] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelMemberResponse[]> | null>(null);
    const { get } = useFetch<ChannelMemberResponse[]>();
    const [hasMore, setHasMore] = useState(true);

   
    useEffect(() => {
       

        if(!result)
        {

            setloadingChannelMembers(false);
            return;
        }

        

        if (result.data  && result.isSuccess) {
            setChannelMembers((prev) => [...prev, ...(result.data ?? [])]);

            if(result.data.length <= 4)
            {
            setHasMore(false);

              setResult(null);

            }

        } 
        else {
            handleApiErrors(result);
        }

        setResult(null);


    }, [result]);
    
    

   
    const getChannelMembersByChannelId = async (data: GetChannelMembersByChannelIdRequest) => {
        
        setHasMore(true);
        setResult(null);
        setloadingChannelMembers(true);
       
        const response = await get({endpoint: "channel-members/by-channelId" }, data );
        
        setResult(response);

       
    };

    return { getChannelMembersByChannelId, channelMembers, hasMore, loadingChannelMembers};
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

export function useTest(){

    const [result, setResult] = useState<ApiResult<string> | null>(null);
    const [fetching, setFetching] = useState<boolean>(false);
    const [channelMember, setChannelMember] = useState<string | null>(null);
    const {delete: fetchDelete} = useFetch<string>();

    useEffect(()=>{


        if(!result)
        {
            return;
        }

        if(result.data && result.isSuccess)
        {
            setChannelMember(result.data);
        }
        else{
            handleApiErrors(result);
        }

        setFetching(false);
        setResult(null);
    },[result])

    const test  = async (data: {typeOfResponse : string}) => {

        setResult(null);
        setChannelMember(null);
        setFetching(true);

        const response = await fetchDelete({endpoint: "channel-members/test", contentType: "application/json" }, data)

        setResult(response);

    }   

    return{

        fetching,
        test,
        setChannelMember,
        channelMember
    }
}