import { useEffect, useState } from "react";
import { useFetch } from '../helpers/axios-helper';
 import ApiResult from "@/models/api-result";
import { ChannelResponse } from "@/models/responses/channel-response";
import { handleApiErrors, handleApiSuccess } from "@/helpers/api-results-handler-helper";


const initialApiState = <T>(): ApiResult<T> => ({
    statusCode: 0,
    message: "",
    isSuccess: false,
    errors: [],
    resultTitle: "",
    data: null
});


export function useDeleteChannel() {

    const [deletingChannel, setDeletingChannel] = useState<boolean>(false);
    const [channelDeleted, setChannelDeleted] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<boolean> | null>(null);
    const { delete: deleteCh } = useFetch<boolean>();
    useEffect(() => {
       
        if(!result)
        {
            setDeletingChannel(false);
            setChannelDeleted(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
           handleApiSuccess(result);
           setChannelDeleted(true);

        } 
        else {
            handleApiErrors(result);
            setChannelDeleted(false);
        }

        setDeletingChannel(false);
        setResult(null);

    }, [result]);
    


    const deleteChannel = async (data: DeleteChannelRequest) => {

        setChannelDeleted(false);
        setResult(null);
        setDeletingChannel(true);
        const response = await deleteCh({endpoint: "channels/delete", contentType: "application/json"}, data );
        setResult(response);

    };

    

    return { deleteChannel, result, deletingChannel, channelDeleted};
}
export function useCreateChannel() {

    const [channel, setChannel] = useState<ChannelResponse | null>(null);
    const [creatingChannel, setCreatingChannel] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelResponse> | null>(null);
    const { post } = useFetch<ChannelResponse>();

    useEffect(() => {
       

        if(!result)
        {
            setCreatingChannel(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
           setChannel(result.data);
            console.log(result.data);

           handleApiSuccess(result);

        } 
        else {
            
            handleApiErrors(result);
        }

        setCreatingChannel(false);
        setResult(null);


    }, [result]);

   
    const createChannel = async (data: FormData) => {
       
        setResult(null);
        setCreatingChannel(true);
        setChannel(null);
        const response = await post({endpoint: "channels/create", contentType: "multipart/form-data"}, data );
        setResult(response);

            
        
       
    };

    return { createChannel, channel, creatingChannel};
}

export function useGetChannelsByUserId() {

    
    const [channels, setChannels] = useState<ChannelResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingChannels, setLoadingChannels] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelResponse[]> | null>(null);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const { get } = useFetch<ChannelResponse[]>();

   
    useEffect(() => {
       

        if(!result)
        {
            setLoadingChannels(false);
            return;
        }

        

        if (result.data && result.statusCode === 200) {
           setChannels(prev => [...prev, ...(result.data || [])]);

        } 
        else {
            setHasMore(false);
            handleApiErrors(result);
        }

        setLoadingChannels(false);
        setResult(null);


    }, [result]);
    
    

   
    const getChannelsByUserId = async (data: GetChannelsByUserIdRequest) => {
        let has = true;
        let channelCount = 0;
        setIsBusy(true);
        setResult(null);
        setChannels([]);
        setHasMore(true);
        setLoadingChannels(true);
        do{

            
            data.skip = channelCount;
            const response = await get({endpoint: "channels/by-userId" }, data );
            has = (response.data !== null && response.data.length == 5);
            channelCount += response.data?.length || 0;
            setResult(response);
        }while (has);

        setIsBusy(false);
        setHasMore(has);
       
    };

    return { getChannelsByUserId, channels, loadingChannels, setChannels, result, hasMore, isBusy};
}

export function useGetManyChannelsByNameOrId() {

    
    const [channels, setChannels] = useState<ChannelResponse[]>([]);
    const [loadingChannels, setLoadingChannels] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelResponse[]> | null>(null);
    const { get } = useFetch<ChannelResponse[]>();

   
    useEffect(() => {
       

        if(!result)
        {
            setLoadingChannels(false);
            return;
        }

        

        if (result.data && result.isSuccess) {
           setChannels(result.data);

        } 
        else {
            
            handleApiErrors(result);
        }

        setResult(null);


    }, [result]);

   
    const getManyChannelsByNameOrId = async (data: GetManyChannelsByNameOrIdRequest) => {
        
        setChannels([]);
        
        setResult(null);
        setLoadingChannels(true);
    
        const response = await get({endpoint: "channels/by-id-or-name" }, data );
        
        setResult(response);

       
    };

    return { getManyChannelsByNameOrId, channels, loadingChannels, setChannels, result};
}

export function useGetChannelById() {


    const [channel, setChannel] = useState<ChannelResponse | null>(null);
    const [loadingChannel, setLoadingChannel] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelResponse> | null>(null);
    const { get } = useFetch<ChannelResponse>();

   
    useEffect(() => {
       

        if(!result)
        {
            setLoadingChannel(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
           setChannel(result.data);
        } 
        else {
            handleApiErrors(result);
        }

        setLoadingChannel(false);
        setResult(null);

    }, [result]);

    const getChannelById = async (data: GetChannelByIdRequest) => {

        setResult(null);
        setChannel(null);
        setLoadingChannel(true);

        const response = await get({endpoint: "channels/by-id" }, data );

        setResult(response);
    };

    return { getChannelById, channel, loadingChannel, setChannel, result };
}