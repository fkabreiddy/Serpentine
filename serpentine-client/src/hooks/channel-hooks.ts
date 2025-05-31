import { useEffect, useState, useTransition } from "react";
import { useFetch } from '../helpers/axios-helper';
 import ApiResult, { HookState } from "@/models/api-result";
import { ChannelResponse } from "@/models/responses/channel-response";
import { showToast } from '../helpers/sonner-helper';
import { set } from "date-fns";

const initialApiState = <T>(): ApiResult<T> => ({
    statusCode: 0,
    message: "",
    isSuccess: false,
    errors: [],
    data: null
});

const handleApiErrors = (data: ApiResult<any>) => {
   
    data.errors?.forEach(error => {
        showToast({
            title: "Validation Error",
            description: error,
        });
    });
    
};



export function useGetChannelsByUserId() {

    
    const [channels, setChannels] = useState<ChannelResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingChannels, setLoadingChannels] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<ChannelResponse[]> | null>(null);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const { get } = useFetch<ChannelResponse[]>();

    useEffect(() => {
       
       console.log("activated")

        if(!result)
        {
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
        console.log(channels)
        setHasMore(true);
        setLoadingChannels(true);
        do{

            
            data.skip = channelCount;
            const response = await get({endpoint: "channels/by-userId?", requireToken: true,}, data );
            has = (response.data !== null && response.data.length >= 5);
            channelCount += response.data?.length || 0;
            setResult(response);
            
        }while (has);

        setIsBusy(false);
        setHasMore(has);
       
    };

    return { getChannelsByUserId, channels, loadingChannels, result, hasMore, isBusy};
}