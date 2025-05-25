import { useEffect, useState, useTransition } from "react";
import { useFetch } from '../helpers/axios-helper';
 import ApiResult, { HookState } from "@/models/api-result";
import { ChannelResponse } from "@/models/responses/channel-response";
import { showToast } from '../helpers/sonner-helper';

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
    const [result, setResult] = useState<ApiResult<ChannelResponse[]>>(initialApiState);
    const { get } = useFetch<ChannelResponse[]>();

    useEffect(() => {
       

        if (result.data && result.statusCode === 200) {
           setChannels(prev => [...prev, ...(result.data || [])]);
            setHasMore(result.data.length >= 5);

        } 
        else {
            setHasMore(false);
            
            handleApiErrors(result);
        }

    }, [result]);

   
    const getChannelsByUserId = async (data: GetChannelsByUserIdRequest) => {
        let has = true;
        setResult(initialApiState());
        setChannels([]);
        setHasMore(true);
        do{

            const response = await get({endpoint: "channels/by-userId?", requireToken: true,}, data );
            has = (response.data !== null && response.data.length >= 5);
            setResult(response);
            
        }while (has);
       
    };

    return { getChannelsByUserId, channels, result, hasMore, setChannels, setHasMore };
}