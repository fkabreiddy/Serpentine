import { handleApiErrors, handleApiSuccess } from "@/helpers/api-results-handler-helper";
import { useFetch } from "@/helpers/axios-helper";
import ApiResult from "@/models/api-result";
import {CreateChannelBanRequest} from "@/models/requests/channel-ban/create-channel-ban-request";
import ChannelBanResponse from "@/models/responses/channel-ban-response";
import { useState, useEffect } from "react";
const CHANNEL_BAN_ENDPOINT = "channel-bans"
export function useCreateBan() {

    const [ban, setBan] = useState<ChannelBanResponse | null>(null);
    const [creatingBan, setCreatingBan] = useState(false);
    const [result, setResult] = useState<ApiResult<ChannelBanResponse> | null>(null);
    const { post } = useFetch<ChannelBanResponse>();

    useEffect(() => {
       

        if(!result)
        {
            setCreatingBan(false);
            return;
        }

        if (result.data && result.statusCode === 200) {
           setBan(result.data);
            handleApiSuccess(result);

        } 
        else {
            
            handleApiErrors(result);
        }

        setCreatingBan(false);
        setResult(null);


    }, [result]);

   
    const createBan = async (data: CreateChannelBanRequest) => {
       
        
        setResult(null);
        setCreatingBan(true);
        setBan(null);
        const response = await post({endpoint: CHANNEL_BAN_ENDPOINT, contentType: "application/json"}, data );
        setResult(response);

            
        
       
    };

    return { createBan, ban, creatingBan};
}


