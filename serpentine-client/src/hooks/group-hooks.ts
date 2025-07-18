import {useEffect, useState} from "react";
import ApiResult from "@/models/api-result.ts";
import {useFetch} from "@/helpers/axios-helper.ts";
import {handleApiErrors} from "@/helpers/api-results-handler-helper.ts";
import {GroupResponse} from "@/models/responses/group-response.ts";
import {GetGroupsByChannelIdRequest} from "@/models/requests/groups/get-by-channel-id-request.ts";

export function useGetGroupsByChannelId() {


    const [groups, setGroups] = useState<GroupResponse[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loadingGroups, setLoadingGroups] = useState<boolean>(false);
    const [result, setResult] = useState<ApiResult<GroupResponse[]> | null>(null);
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const { get } = useFetch<GroupResponse[]>();


    useEffect(() => {


        if(!result)
        {
            return;
        }



        if (result.data && result.statusCode === 200) {
            setGroups(prev => [...prev, ...(result.data || [])]);

        }
        else {
            setHasMore(false);

            handleApiErrors(result);
        }

        setLoadingGroups(false);
        setResult(null);


    }, [result]);


    const getGroupsByChannelId = async (data: GetGroupsByChannelIdRequest) => {
        let has = true;
        let channelCount = 0;
        setIsBusy(true);
        setResult(null);
        setGroups([]);
        setHasMore(true);
        setLoadingGroups(true);
        do{


            data.skip = channelCount;
            const response = await get({endpoint: "groups/by-channel-id?" }, data );
            has = (response.data !== null && response.data.length == 5);
            channelCount += response.data?.length || 0;
            setResult(response);
        }while (has);

        setIsBusy(false);
        setHasMore(has);

    };

    return { getGroupsByChannelId, groups, loadingGroups, setGroups, result, hasMore, isBusy};
}